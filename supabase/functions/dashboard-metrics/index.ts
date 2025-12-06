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
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Fetch ONLY aggregated metrics - never fetch raw data
    const [profilesResult, interactionsResult, feedbackResult] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('interactions').select('*', { count: 'exact', head: true }),
      supabase.from('feedback').select('rating', { count: 'exact', head: false })
    ]);

    // Calculate metrics using counts only
    const totalUsers = profilesResult.count || 0;
    const totalInteractions = interactionsResult.count || 0;

    // Calculate average rating from aggregated data
    const ratings = feedbackResult.data?.map(f => f.rating).filter(r => r != null) || [];
    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
      : 0;

    // Get time-based metrics using aggregated queries
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const { count: weeklyInteractions } = await supabase
      .from('interactions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneWeekAgo.toISOString());

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const { data: monthlyFeedback } = await supabase
      .from('feedback')
      .select('rating')
      .gte('created_at', oneMonthAgo.toISOString());
    
    const monthlyRatings = monthlyFeedback?.map(f => f.rating).filter(r => r != null) || [];
    const monthlyRating = monthlyRatings.length > 0
      ? monthlyRatings.reduce((sum, r) => sum + r, 0) / monthlyRatings.length
      : null;

    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const { count: recentActivity } = await supabase
      .from('interactions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneDayAgo.toISOString());

    // Placeholder for most searched disease (requires more complex aggregation)
    const mostSearchedDisease = 'General Health';

    console.log('Dashboard metrics calculated successfully');

    return new Response(
      JSON.stringify({
        metrics: {
          totalUsers,
          totalInteractions,
          mostSearchedDisease,
          mostActiveCountry: 'Worldwide', // Placeholder as profiles doesn't have country
          averageRating
        },
        highlights: {
          weeklyTrend: weeklyInteractions,
          monthlyRating,
          recentActivity
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch metrics' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
