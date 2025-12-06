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

    console.log('Processing interaction submission from IP:', ip);

    // Check rate limit (30 seconds between submissions)
    const { data: rateLimit } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('identifier', ip)
      .maybeSingle();

    if (rateLimit) {
      const timeSince = Date.now() - new Date(rateLimit.last_submission).getTime();
      if (timeSince < 30000) {
        const waitTime = Math.ceil((30000 - timeSince) / 1000);
        console.log(`Rate limit hit for IP ${ip}. Wait time: ${waitTime}s`);
        return new Response(
          JSON.stringify({ 
            error: 'Please wait before submitting another message',
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
    const { question, answer, anonymousId } = await req.json();

    if (!question || !answer) {
      return new Response(
        JSON.stringify({ error: 'Question and answer are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Insert interaction
    const { data: interaction, error: insertError } = await supabase
      .from('interactions')
      .insert({
        question,
        answer,
        anonymous_id: anonymousId,
        user_id: null
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting interaction:', insertError);
      throw insertError;
    }

    // Update rate limit
    await supabase
      .from('rate_limits')
      .upsert({
        identifier: ip,
        last_submission: new Date().toISOString(),
        submission_count: (rateLimit?.submission_count || 0) + 1
      });

    console.log('Interaction created successfully:', interaction.id);

    return new Response(
      JSON.stringify({ success: true, interactionId: interaction.id }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in submit-interaction function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to submit interaction' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
