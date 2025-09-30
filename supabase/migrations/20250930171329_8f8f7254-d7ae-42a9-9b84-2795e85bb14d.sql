-- Add conversation sessions for persistent chat history
CREATE TABLE public.conversation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  bot_type TEXT NOT NULL,
  title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.conversation_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON public.conversation_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions"
  ON public.conversation_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON public.conversation_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON public.conversation_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Update chat_messages to link to sessions and add sentiment
ALTER TABLE public.chat_messages ADD COLUMN session_id UUID REFERENCES public.conversation_sessions(id) ON DELETE CASCADE;
ALTER TABLE public.chat_messages ADD COLUMN sentiment TEXT;
ALTER TABLE public.chat_messages ADD COLUMN detected_mood TEXT;

-- Wellness scores for tracking overall mental health
CREATE TABLE public.wellness_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  factors JSONB,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.wellness_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wellness scores"
  ON public.wellness_scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wellness scores"
  ON public.wellness_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Activity logs for tracking user engagement
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  activity_type TEXT NOT NULL,
  activity_data JSONB,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity logs"
  ON public.activity_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity logs"
  ON public.activity_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Emergency resources and crisis helplines
CREATE TABLE public.emergency_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country TEXT NOT NULL,
  region TEXT,
  resource_type TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  available_24_7 BOOLEAN DEFAULT false,
  languages TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.emergency_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view emergency resources"
  ON public.emergency_resources FOR SELECT
  USING (true);

-- Insights and recommendations
CREATE TABLE public.user_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  insight_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  recommendations TEXT[],
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  acknowledged BOOLEAN DEFAULT false
);

ALTER TABLE public.user_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own insights"
  ON public.user_insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own insights"
  ON public.user_insights FOR UPDATE
  USING (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX idx_chat_messages_session ON public.chat_messages(session_id);
CREATE INDEX idx_chat_messages_user ON public.chat_messages(user_id);
CREATE INDEX idx_mood_logs_user_date ON public.mood_logs(user_id, created_at DESC);
CREATE INDEX idx_wellness_scores_user_date ON public.wellness_scores(user_id, calculated_at DESC);
CREATE INDEX idx_activity_logs_user_date ON public.activity_logs(user_id, created_at DESC);

-- Add triggers for updated_at
CREATE TRIGGER update_conversation_sessions_updated_at
  BEFORE UPDATE ON public.conversation_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample emergency resources
INSERT INTO public.emergency_resources (country, region, resource_type, name, phone, website, available_24_7, languages) VALUES
('India', 'National', 'crisis_helpline', 'Vandrevala Foundation Helpline', '1860-2662-345', 'https://www.vandrevalafoundation.com', true, ARRAY['English', 'Hindi']),
('India', 'National', 'crisis_helpline', 'iCall Helpline', '022-25521111', 'https://icallhelpline.org', true, ARRAY['English', 'Hindi']),
('India', 'Jammu & Kashmir', 'crisis_helpline', 'J&K Mental Health Helpline', '1800-180-7020', NULL, true, ARRAY['English', 'Hindi', 'Urdu', 'Kashmiri']),
('India', 'National', 'emergency', 'National Emergency Number', '112', NULL, true, ARRAY['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi']),
('India', 'National', 'suicide_prevention', 'AASRA Suicide Prevention', '91-9820466726', 'http://www.aasra.info', true, ARRAY['English', 'Hindi']);