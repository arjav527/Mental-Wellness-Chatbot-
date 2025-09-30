import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Clock, Languages } from "lucide-react";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";

const Doctors = () => {
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    const { data } = await supabase
      .from("doctors")
      .select("*")
      .order("name");
    if (data) setDoctors(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Mental Health Professionals</h1>
          <p className="text-lg text-muted-foreground">Connect with experienced professionals who care</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {doctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="backdrop-blur-xl bg-[var(--glass-bg)] border-[var(--glass-border)] shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-glow)] transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-white">
                      {doctor.name.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{doctor.name}</h3>
                    <Badge className="bg-accent/10 text-accent border-accent/20">
                      {doctor.specialization}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                    <a href={`tel:${doctor.contact}`} className="hover:underline">
                      {doctor.contact}
                    </a>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                    <a href={`mailto:${doctor.email}`} className="hover:underline truncate">
                      {doctor.email}
                    </a>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <Clock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{doctor.availability}</span>
                  </div>

                  {doctor.languages && doctor.languages.length > 0 && (
                    <div className="flex items-start gap-3 text-sm">
                      <Languages className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex flex-wrap gap-1">
                        {doctor.languages.map((lang: string, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Emergency Contact */}
        <Card className="mt-12 backdrop-blur-xl bg-gradient-to-r from-destructive/10 to-destructive/5 border-destructive/20">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">In Crisis?</h3>
            <p className="text-muted-foreground mb-4">
              If you're experiencing a mental health emergency, please contact:
            </p>
            <div className="space-y-2">
              <p className="font-semibold">Emergency Services: 911</p>
              <p className="font-semibold">National Crisis Hotline: 988</p>
              <p className="text-sm text-muted-foreground">Available 24/7 for immediate support</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Doctors;