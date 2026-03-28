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
      
      <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[200px] bg-accent/5 rounded-full blur-[60px] pointer-events-none" />

      <div className="relative z-10 px-4 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-primary/20 bg-primary/5 mb-6 opacity-0 animate-fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-primary/80 font-medium">Logged in</span>
            </div>
            
            <h1 className="font-display text-3xl sm:text-5xl uppercase text-foreground mb-3 opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
              Welcome back, <span className="text-primary">{user.firstname}</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
              {user.formgroup}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
            <div className="glass p-5 sm:p-6 border border-border hover:border-primary/30 transition-all duration-300 opacity-0 animate-fade-up" style={{ animationDelay: "300ms" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-sm uppercase text-foreground">Points</h3>
                </div>
              </div>
              <div className="font-display text-4xl text-primary mb-1">0</div>
              <p className="text-muted-foreground text-xs">No predictions yet</p>
            </div>

            <div className="glass p-5 sm:p-6 border border-border hover:border-accent/30 transition-all duration-300 opacity-0 animate-fade-up" style={{ animationDelay: "400ms" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-display text-sm uppercase text-foreground">Rank</h3>
                </div>
              </div>
              <div className="font-display text-4xl text-accent mb-1">--</div>
              <p className="text-muted-foreground text-xs">Be the first!</p>
            </div>
          </div>

          <div className="glass p-5 sm:p-6 border border-border opacity-0 animate-fade-up" style={{ animationDelay: "500ms" }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-sm uppercase text-foreground">Upcoming</h3>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-primary">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">2nd April</span>
              </div>
            </div>

            <div className="text-center py-6 sm:py-8">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded bg-secondary mx-auto mb-4 flex items-center justify-center">
                <Target className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground" />
              </div>
              <h4 className="font-display text-lg uppercase text-foreground mb-1">No matches yet</h4>
              <p className="text-muted-foreground text-sm">Check back soon</p>
            </div>
          </div>

          <div className="mt-8 text-center opacity-0 animate-fade-up" style={{ animationDelay: "600ms" }}>
            <a 
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
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
