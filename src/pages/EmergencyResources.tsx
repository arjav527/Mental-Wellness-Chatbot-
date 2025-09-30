import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Phone, Globe, Clock, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type EmergencyResource = {
  id: string;
  name: string;
  phone: string | null;
  website: string | null;
  resource_type: string;
  country: string;
  region: string | null;
  available_24_7: boolean;
  languages: string[] | null;
};

const EmergencyResources = () => {
  const [resources, setResources] = useState<EmergencyResource[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from("emergency_resources")
        .select("*")
        .order("resource_type", { ascending: true });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error("Error fetching resources:", error);
      toast({
        title: "Error",
        description: "Failed to load emergency resources",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getResourceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      crisis_helpline: "Crisis Helpline",
      suicide_prevention: "Suicide Prevention",
      emergency: "Emergency Services",
      counseling: "Counseling Services",
    };
    return labels[type] || type;
  };

  const getResourceTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      crisis_helpline: "from-red-500/20 to-orange-500/20",
      suicide_prevention: "from-purple-500/20 to-pink-500/20",
      emergency: "from-red-600/20 to-red-400/20",
      counseling: "from-blue-500/20 to-cyan-500/20",
    };
    return colors[type] || "from-primary/20 to-secondary/20";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4 max-w-6xl mx-auto">
        {/* Emergency Alert Banner */}
        <div className="mb-8 backdrop-blur-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-[var(--radius)] p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-2 text-red-500">
                Emergency? Call Immediately
              </h2>
              <p className="text-muted-foreground mb-4">
                If you or someone you know is in immediate danger or experiencing a mental health crisis,
                please contact one of these emergency resources right away. You are not alone.
              </p>
              <p className="text-sm text-muted-foreground">
                All helplines are confidential and available to provide immediate support.
              </p>
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Emergency Resources
        </h1>
        <p className="text-muted-foreground mb-8">
          24/7 support lines and emergency mental health services
        </p>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading resources...</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {resources.map((resource) => (
              <Card
                key={resource.id}
                className={`backdrop-blur-xl bg-gradient-to-br ${getResourceTypeColor(resource.resource_type)} border-[var(--glass-border)] p-6 hover:shadow-[var(--shadow-glow)] transition-all duration-300`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
                      {getResourceTypeLabel(resource.resource_type)}
                    </div>
                    <h3 className="text-xl font-bold mb-1">{resource.name}</h3>
                    {resource.region && (
                      <p className="text-sm text-muted-foreground">
                        {resource.region}, {resource.country}
                      </p>
                    )}
                  </div>
                  {resource.available_24_7 && (
                    <div className="flex items-center gap-1 text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                      <Clock className="w-3 h-3" />
                      24/7
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {resource.phone && (
                    <a
                      href={`tel:${resource.phone}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors group"
                    >
                      <Phone className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                      <span className="font-semibold text-lg">{resource.phone}</span>
                    </a>
                  )}

                  {resource.website && (
                    <a
                      href={resource.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/5 hover:bg-secondary/10 transition-colors group"
                    >
                      <Globe className="w-5 h-5 text-secondary group-hover:scale-110 transition-transform" />
                      <span className="text-sm truncate">{resource.website}</span>
                    </a>
                  )}

                  {resource.languages && resource.languages.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {resource.languages.map((lang, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent-foreground"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Additional Support Info */}
        <div className="mt-12 backdrop-blur-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[var(--radius)] p-6">
          <h3 className="text-lg font-semibold mb-3">Remember:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• All calls and messages are confidential</li>
            <li>• Trained professionals are available to listen and help</li>
            <li>• There's no judgment - reaching out is a sign of strength</li>
            <li>• You can call multiple times if needed</li>
            <li>• Services are free and accessible to everyone</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmergencyResources;
