import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export type WellnessScore = {
  id: string;
  score: number;
  factors: any;
  calculated_at: string;
};

export type UserInsight = {
  id: string;
  insight_type: string;
  title: string;
  description: string;
  recommendations: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  acknowledged: boolean;
};

export const useWellnessData = () => {
  const [wellnessScore, setWellnessScore] = useState<WellnessScore | null>(null);
  const [insights, setInsights] = useState<UserInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchWellnessData();
  }, []);

  const fetchWellnessData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get latest wellness score
      const { data: scoreData, error: scoreError } = await supabase
        .from('wellness_scores')
        .select('*')
        .eq('user_id', user.id)
        .order('calculated_at', { ascending: false })
        .limit(1)
        .single();

      if (scoreError && scoreError.code !== 'PGRST116') throw scoreError;
      setWellnessScore(scoreData);

      // Get unacknowledged insights
      const { data: insightsData, error: insightsError } = await supabase
        .from('user_insights')
        .select('*')
        .eq('user_id', user.id)
        .eq('acknowledged', false)
        .order('created_at', { ascending: false });

      if (insightsError) throw insightsError;
      setInsights((insightsData || []) as UserInsight[]);
    } catch (error) {
      console.error('Error fetching wellness data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load wellness data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateNewAnalysis = async () => {
    try {
      setLoading(true);
      
      // Call analyze-mood function
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke(
        'analyze-mood'
      );

      if (analysisError) throw analysisError;

      // Call generate-insights function
      const { data: insightsData, error: insightsError } = await supabase.functions.invoke(
        'generate-insights'
      );

      if (insightsError) throw insightsError;

      // Refresh data
      await fetchWellnessData();

      toast({
        title: 'Analysis Complete',
        description: 'Your wellness analysis has been updated',
      });
    } catch (error) {
      console.error('Error generating analysis:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate analysis',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeInsight = async (insightId: string) => {
    try {
      const { error } = await supabase
        .from('user_insights')
        .update({ acknowledged: true })
        .eq('id', insightId);

      if (error) throw error;

      setInsights(insights.filter(i => i.id !== insightId));
      
      toast({
        title: 'Insight acknowledged',
      });
    } catch (error) {
      console.error('Error acknowledging insight:', error);
      toast({
        title: 'Error',
        description: 'Failed to acknowledge insight',
        variant: 'destructive',
      });
    }
  };

  return {
    wellnessScore,
    insights,
    loading,
    generateNewAnalysis,
    acknowledgeInsight,
    refreshData: fetchWellnessData,
  };
};
