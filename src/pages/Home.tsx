import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, TrendingUp, Users, Music, Sparkles, Heart } from "lucide-react";
import Navigation from "@/components/Navigation";

const Home = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "AI Support",
      description: "Chat with empathetic AI companions for emotional support",
      link: "/chat",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor your mood and journal your thoughts daily",
      link: "/progress",
    },
    {
      icon: Users,
      title: "Find Doctors",
      description: "Connect with mental health professionals",
      link: "/doctors",
    },
    {
      icon: Music,
      title: "Relaxation",
      description: "Calm your mind with music and breathing exercises",
      link: "/relax",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Gradient Glow */}
        <div className="absolute inset-0 bg-[var(--gradient-glow)] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Your Mental Wellness Journey</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
              Mindful Living,<br />Better Tomorrow
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A safe, supportive space for your mental wellness. Track your emotions, 
              connect with professionals, and find peace through AI-guided support.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Link to="/chat">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-[var(--shadow-glow)] rounded-full px-8"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Start Chatting
                </Button>
              </Link>
              <Link to="/progress">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="backdrop-blur-sm bg-[var(--glass-bg)] border-[var(--glass-border)] rounded-full px-8"
                >
                  Track Your Mood
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.title} to={feature.link}>
                  <div className="group p-6 rounded-[var(--radius)] backdrop-blur-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:scale-105">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-[var(--radius)] backdrop-blur-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Always Available</div>
            </div>
            <div className="text-center p-6 rounded-[var(--radius)] backdrop-blur-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
              <div className="text-4xl font-bold text-secondary mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Confidential</div>
            </div>
            <div className="text-center p-6 rounded-[var(--radius)] backdrop-blur-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
              <div className="text-4xl font-bold text-accent mb-2">Free</div>
              <div className="text-sm text-muted-foreground">No Cost to You</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;