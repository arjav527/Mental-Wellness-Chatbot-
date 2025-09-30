import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Wind, Play, Pause } from "lucide-react";
import Navigation from "@/components/Navigation";

const Relaxation = () => {
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");

  const musicTracks = [
    { title: "Peaceful Piano", artist: "Relaxing Music", duration: "3:45", url: "https://www.youtube.com/watch?v=lTRiuFIWV54" },
    { title: "Ocean Waves", artist: "Nature Sounds", duration: "5:20", url: "https://www.youtube.com/watch?v=V1bFr2SWP1I" },
    { title: "Rain & Thunder", artist: "Sleep Sounds", duration: "4:15", url: "https://www.youtube.com/watch?v=q76bMs-NwRk" },
    { title: "Forest Meditation", artist: "Ambient Nature", duration: "6:30", url: "https://www.youtube.com/watch?v=eKFTSSKCzWA" },
  ];

  const startBreathingExercise = () => {
    if (breathingActive) {
      setBreathingActive(false);
      return;
    }

    setBreathingActive(true);
    let phase: "inhale" | "hold" | "exhale" = "inhale";
    setBreathPhase(phase);

    const cycle = () => {
      if (phase === "inhale") {
        setTimeout(() => {
          phase = "hold";
          setBreathPhase(phase);
          cycle();
        }, 4000);
      } else if (phase === "hold") {
        setTimeout(() => {
          phase = "exhale";
          setBreathPhase(phase);
          cycle();
        }, 7000);
      } else {
        setTimeout(() => {
          phase = "inhale";
          setBreathPhase(phase);
          cycle();
        }, 8000);
      }
    };

    cycle();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Relaxation Hub</h1>
          <p className="text-lg text-muted-foreground">Find your calm with music and breathing exercises</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Breathing Exercise */}
          <Card className="backdrop-blur-xl bg-[var(--glass-bg)] border-[var(--glass-border)] shadow-[var(--shadow-glass)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wind className="w-5 h-5" />
                Breathing Exercise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="aspect-square max-w-sm mx-auto relative">
                <div
                  className={`absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary transition-all duration-[4000ms] ease-in-out flex items-center justify-center ${
                    breathingActive
                      ? breathPhase === "inhale"
                        ? "scale-100"
                        : breathPhase === "hold"
                        ? "scale-100"
                        : "scale-75"
                      : "scale-90"
                  }`}
                  style={{
                    transitionDuration:
                      breathPhase === "inhale"
                        ? "4000ms"
                        : breathPhase === "hold"
                        ? "7000ms"
                        : "8000ms",
                  }}
                >
                  <div className="text-center text-white">
                    <p className="text-3xl font-bold mb-2">
                      {breathingActive
                        ? breathPhase === "inhale"
                          ? "Inhale"
                          : breathPhase === "hold"
                          ? "Hold"
                          : "Exhale"
                        : "Ready?"}
                    </p>
                    <p className="text-sm opacity-90">
                      {breathingActive
                        ? breathPhase === "inhale"
                          ? "4 seconds"
                          : breathPhase === "hold"
                          ? "7 seconds"
                          : "8 seconds"
                        : "4-7-8 Breathing"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-4">
                <Button
                  onClick={startBreathingExercise}
                  size="lg"
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  {breathingActive ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Stop Exercise
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Start Exercise
                    </>
                  )}
                </Button>
                <p className="text-sm text-muted-foreground">
                  The 4-7-8 breathing technique: Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Music Player */}
          <Card className="backdrop-blur-xl bg-[var(--glass-bg)] border-[var(--glass-border)] shadow-[var(--shadow-glass)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="w-5 h-5" />
                Relaxing Music
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {musicTracks.map((track, index) => (
                  <a
                    key={index}
                    href={track.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 rounded-lg bg-card border border-border hover:border-primary transition-all hover:scale-[1.02]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">{track.title}</h4>
                        <p className="text-sm text-muted-foreground">{track.artist}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">{track.duration}</span>
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Play className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mindfulness Tips */}
        <Card className="mt-8 backdrop-blur-xl bg-[var(--glass-bg)] border-[var(--glass-border)] shadow-[var(--shadow-glass)]">
          <CardHeader>
            <CardTitle>Quick Relaxation Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Wind className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Deep Breathing</h4>
                <p className="text-sm text-muted-foreground">
                  Practice deep breathing exercises for 5-10 minutes daily
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                  <Music className="w-6 h-6 text-secondary" />
                </div>
                <h4 className="font-semibold mb-2">Listen to Music</h4>
                <p className="text-sm text-muted-foreground">
                  Calming music can reduce stress and anxiety
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <Wind className="w-6 h-6 text-accent" />
                </div>
                <h4 className="font-semibold mb-2">Take Breaks</h4>
                <p className="text-sm text-muted-foreground">
                  Regular breaks help maintain mental clarity
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Relaxation;