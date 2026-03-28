import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Target, TrendingUp, Calendar, ChevronRight, RefreshCw, Lock, CheckCircle, XCircle, TrendingUp as ChartIcon } from "lucide-react";
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
              {user.formgroup} — {user.points} pts
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
              <div className="font-display text-4xl text-primary mb-1">{user.points}</div>
              <p className="text-muted-foreground text-xs">{user.predictions?.length || 0} predictions</p>
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
              <div className="font-display text-4xl text-accent mb-1">#{userRank || '--'}</div>
              <p className="text-muted-foreground text-xs">of {leaderboard.length} players</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div className="glass p-5 sm:p-6 border border-border opacity-0 animate-fade-up" style={{ animationDelay: "500ms" }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-sm uppercase text-foreground">Matches</h3>
                </div>
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
                <RefreshCw className="w-6 h-6 text-muted-foreground animate-spin mx-auto" />
              </div>
            ) : matches.length > 0 ? (
              <div className="space-y-4">
                {matches.map((match) => {
                  const isLocked = match.status !== 'open';
                  
                  return (
                    <div key={match.id} className="bg-secondary/30 rounded border border-border">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{match.homeFlag}</span>
                            <span className="font-display text-sm uppercase">{match.homeTeam}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">vs</span>
                          <div className="flex items-center gap-2">
                            <span className="font-display text-sm uppercase">{match.awayTeam}</span>
                            <span className="text-2xl">{match.awayFlag}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{match.competition}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
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
                                className="w-full p-3 flex items-center justify-between hover:bg-secondary/30 transition-colors"
                              >
                                <div className="text-left">
                                  <div className="font-display text-xs uppercase text-foreground">{market.name}</div>
                                  <div className="text-[10px] text-muted-foreground">{market.description}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {market.status === 'resolved' && prediction && (
                                    prediction.pointsEarned !== null ? (
                                      <span className="text-[10px] text-primary">+{prediction.pointsEarned} pts</span>
                                    ) : (
                                      <span className="text-[10px] text-muted-foreground">Lost</span>
                                    )
                                  )}
                                  <ChartIcon className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                </div>
                              </button>
                              
                              {isExpanded && (
                                <div className="px-3 pb-3 space-y-3">
                                  {(market.history || []).length > 0 && (
                                    <PriceChart 
                                      history={market.history} 
                                      contracts={market.contracts}
                                    />
                                  )}
                                  
                                  {market.status === 'resolved' ? (
                                    <div className="py-2 text-center text-xs">
                                      {market.result && (
                                        <span className="text-primary">
                                          Won: {market.contracts.find(c => c.id === market.result)?.name}
                                        </span>
                                      )}
                                    </div>
                                  ) : isMarketLocked ? (
                                    <div className="flex items-center justify-center gap-2 py-2 bg-muted/20 rounded">
                                      <Lock className="w-3 h-3 text-muted-foreground" />
                                      <span className="text-xs text-muted-foreground">Locked</span>
                                    </div>
                                  ) : prediction ? (
                                    <div className="flex items-center justify-between py-2 bg-primary/10 rounded px-3">
                                      <div className="text-xs">
                                        <span className="text-primary font-medium">
                                          {market.contracts.find(c => c.id === prediction.contractId)?.name}
                                        </span>
                                        <span className="text-muted-foreground"> @ {prediction.odds}x</span>
                                      </div>
                                      <span className="text-primary text-xs">{prediction.stake} pts</span>
                                    </div>
                                  ) : (
                                    <div className="space-y-2">
                                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {market.contracts.map((contract) => (
                                          <button
                                            key={contract.id}
                                            onClick={() => handlePredict(match, market, contract)}
                                            disabled={submitting === `${market.id}-${contract.id}`}
                                            className="py-2 px-2 rounded text-xs font-medium border border-border bg-secondary/50 hover:bg-primary/20 hover:border-primary/50 transition-all disabled:opacity-50"
                                          >
                                            <span className="block text-muted-foreground text-[10px] mb-0.5 truncate">
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
                                          className="w-20 px-2 py-1 text-xs bg-secondary border border-border rounded text-center"
                                          placeholder="Stake"
                                        />
                                        <span className="text-xs text-muted-foreground">pts</span>
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
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded bg-secondary mx-auto mb-4 flex items-center justify-center">
                  <Target className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground" />
                </div>
                <h4 className="font-display text-lg uppercase text-foreground mb-1">No matches yet</h4>
                <p className="text-muted-foreground text-sm">Check back soon</p>
              </div>
            )}
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
