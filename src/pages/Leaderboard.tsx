import { useEffect, useState } from "react";
import { Trophy, Users } from "lucide-react";
import { getLeaderboard } from "@/lib/api";
import type { LeaderboardEntry } from "@/lib/types";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await getLeaderboard();
      setLeaderboard(data);
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100svh] bg-background bg-grid relative overflow-hidden">
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      <div className="absolute top-0 right-0 w-48 sm:w-[400px] h-40 sm:h-[300px] bg-primary/5 rounded-full blur-[60px] sm:blur-[80px] pointer-events-none" />

      <div className="relative z-10 px-4 sm:px-6 py-6 sm:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-primary/20 bg-primary/5 mb-4 sm:mb-6 opacity-0 animate-fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] sm:text-xs text-primary/80 font-medium">Final Standings</span>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl md:text-5xl uppercase text-foreground mb-2 sm:mb-3 opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
              <span className="text-primary">Leaderboard</span>
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
              {leaderboard.length} participants
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            <div className="glass p-4 sm:p-6 border border-border opacity-0 animate-fade-up" style={{ animationDelay: "300ms" }}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 w-12">#</th>
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2 hidden sm:table-cell">Form Group</th>
                      <th className="text-right p-2">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry) => (
                      <tr key={entry.code} className="border-b last:border-b-0">
                        <td className="p-2">
                          {entry.rank <= 3 ? (
                            <span className="text-lg">
                              {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉"}
                            </span>
                          ) : (
                            <span className="text-muted-foreground font-mono">{entry.rank}</span>
                          )}
                        </td>
                        <td className="p-2">
                          <span className="font-medium">{entry.firstname} {entry.lastname}</span>
                          <span className="text-muted-foreground text-xs ml-2 sm:hidden">{entry.formgroup}</span>
                        </td>
                        <td className="p-2 text-muted-foreground hidden sm:table-cell">{entry.formgroup}</td>
                        <td className="p-2 text-right font-mono text-primary">{entry.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-6 sm:mt-8 text-center opacity-0 animate-fade-up" style={{ animationDelay: "400ms" }}>
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm"
            >
              <span>← Back to home</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
