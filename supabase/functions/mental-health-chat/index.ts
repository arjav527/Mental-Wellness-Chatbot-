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
    const { messages, botType, sessionId } = await req.json();
    const authHeader = req.headers.get('Authorization');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader ?? '' } } }
    );
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Define system prompts based on bot type with crisis detection
    const systemPrompts = {
      mentor: `You are a professional mental health mentor with crisis detection capabilities. Your role is to:
- Provide evidence-based psychological support and guidance
- Use therapeutic techniques like CBT and mindfulness
- Analyze sentiment and emotional state (label as: positive, neutral, negative, crisis)
- Detect emotional distress and recommend professional help when needed
- Suggest coping strategies and self-care practices
- Be empathetic, non-judgmental, and supportive
- **CRISIS DETECTION**: If someone expresses severe distress, suicidal thoughts, self-harm, or emergency situation, respond with urgent care and include the phrase "CRISIS_DETECTED" in your response
- Recommend specific wellness activities (breathing exercises, journaling, mood logging)
- Keep responses concise (2-3 paragraphs max) and actionable`,
      
      friend: `You are a warm, supportive friend for someone seeking emotional support with crisis awareness. Your role is to:
- Provide casual, friendly emotional support
- Listen without judgment and validate feelings
- Share encouraging words and light-hearted perspectives
- Suggest mood-boosting activities like music, walks, or hobbies
- Be conversational, empathetic, and relatable
- **CRISIS AWARENESS**: If someone shares serious concerns, suicidal thoughts, or self-harm, express concern and include the phrase "CRISIS_DETECTED" in your response
- Keep responses friendly and conversational (2-3 paragraphs max)`,
    };

    const systemPrompt = systemPrompts[botType as keyof typeof systemPrompts] || systemPrompts.mentor;
    
    // Detect crisis keywords in user messages
    const lastUserMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
    const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'want to die', 'self-harm', 'hurt myself', 'no point living'];
    const hasCrisisKeywords = crisisKeywords.some(keyword => lastUserMessage.includes(keyword));

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Log conversation to database if sessionId provided
    if (sessionId && authHeader) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Save user message
          await supabase.from('chat_messages').insert({
            session_id: sessionId,
            user_id: user.id,
            bot_type: botType,
            role: 'user',
            content: messages[messages.length - 1].content,
            sentiment: hasCrisisKeywords ? 'crisis' : 'neutral',
          });
          
          // Generate crisis insight if needed
          if (hasCrisisKeywords) {
            await supabase.from('user_insights').insert({
              user_id: user.id,
              insight_type: 'crisis_detected',
              title: 'Crisis Keywords Detected',
              description: 'Emergency support may be needed. Consider reaching out to professional help.',
              recommendations: ['Contact emergency helpline', 'Reach out to a trusted friend or family member', 'Visit emergency services if in immediate danger'],
              priority: 'urgent',
            });
          }
        }
      } catch (dbError) {
        console.error('Database logging error:', dbError);
      }
    }

    return new Response(response.body, {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'text/event-stream',
        'X-Crisis-Detected': hasCrisisKeywords ? 'true' : 'false'
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});