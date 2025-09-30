import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, TrendingUp, RefreshCw } from "lucide-react";
import { WellnessScore } from "@/hooks/useWellnessData";

type Props = {
  score: WellnessScore | null;
  onRefresh: () => void;
  loading: boolean;
};

export const WellnessScoreCard = ({ score, onRefresh, loading }: Props) => {
  const getScoreColor = (value: number) => {
    if (value >= 80) return "from-green-500 to-emerald-500";
    if (value >= 60) return "from-blue-500 to-cyan-500";
    if (value >= 40) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  const getScoreLabel = (value: number) => {
    if (value >= 80) return "Excellent";
    if (value >= 60) return "Good";
    if (value >= 40) return "Fair";
    return "Needs Attention";
  };

  return (
    <Card className="backdrop-blur-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] p-6 shadow-[var(--shadow-glass)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-gradient-to-br from-primary to-secondary">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Wellness Score</h3>
            <p className="text-sm text-muted-foreground">
              {score ? new Date(score.calculated_at).toLocaleDateString() : "No data yet"}
            </p>
          </div>
        </div>
        <Button
          onClick={onRefresh}
          disabled={loading}
          variant="outline"
          size="sm"
          className="rounded-full"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Analyzing..." : "Refresh"}
        </Button>
      </div>

      {score ? (
        <>
          <div className="relative w-full h-4 bg-secondary/20 rounded-full overflow-hidden mb-4">
            <div
              className={`absolute left-0 top-0 h-full bg-gradient-to-r ${getScoreColor(score.score)} transition-all duration-1000`}
              style={{ width: `${score.score}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className={`text-4xl font-bold bg-gradient-to-r ${getScoreColor(score.score)} bg-clip-text text-transparent`}>
                {score.score}/100
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {getScoreLabel(score.score)}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span>Based on recent activity</span>
              </div>
            </div>
          </div>

          {score.factors?.analysis_summary && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                {score.factors.analysis_summary}
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            Generate your first wellness analysis to track your mental health journey
          </p>
          <Button onClick={onRefresh} disabled={loading}>
            Generate Analysis
          </Button>
        </div>
      )}
    </Card>
  );
};
