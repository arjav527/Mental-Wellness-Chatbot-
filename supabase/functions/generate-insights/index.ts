import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user activity data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [moodLogs, journalEntries, todos, activityLogs] = await Promise.all([
      supabase.from('mood_logs').select('*').eq('user_id', user.id).gte('created_at', thirtyDaysAgo.toISOString()),
      supabase.from('journal_entries').select('*').eq('user_id', user.id).gte('created_at', thirtyDaysAgo.toISOString()),
      supabase.from('todos').select('*').eq('user_id', user.id),
      supabase.from('activity_logs').select('*').eq('user_id', user.id).gte('created_at', thirtyDaysAgo.toISOString()),
    ]);

    const insights = [];

    // Check mood consistency
    if (moodLogs.data && moodLogs.data.length >= 3) {
      const recentMoods = moodLogs.data.slice(0, 3);
      const negativeMoods = recentMoods.filter(m => ['sad', 'very-sad'].includes(m.mood));
      
      if (negativeMoods.length >= 2) {
        insights.push({
          user_id: user.id,
          insight_type: 'mood_pattern',
          title: 'Mood Pattern Alert',
          description: 'You\'ve been experiencing lower moods recently. This is a great time to reach out for support.',
          recommendations: [
            'Consider talking to a counselor',
            'Practice daily mindfulness exercises',
            'Connect with friends or family',
            'Try the breathing exercises in Relaxation section'
          ],
          priority: 'high',
        });
      }
    }

    // Check journaling consistency
    const journalDays = new Set(journalEntries.data?.map(j => new Date(j.created_at).toDateString()) || []);
    if (journalDays.size >= 7) {
      insights.push({
        user_id: user.id,
        insight_type: 'positive_habit',
        title: 'Great Journaling Streak!',
        description: `You've been journaling consistently - you've written ${journalEntries.data?.length} entries in the last 30 days. Keep it up!`,
        recommendations: [
          'Try exploring deeper emotions in your entries',
          'Use prompts to guide your reflection',
          'Review past entries to see your growth'
        ],
        priority: 'low',
      });
    } else if (journalEntries.data && journalEntries.data.length === 0) {
      insights.push({
        user_id: user.id,
        insight_type: 'recommendation',
        title: 'Start Your Journaling Journey',
        description: 'Journaling can help process emotions and track your mental health journey.',
        recommendations: [
          'Start with 5 minutes a day',
          'Write about your day or feelings',
          'Try gratitude journaling'
        ],
        priority: 'medium',
      });
    }

    // Check task completion
    const completedTodos = todos.data?.filter(t => t.completed) || [];
    const totalTodos = todos.data?.length || 0;
    
    if (totalTodos > 0 && completedTodos.length / totalTodos < 0.3) {
      insights.push({
        user_id: user.id,
        insight_type: 'task_support',
        title: 'Task Management Support',
        description: 'It looks like you might be feeling overwhelmed with tasks. Let\'s break them down.',
        recommendations: [
          'Focus on 1-2 priority tasks today',
          'Break large tasks into smaller steps',
          'Celebrate small wins',
          'Consider if some tasks can be delegated or delayed'
        ],
        priority: 'medium',
      });
    }

    // Check app engagement
    const recentActivity = activityLogs.data || [];
    if (recentActivity.length === 0) {
      insights.push({
        user_id: user.id,
        insight_type: 'engagement',
        title: 'Explore More Features',
        description: 'There are many tools here to support your mental health journey.',
        recommendations: [
          'Try the AI chatbot for emotional support',
          'Use the mood tracker daily',
          'Explore relaxation exercises',
          'Check out recommended videos'
        ],
        priority: 'low',
      });
    }

    // Save insights to database
    if (insights.length > 0) {
      const { error: insertError } = await supabase
        .from('user_insights')
        .insert(insights);
      
      if (insertError) throw insertError;
    }

    return new Response(JSON.stringify({
      insights,
      summary: {
        moodLogsCount: moodLogs.data?.length || 0,
        journalEntriesCount: journalEntries.data?.length || 0,
        todosCount: totalTodos,
        completedTodosCount: completedTodos.length,
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Insights generation error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
