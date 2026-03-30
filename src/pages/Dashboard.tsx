import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Target, TrendingUp, Calendar, ChevronRight, RefreshCw, Lock, TrendingUp as ChartIcon } from "lucide-react";
import { getUser, getLeaderboard, getMatches, predict } from "@/lib/api";
import type { User, LeaderboardEntry, Match, Market, Contract } from "@/lib/types";
import PriceChart from "@/components/PriceChart";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [stakeInputs, setStakeInputs] = useState<Record<string, number>>({});
  const [expandedMarkets, setExpandedMarkets] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("dongbet_user");
    if (!stored) {
      navigate("/login");
      return;
    }
    const userData = JSON.parse(stored) as User;
    setUser(userData);
    loadData(userData.code);
  }, [navigate]);

  const loadData = async (code: string) => {
    setLoading(true);
    try {
      const [userData, leaderboardData, matchesData] = await Promise.all([
        getUser(code),
        getLeaderboard(),
        getMatches(),
      ]);
      
      if (userData) {
        setUser(userData);
        localStorage.setItem("dongbet_user", JSON.stringify(userData));
      }
      setLeaderboard(leaderboardData);
      setMatches(matchesData);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePredict = async (match: Match, market: Market, contract: Contract) => {
    if (!user) return;
    
    const stake = stakeInputs[`${match.id}-${market.id}`] || 10;
    
    if (stake < 1) {
      setError("Minimum stake is 1 point");
      return;
    }
    if (stake > user.points) {
      setError("Insufficient points");
      return;
    }

    setSubmitting(`${market.id}-${contract.id}`);
    setError(null);

    try {
      const result = await predict(user.code, match.id, market.id, contract.id, stake);
      setUser({ ...user, points: result.remainingPoints });
      localStorage.setItem("dongbet_user", JSON.stringify({ ...user, points: result.remainingPoints }));
      loadData(user.code);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place prediction");
    } finally {
      setSubmitting(null);
    }
  };

  const userRank = leaderboard.find(e => e.code === user?.code)?.rank;
  
  const getUserPrediction = (matchId: string, marketId: string) => 
    user?.predictions?.find(p => p.matchId === matchId && p.marketId === marketId);

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const toggleMarket = (marketId: string) => {
    setExpandedMarkets(prev => ({ ...prev, [marketId]: !prev[marketId] }));
  };

  if (!user) return null;

  return (
    <div className="min-h-[100svh] bg-background bg-grid relative overflow-hidden">
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      
      <div className="absolute top-0 right-0 w-48 sm:w-[400px] h-40 sm:h-[300px] bg-primary/5 rounded-full blur-[60px] sm:blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 sm:w-[300px] h-32 sm:h-[200px] bg-accent/5 rounded-full blur-[50px] sm:blur-[60px] pointer-events-none" />

      <div className="relative z-10 px-4 sm:px-6 py-6 sm:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-primary/20 bg-primary/5 mb-4 sm:mb-6 opacity-0 animate-fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] sm:text-xs text-primary/80 font-medium">Logged in</span>
            </div>
            
            <h1 className="font-display text-xl sm:text-3xl md:text-5xl uppercase text-foreground mb-2 sm:mb-3 opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
              Welcome back, <span className="text-primary">{user.firstname}</span>
            </h1>
            <p className="text-muted-foreground text-xs sm:text-base opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
              {user.formgroup} — {user.points} pts
            </p>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-5 mb-6 sm:mb-8">
            <div className="glass p-4 sm:p-6 border border-border hover:border-primary/30 transition-all duration-300 opacity-0 animate-fade-up" style={{ animationDelay: "300ms" }}>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-sm bg-primary/10 flex items-center justify-center">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <h3 className="font-display text-[11px] sm:text-sm uppercase text-foreground">Points</h3>
              </div>
              <div className="font-display text-2xl sm:text-4xl text-primary tabular-nums mb-0.5">{user.points}</div>
              <p className="text-muted-foreground text-[10px] sm:text-xs">{user.predictions?.length || 0} predictions</p>
            </div>

            <div className="glass p-4 sm:p-6 border border-border hover:border-accent/30 transition-all duration-300 opacity-0 animate-fade-up" style={{ animationDelay: "400ms" }}>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-sm bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                </div>
                <h3 className="font-display text-[11px] sm:text-sm uppercase text-foreground">Rank</h3>
              </div>
              <div className="font-display text-2xl sm:text-4xl text-accent tabular-nums mb-0.5">#{userRank || '--'}</div>
              <p className="text-muted-foreground text-[10px] sm:text-xs">of {leaderboard.length} players</p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-sm text-red-400 text-xs sm:text-sm text-center">
              {error}
            </div>
          )}

          {/* Matches */}
          <div className="glass p-4 sm:p-6 border border-border opacity-0 animate-fade-up" style={{ animationDelay: "500ms" }}>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-sm bg-primary/10 flex items-center justify-center">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <h3 className="font-display text-[11px] sm:text-sm uppercase text-foreground">Matches</h3>
              </div>
              <button 
                onClick={() => loadData(user.code)}
                className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground animate-spin mx-auto" />
              </div>
            ) : matches.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {matches.map((match) => (
                  <div key={match.id} className="bg-secondary/30 rounded-sm border border-border overflow-hidden">
                    <div className="p-3 sm:p-4">
                      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="text-lg sm:text-2xl">{match.homeFlag}</span>
                          <span className="font-display text-[11px] sm:text-sm uppercase">{match.homeTeam}</span>
                        </div>
                        <span className="text-[10px] sm:text-xs text-muted-foreground">vs</span>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="font-display text-[11px] sm:text-sm uppercase">{match.awayTeam}</span>
                          <span className="text-lg sm:text-2xl">{match.awayFlag}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground">
                        <span>{match.competition}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          {formatTime(match.startTime)}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-border">
                      {(match.markets || []).map((market) => {
                        const prediction = getUserPrediction(match.id, market.id);
                        const isMarketLocked = market.status !== 'open';
                        const isExpanded = expandedMarkets[`${match.id}-${market.id}`];
                        
                        return (
                          <div key={market.id} className="border-b border-border last:border-b-0">
                            <button
                              onClick={() => toggleMarket(`${match.id}-${market.id}`)}
                              className="w-full p-2.5 sm:p-3 flex items-center justify-between hover:bg-secondary/30 transition-colors"
                            >
                              <div className="text-left">
                                <div className="font-display text-[10px] sm:text-xs uppercase text-foreground">{market.name}</div>
                                <div className="text-[9px] sm:text-[10px] text-muted-foreground">{market.description}</div>
                              </div>
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                {market.status === 'resolved' && prediction && (
                                  prediction.pointsEarned !== null ? (
                                    <span className="text-[9px] sm:text-[10px] text-primary">+{prediction.pointsEarned} pts</span>
                                  ) : (
                                    <span className="text-[9px] sm:text-[10px] text-muted-foreground">Lost</span>
                                  )
                                )}
                                <ChartIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                              </div>
                            </button>
                            
                            {isExpanded && (
                              <div className="px-2.5 sm:px-3 pb-2.5 sm:pb-3 space-y-2 sm:space-y-3">
                                {(market.history || []).length > 0 && (
                                  <PriceChart 
                                    history={market.history} 
                                    contracts={market.contracts}
                                  />
                                )}
                                
                                {market.status === 'resolved' ? (
                                  <div className="py-2 text-center text-[11px] sm:text-xs">
                                    {market.result && (
                                      <span className="text-primary">
                                        Won: {market.contracts.find(c => c.id === market.result)?.name}
                                      </span>
                                    )}
                                  </div>
                                ) : isMarketLocked ? (
                                  <div className="flex items-center justify-center gap-1.5 py-2 bg-muted/20 rounded-sm">
                                    <Lock className="w-3 h-3 text-muted-foreground" />
                                    <span className="text-[11px] sm:text-xs text-muted-foreground">Locked</span>
                                  </div>
                                ) : prediction ? (
                                  <div className="flex items-center justify-between py-2 bg-primary/10 rounded-sm px-2.5 sm:px-3">
                                    <div className="text-[11px] sm:text-xs">
                                      <span className="text-primary font-medium">
                                        {market.contracts.find(c => c.id === prediction.contractId)?.name}
                                      </span>
                                      <span className="text-muted-foreground"> @ {prediction.odds}x</span>
                                    </div>
                                    <span className="text-primary text-[11px] sm:text-xs">{prediction.stake} pts</span>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                                      {market.contracts.map((contract) => (
                                        <button
                                          key={contract.id}
                                          onClick={() => handlePredict(match, market, contract)}
                                          disabled={submitting === `${market.id}-${contract.id}`}
                                          className="py-2 px-2 rounded-sm text-[11px] sm:text-xs font-medium border border-border bg-secondary/50 hover:bg-primary/20 hover:border-primary/50 transition-all disabled:opacity-50"
                                        >
                                          <span className="block text-muted-foreground text-[9px] sm:text-[10px] mb-0.5 truncate">
                                            {contract.name}
                                          </span>
                                          <span className="text-primary">{contract.odds}x</span>
                                        </button>
                                      ))}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="number"
                                        min="1"
                                        max={user.points}
                                        value={stakeInputs[`${match.id}-${market.id}`] || 10}
                                        onChange={(e) => setStakeInputs({ ...stakeInputs, [`${match.id}-${market.id}`]: parseInt(e.target.value) || 1 })}
                                        className="w-16 sm:w-20 px-2 py-1 text-[11px] sm:text-xs bg-secondary border border-border rounded-sm text-center"
                                        placeholder="Stake"
                                      />
                                      <span className="text-[11px] sm:text-xs text-muted-foreground">pts</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-sm bg-secondary mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                  <Target className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                </div>
                <h4 className="font-display text-base sm:text-lg uppercase text-foreground mb-1">No matches yet</h4>
                <p className="text-muted-foreground text-xs sm:text-sm">Check back soon</p>
              </div>
            )}
          </div>

          <div className="mt-6 sm:mt-8 text-center opacity-0 animate-fade-up" style={{ animationDelay: "600ms" }}>
            <a 
              href="/"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 rotate-180" />
              <span>Back to home</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
