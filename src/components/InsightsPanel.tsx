import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Lightbulb, TrendingUp, X } from "lucide-react";
import { UserInsight } from "@/hooks/useWellnessData";

type Props = {
  insights: UserInsight[];
  onAcknowledge: (id: string) => void;
};

export const InsightsPanel = ({ insights, onAcknowledge }: Props) => {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'high':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'medium':
        return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      default:
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'from-red-500/20 to-orange-500/20 border-red-500/30';
      case 'high':
        return 'from-orange-500/20 to-yellow-500/20 border-orange-500/30';
      case 'medium':
        return 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
      default:
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
    }
  };

  if (insights.length === 0) {
    return (
      <Card className="backdrop-blur-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] p-8 text-center shadow-[var(--shadow-glass)]">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
        <p className="text-muted-foreground">
          No new insights at the moment. Keep tracking your mood and activities.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Personalized Insights</h3>
      {insights.map((insight) => (
        <Card
          key={insight.id}
          className={`backdrop-blur-xl bg-gradient-to-br ${getPriorityColor(insight.priority)} border p-6 shadow-[var(--shadow-glass)] relative`}
        >
          <Button
            onClick={() => onAcknowledge(insight.id)}
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              {getPriorityIcon(insight.priority)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-bold text-lg">{insight.title}</h4>
                {insight.priority === 'urgent' && (
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-500/20 text-red-500">
                    URGENT
                  </span>
                )}
              </div>
              <p className="text-muted-foreground mb-4">{insight.description}</p>

              {insight.recommendations && insight.recommendations.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Recommendations:</p>
                  <ul className="space-y-1">
                    {insight.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
