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

    // Get mood logs from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: moodLogs, error: moodError } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (moodError) throw moodError;

    // Get journal entries
    const { data: journalEntries, error: journalError } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(5);

    if (journalError) throw journalError;

    // Use AI to analyze mood patterns
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const moodSummary = moodLogs?.map(m => `${m.mood} on ${new Date(m.created_at).toLocaleDateString()}: ${m.note || 'no note'}`).join('\n') || 'No mood logs';
    const journalSummary = journalEntries?.map(j => `${j.title}: ${j.content?.substring(0, 100)}...`).join('\n') || 'No journal entries';

    const analysisPrompt = `Analyze this user's mental health data from the last 7 days:

MOOD LOGS:
${moodSummary}

JOURNAL ENTRIES:
${journalSummary}

Provide a brief analysis (2-3 sentences) focusing on:
1. Overall mood trend
2. Any concerning patterns
3. Positive observations

Keep it supportive and constructive.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a compassionate mental health analyst. Provide brief, supportive insights.' },
          { role: 'user', content: analysisPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      throw new Error('AI analysis failed');
    }

    const aiData = await aiResponse.json();
    const analysis = aiData.choices[0].message.content;

    // Calculate wellness score
    const moodScores: Record<string, number> = {
      'very-happy': 100,
      'happy': 80,
      'neutral': 60,
      'sad': 40,
      'very-sad': 20,
    };

    const avgScore = moodLogs && moodLogs.length > 0
      ? Math.round(moodLogs.reduce((sum, log) => sum + (moodScores[log.mood] || 60), 0) / moodLogs.length)
      : 60;

    // Save wellness score
    await supabase.from('wellness_scores').insert({
      user_id: user.id,
      score: avgScore,
      factors: {
        mood_logs_count: moodLogs?.length || 0,
        journal_entries_count: journalEntries?.length || 0,
        analysis_summary: analysis,
      },
    });

    return new Response(JSON.stringify({
      wellnessScore: avgScore,
      analysis,
      moodLogsCount: moodLogs?.length || 0,
      journalEntriesCount: journalEntries?.length || 0,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Mood analysis error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
