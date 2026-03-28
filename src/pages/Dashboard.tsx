import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Target, TrendingUp, Calendar, ChevronRight } from "lucide-react";

interface UserData {
  firstname: string;
  lastname: string;
  formgroup: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("dongbet_user");
    if (!stored) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(stored));
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background bg-grid relative overflow-hidden">
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      
      <div className="absolute top-0 right-0 w-[700px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 mb-6 opacity-0 animate-fade-up">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-primary/80 font-medium">Logged in</span>
            </div>
            
            <h1 className="font-display text-5xl sm:text-7xl uppercase text-foreground mb-4 opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
              Welcome back, <span className="text-primary text-glow">{user.firstname}</span>
            </h1>
            <p className="text-muted-foreground text-xl opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
              {user.formgroup}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="glass rounded-2xl p-8 border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-[0_0_60px_hsl(85_100%_55%/0.1)] opacity-0 animate-fade-up" style={{ animationDelay: "300ms" }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl uppercase text-foreground">Your Points</h3>
                  <p className="text-muted-foreground text-sm">Current standing</p>
                </div>
              </div>
              <div className="font-display text-5xl text-primary mb-2">0</div>
              <p className="text-muted-foreground">No predictions yet</p>
            </div>

            <div className="glass rounded-2xl p-8 border border-border hover:border-accent/30 transition-all duration-500 hover:shadow-[0_0_60px_hsl(38_100%_55%/0.1)] opacity-0 animate-fade-up" style={{ animationDelay: "400ms" }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-display text-xl uppercase text-foreground">Rank</h3>
                  <p className="text-muted-foreground text-sm">Leaderboard position</p>
                </div>
              </div>
              <div className="font-display text-5xl text-accent mb-2">--</div>
              <p className="text-muted-foreground">Be the first to predict!</p>
            </div>
          </div>

          <div className="glass rounded-2xl p-8 border border-border opacity-0 animate-fade-up" style={{ animationDelay: "500ms" }}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl uppercase text-foreground">Upcoming Matches</h3>
                  <p className="text-muted-foreground text-sm">Make your predictions</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">2nd April</span>
              </div>
            </div>

            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-secondary mx-auto mb-6 flex items-center justify-center">
                <Target className="w-10 h-10 text-muted-foreground" />
              </div>
              <h4 className="font-display text-2xl uppercase text-foreground mb-2">No matches yet</h4>
              <p className="text-muted-foreground mb-6">Check back soon for upcoming predictions</p>
            </div>
          </div>

          <div className="mt-12 text-center opacity-0 animate-fade-up" style={{ animationDelay: "600ms" }}>
            <a 
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              <span>Back to home</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
