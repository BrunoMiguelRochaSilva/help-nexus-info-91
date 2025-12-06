import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get IP address for rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
               req.headers.get('x-real-ip') || 
               'unknown';

    console.log('Processing feedback submission from IP:', ip);

    // Check rate limit (60 seconds between feedback submissions)
    const { data: rateLimit } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('identifier', `feedback_${ip}`)
      .maybeSingle();

    if (rateLimit) {
      const timeSince = Date.now() - new Date(rateLimit.last_submission).getTime();
      if (timeSince < 60000) {
        const waitTime = Math.ceil((60000 - timeSince) / 1000);
        console.log(`Rate limit hit for feedback from IP ${ip}. Wait time: ${waitTime}s`);
        return new Response(
          JSON.stringify({ 
            error: 'Please wait before submitting another feedback',
            waitTime 
          }),
          { 
            status: 429, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    // Parse and validate request body
    const { interactionId, rating, comment } = await req.json();

    if (!interactionId || !rating) {
      return new Response(
        JSON.stringify({ error: 'Interaction ID and rating are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return new Response(
        JSON.stringify({ error: 'Rating must be between 1 and 5' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Insert feedback
    const { data: feedback, error: insertError } = await supabase
      .from('feedback')
      .insert({
        interaction_id: interactionId,
        rating,
        comment: comment || null,
        user_id: null
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting feedback:', insertError);
      throw insertError;
    }

    // Update rate limit with feedback-specific prefix
    await supabase
      .from('rate_limits')
      .upsert({
        identifier: `feedback_${ip}`,
        last_submission: new Date().toISOString(),
        submission_count: (rateLimit?.submission_count || 0) + 1
      });

    console.log('Feedback created successfully:', feedback.id);

    return new Response(
      JSON.stringify({ success: true, feedbackId: feedback.id }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in submit-feedback function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to submit feedback' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
