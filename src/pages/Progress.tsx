import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Smile, Meh, Frown, Heart, Zap, Cloud, Plus, Trash2, Check } from "lucide-react";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useWellnessData } from "@/hooks/useWellnessData";
import { WellnessScoreCard } from "@/components/WellnessScoreCard";
import { InsightsPanel } from "@/components/InsightsPanel";

type MoodType = "very_happy" | "happy" | "neutral" | "sad" | "very_sad" | "anxious" | "stressed" | "calm" | "energetic";

const Progress = () => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [moodNote, setMoodNote] = useState("");
  const [moodLogs, setMoodLogs] = useState<any[]>([]);
  const [journalTitle, setJournalTitle] = useState("");
  const [journalContent, setJournalContent] = useState("");
  const [journals, setJournals] = useState<any[]>([]);
  const [todoText, setTodoText] = useState("");
  const [todos, setTodos] = useState<any[]>([]);
  const { toast } = useToast();
  const { wellnessScore, insights, loading: wellnessLoading, generateNewAnalysis, acknowledgeInsight } = useWellnessData();

  const moods = [
    { type: "very_happy" as MoodType, icon: Smile, label: "Very Happy", color: "text-green-500" },
    { type: "happy" as MoodType, icon: Smile, label: "Happy", color: "text-green-400" },
    { type: "neutral" as MoodType, icon: Meh, label: "Neutral", color: "text-yellow-500" },
    { type: "sad" as MoodType, icon: Frown, label: "Sad", color: "text-blue-400" },
    { type: "very_sad" as MoodType, icon: Frown, label: "Very Sad", color: "text-blue-600" },
    { type: "anxious" as MoodType, icon: Cloud, label: "Anxious", color: "text-purple-500" },
    { type: "stressed" as MoodType, icon: Zap, label: "Stressed", color: "text-red-500" },
    { type: "calm" as MoodType, icon: Heart, label: "Calm", color: "text-teal-500" },
    { type: "energetic" as MoodType, icon: Zap, label: "Energetic", color: "text-orange-500" },
  ];

  useEffect(() => {
    fetchMoodLogs();
    fetchJournals();
    fetchTodos();
  }, []);

  const fetchMoodLogs = async () => {
    const { data } = await supabase
      .from("mood_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(7);
    if (data) setMoodLogs(data);
  };

  const fetchJournals = async () => {
    const { data } = await supabase
      .from("journal_entries")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setJournals(data);
  };

  const fetchTodos = async () => {
    const { data } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setTodos(data);
  };

  const logMood = async () => {
    if (!selectedMood) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("mood_logs").insert({
      user_id: user.id,
      mood: selectedMood,
      note: moodNote,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to log mood. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Mood logged!",
        description: "Your mood has been recorded.",
      });
      setSelectedMood(null);
      setMoodNote("");
      fetchMoodLogs();
    }
  };

  const saveJournal = async () => {
    if (!journalContent) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("journal_entries").insert({
      user_id: user.id,
      title: journalTitle || "Untitled",
      content: journalContent,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save journal. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Journal saved!",
        description: "Your thoughts have been recorded.",
      });
      setJournalTitle("");
      setJournalContent("");
      fetchJournals();
    }
  };

  const addTodo = async () => {
    if (!todoText.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("todos").insert({
      user_id: user.id,
      title: todoText,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add todo. Please try again.",
        variant: "destructive",
      });
    } else {
      setTodoText("");
      fetchTodos();
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    const { error } = await supabase
      .from("todos")
      .update({ completed: !completed })
      .eq("id", id);

    if (!error) fetchTodos();
  };

  const deleteTodo = async (id: string) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (!error) fetchTodos();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Track Your Progress
          </h1>
          <p className="text-lg text-muted-foreground">Monitor your mood, journal your thoughts, and manage your tasks</p>
        </div>

        {/* Wellness Score and Insights */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <WellnessScoreCard 
            score={wellnessScore} 
            onRefresh={generateNewAnalysis} 
            loading={wellnessLoading} 
          />
          <div>
            <InsightsPanel insights={insights} onAcknowledge={acknowledgeInsight} />
          </div>
        </div>

        <Tabs defaultValue="mood" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="mood">Mood Tracker</TabsTrigger>
            <TabsTrigger value="journal">Journal</TabsTrigger>
            <TabsTrigger value="todos">To-Do List</TabsTrigger>
          </TabsList>

          {/* Mood Tracker */}
          <TabsContent value="mood">
            <Card className="backdrop-blur-xl bg-[var(--glass-bg)] border-[var(--glass-border)] shadow-[var(--shadow-glass)]">
              <CardHeader>
                <CardTitle>How are you feeling today?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {moods.map((mood) => {
                    const Icon = mood.icon;
                    return (
                      <button
                        key={mood.type}
                        onClick={() => setSelectedMood(mood.type)}
                        className={cn(
                          "p-4 rounded-xl border-2 transition-all hover:scale-105",
                          selectedMood === mood.type
                            ? "border-primary bg-primary/10 shadow-[var(--shadow-glow)]"
                            : "border-border bg-card"
                        )}
                      >
                        <Icon className={cn("w-8 h-8 mx-auto mb-2", mood.color)} />
                        <p className="text-xs font-medium">{mood.label}</p>
                      </button>
                    );
                  })}
                </div>

                <Textarea
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  placeholder="Add a note about how you're feeling... (optional)"
                  className="min-h-[80px]"
                />

                <Button
                  onClick={logMood}
                  disabled={!selectedMood}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  Log Mood
                </Button>

                {/* Recent Moods */}
                {moodLogs.length > 0 && (
                  <div className="mt-8">
                    <h3 className="font-semibold mb-4">Last 7 Days</h3>
                    <div className="space-y-3">
                      {moodLogs.map((log) => {
                        const mood = moods.find((m) => m.type === log.mood);
                        if (!mood) return null;
                        const Icon = mood.icon;
                        return (
                          <div
                            key={log.id}
                            className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border"
                          >
                            <Icon className={cn("w-6 h-6 flex-shrink-0 mt-0.5", mood.color)} />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium">{mood.label}</p>
                              {log.note && <p className="text-sm text-muted-foreground mt-1">{log.note}</p>}
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(log.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Journal */}
          <TabsContent value="journal">
            <Card className="backdrop-blur-xl bg-[var(--glass-bg)] border-[var(--glass-border)] shadow-[var(--shadow-glass)]">
              <CardHeader>
                <CardTitle>Write in your journal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={journalTitle}
                  onChange={(e) => setJournalTitle(e.target.value)}
                  placeholder="Title (optional)"
                />
                <Textarea
                  value={journalContent}
                  onChange={(e) => setJournalContent(e.target.value)}
                  placeholder="What's on your mind today?"
                  className="min-h-[200px]"
                />
                <Button
                  onClick={saveJournal}
                  disabled={!journalContent}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  Save Journal Entry
                </Button>

                {/* Recent Journals */}
                {journals.length > 0 && (
                  <div className="mt-8 space-y-4">
                    <h3 className="font-semibold">Recent Entries</h3>
                    {journals.map((journal) => (
                      <div key={journal.id} className="p-4 rounded-lg bg-card border border-border">
                        <h4 className="font-semibold mb-2">{journal.title}</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {journal.content}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(journal.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* To-Do List */}
          <TabsContent value="todos">
            <Card className="backdrop-blur-xl bg-[var(--glass-bg)] border-[var(--glass-border)] shadow-[var(--shadow-glass)]">
              <CardHeader>
                <CardTitle>Your Tasks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={todoText}
                    onChange={(e) => setTodoText(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTodo()}
                    placeholder="Add a new task..."
                  />
                  <Button onClick={addTodo} size="icon" className="flex-shrink-0">
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {todos.map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border group"
                    >
                      <button
                        onClick={() => toggleTodo(todo.id, todo.completed)}
                        className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                          todo.completed
                            ? "bg-success border-success"
                            : "border-border hover:border-primary"
                        )}
                      >
                        {todo.completed && <Check className="w-4 h-4 text-white" />}
                      </button>
                      <span
                        className={cn(
                          "flex-1",
                          todo.completed && "line-through text-muted-foreground"
                        )}
                      >
                        {todo.title}
                      </span>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Progress;