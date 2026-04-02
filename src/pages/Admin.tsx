import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getFlagEmoji, getAllCountryNames } from "@/lib/country-flags";

const ADMIN_SECRET = "051007";
const COUNTRY_NAMES = getAllCountryNames();

interface User {
  code: string;
  firstname: string;
  lastname: string;
  formgroup: string;
  points: number;
  predictions: any[];
}

interface Contract {
  id: string;
  name: string;
  pool: number;
  odds: number;
  probability: number;
}

interface Market {
  id: string;
  name: string;
  description?: string;
  status: 'open' | 'locked' | 'resolved';
  result: string | null;
  contracts: Contract[];
}

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string;
  awayFlag: string;
  competition: string;
  startTime: string;
  status: 'open' | 'locked' | 'resolved';
  markets: Market[];
}

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [secretInput, setSecretInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [users, setUsers] = useState<User[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  
  const [newUser, setNewUser] = useState({ code: "", firstname: "", lastname: "", formgroup: "" });
  const [creatingUser, setCreatingUser] = useState(false);

  const [newMatch, setNewMatch] = useState({
    id: "",
    homeTeam: "",
    awayTeam: "",
    homeFlag: "",
    awayFlag: "",
    competition: "",
    startTime: "",
  });
  const [creatingMatch, setCreatingMatch] = useState(false);
  const [autoMarkets, setAutoMarkets] = useState(true);
  const [homeFlagSuggestions, setHomeFlagSuggestions] = useState<string[]>([]);
  const [awayFlagSuggestions, setAwayFlagSuggestions] = useState<string[]>([]);
  const [showHomeSuggestions, setShowHomeSuggestions] = useState(false);
  const [showAwaySuggestions, setShowAwaySuggestions] = useState(false);

  const [newMarket, setNewMarket] = useState<{ matchId: string; name: string; description: string }>({
    matchId: "",
    name: "",
    description: "",
  });
  const [newContract, setNewContract] = useState<{ matchId: string; marketId: string; name: string }>({
    matchId: "",
    marketId: "",
    name: "",
  });

  const fetchData = async () => {
    try {
      const [usersRes, matchesRes] = await Promise.all([
        fetch("/api/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ secret: ADMIN_SECRET, action: "getAllUsers" }),
        }),
        fetch("/api/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ secret: ADMIN_SECRET, action: "getAllMatches" }),
        }),
      ]);
      
      const usersData = await usersRes.json();
      const matchesData = await matchesRes.json();
      
      if (usersData.users) setUsers(usersData.users);
      if (matchesData.matches) setMatches(matchesData.matches);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchData();
    }
  }, [authenticated]);

  const handleSecretSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretInput === ADMIN_SECRET) {
      setAuthenticated(true);
    } else {
      toast.error("Invalid secret key");
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingUser(true);
    
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: ADMIN_SECRET, action: "createUser", ...newUser }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success(`User ${newUser.code} created successfully`);
        setNewUser({ code: "", firstname: "", lastname: "", formgroup: "" });
        fetchData();
      } else {
        toast.error(data.error || "Failed to create user");
      }
    } catch (err) {
      toast.error("Failed to create user");
    } finally {
      setCreatingUser(false);
    }
  };

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingMatch(true);
    
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: ADMIN_SECRET, action: "createMatch", ...newMatch, autoMarkets }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        const marketCount = autoMarkets ? " with 7 auto-markets" : "";
        toast.success(`Match ${newMatch.homeTeam} vs ${newMatch.awayTeam} created${marketCount}`);
        setNewMatch({ id: "", homeTeam: "", awayTeam: "", homeFlag: "", awayFlag: "", competition: "", startTime: "" });
        setAutoMarkets(true);
        fetchData();
      } else {
        toast.error(data.error || "Failed to create match");
      }
    } catch (err) {
      toast.error("Failed to create match");
    } finally {
      setCreatingMatch(false);
    }
  };

  const handleDeleteMatch = async (matchId: string) => {
    if (!confirm("Delete this match and all its markets?")) return;
    
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: ADMIN_SECRET, action: "deleteMatch", id: matchId }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Match deleted");
        fetchData();
      } else {
        toast.error(data.error || "Failed to delete match");
      }
    } catch (err) {
      toast.error("Failed to delete match");
    }
  };

  const handleCreateMarket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: ADMIN_SECRET,
          action: "createMarket",
          matchId: newMarket.matchId,
          market: {
            id: `market-${Date.now()}`,
            name: newMarket.name,
            description: newMarket.description,
            contracts: [],
          },
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Market created");
        setNewMarket({ matchId: "", name: "", description: "" });
        fetchData();
      } else {
        toast.error(data.error || "Failed to create market");
      }
    } catch (err) {
      toast.error("Failed to create market");
    }
  };

  const handleAddContract = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: ADMIN_SECRET,
          action: "addContract",
          matchId: newContract.matchId,
          marketId: newContract.marketId,
          contract: {
            id: `contract-${Date.now()}`,
            name: newContract.name,
            pool: 0,
            odds: 2.0,
            probability: 0.5,
          },
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Contract added");
        setNewContract({ matchId: "", marketId: "", name: "" });
        fetchData();
      } else {
        toast.error(data.error || "Failed to add contract");
      }
    } catch (err) {
      toast.error("Failed to add contract");
    }
  };

  const handleDeleteMarket = async (matchId: string, marketId: string) => {
    if (!confirm("Delete this market?")) return;
    
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: ADMIN_SECRET, action: "deleteMarket", matchId, marketId }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Market deleted");
        fetchData();
      } else {
        toast.error(data.error || "Failed to delete market");
      }
    } catch (err) {
      toast.error("Failed to delete market");
    }
  };

  const handleDeleteContract = async (matchId: string, marketId: string, contractId: string) => {
    if (!confirm("Delete this contract?")) return;
    
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: ADMIN_SECRET, action: "deleteContract", matchId, marketId, contractId }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Contract deleted");
        fetchData();
      } else {
        toast.error(data.error || "Failed to delete contract");
      }
    } catch (err) {
      toast.error("Failed to delete contract");
    }
  };

  const handleResolveMarket = async (matchId: string, marketId: string, contractId: string) => {
    try {
      const res = await fetch("/api/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, marketId, contractId }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success(`Market resolved! Settled ${data.settled} predictions`);
        fetchData();
      } else {
        toast.error(data.error || "Failed to resolve market");
      }
    } catch (err) {
      toast.error("Failed to resolve market");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSecretSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Enter secret key"
                  value={secretInput}
                  onChange={(e) => setSecretInput(e.target.value)}
                  className="text-center"
                />
              </div>
              <Button type="submit" className="w-full">
                Access Admin
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Create User</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Input
                  placeholder="Code (6 digits)"
                  value={newUser.code}
                  onChange={(e) => setNewUser({ ...newUser, code: e.target.value })}
                  maxLength={6}
                  required
                />
                <Input
                  placeholder="First name"
                  value={newUser.firstname}
                  onChange={(e) => setNewUser({ ...newUser, firstname: e.target.value })}
                  required
                />
                <Input
                  placeholder="Last name"
                  value={newUser.lastname}
                  onChange={(e) => setNewUser({ ...newUser, lastname: e.target.value })}
                  required
                />
                <Input
                  placeholder="Form group"
                  value={newUser.formgroup}
                  onChange={(e) => setNewUser({ ...newUser, formgroup: e.target.value })}
                  required
                />
                <Button type="submit" disabled={creatingUser}>
                  {creatingUser ? "Creating..." : "Create User"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Users ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Code</th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Form Group</th>
                    <th className="text-right p-2">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.code} className="border-b">
                      <td className="p-2 font-mono">{user.code}</td>
                      <td className="p-2">{user.firstname} {user.lastname}</td>
                      <td className="p-2">{user.formgroup}</td>
                      <td className="p-2 text-right">{user.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create Match</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateMatch} className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Match ID (e.g. match-1)"
                  value={newMatch.id}
                  onChange={(e) => setNewMatch({ ...newMatch, id: e.target.value })}
                  required
                />
                <Input
                  placeholder="Home Team"
                  value={newMatch.homeTeam}
                  onChange={(e) => {
                    const flag = getFlagEmoji(e.target.value);
                    setNewMatch({ ...newMatch, homeTeam: e.target.value, homeFlag: flag || newMatch.homeFlag });
                  }}
                  required
                />
                <Input
                  placeholder="Away Team"
                  value={newMatch.awayTeam}
                  onChange={(e) => {
                    const flag = getFlagEmoji(e.target.value);
                    setNewMatch({ ...newMatch, awayTeam: e.target.value, awayFlag: flag || newMatch.awayFlag });
                  }}
                  required
                />
                <Input
                  placeholder="Start Time (ISO)"
                  type="datetime-local"
                  value={newMatch.startTime}
                  onChange={(e) => setNewMatch({ ...newMatch, startTime: e.target.value })}
                  required
                />
                <div className="relative">
                  <Input
                    placeholder="Home Flag (auto-detected)"
                    value={newMatch.homeFlag}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewMatch({ ...newMatch, homeFlag: val });
                      if (val.length > 0) {
                        const filtered = COUNTRY_NAMES.filter((c) => c.includes(val.toLowerCase()));
                        setHomeFlagSuggestions(filtered.slice(0, 5));
                        setShowHomeSuggestions(true);
                      } else {
                        setShowHomeSuggestions(false);
                      }
                    }}
                    onFocus={() => {
                      if (newMatch.homeFlag.length > 0) {
                        const filtered = COUNTRY_NAMES.filter((c) => c.includes(newMatch.homeFlag.toLowerCase()));
                        setHomeFlagSuggestions(filtered.slice(0, 5));
                        setShowHomeSuggestions(true);
                      }
                    }}
                    onBlur={() => setTimeout(() => setShowHomeSuggestions(false), 200)}
                  />
                  {showHomeSuggestions && homeFlagSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-md">
                      {homeFlagSuggestions.map((country) => (
                        <div
                          key={country}
                          className="px-3 py-2 text-sm cursor-pointer hover:bg-accent"
                          onMouseDown={() => {
                            setNewMatch({ ...newMatch, homeFlag: getFlagEmoji(country) });
                            setShowHomeSuggestions(false);
                          }}
                        >
                          {getFlagEmoji(country)} {country}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <Input
                    placeholder="Away Flag (auto-detected)"
                    value={newMatch.awayFlag}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewMatch({ ...newMatch, awayFlag: val });
                      if (val.length > 0) {
                        const filtered = COUNTRY_NAMES.filter((c) => c.includes(val.toLowerCase()));
                        setAwayFlagSuggestions(filtered.slice(0, 5));
                        setShowAwaySuggestions(true);
                      } else {
                        setShowAwaySuggestions(false);
                      }
                    }}
                    onFocus={() => {
                      if (newMatch.awayFlag.length > 0) {
                        const filtered = COUNTRY_NAMES.filter((c) => c.includes(newMatch.awayFlag.toLowerCase()));
                        setAwayFlagSuggestions(filtered.slice(0, 5));
                        setShowAwaySuggestions(true);
                      }
                    }}
                    onBlur={() => setTimeout(() => setShowAwaySuggestions(false), 200)}
                  />
                  {showAwaySuggestions && awayFlagSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-md">
                      {awayFlagSuggestions.map((country) => (
                        <div
                          key={country}
                          className="px-3 py-2 text-sm cursor-pointer hover:bg-accent"
                          onMouseDown={() => {
                            setNewMatch({ ...newMatch, awayFlag: getFlagEmoji(country) });
                            setShowAwaySuggestions(false);
                          }}
                        >
                          {getFlagEmoji(country)} {country}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Input
                  placeholder="Competition"
                  value={newMatch.competition}
                  onChange={(e) => setNewMatch({ ...newMatch, competition: e.target.value })}
                />
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoMarkets}
                      onChange={(e) => setAutoMarkets(e.target.checked)}
                      className="rounded border-input"
                    />
                    Auto-add markets
                  </label>
                  <Button type="submit" disabled={creatingMatch}>
                    {creatingMatch ? "Creating..." : "Create Match"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Matches ({matches.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {matches.map((match) => (
              <div key={match.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">
                    {match.homeFlag} {match.homeTeam} vs {match.awayFlag} {match.awayTeam}
                  </h3>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteMatch(match.id)}>
                    Delete
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {match.competition} · {new Date(match.startTime).toLocaleString()}
                </p>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  match.status === 'resolved' ? 'bg-green-500/20 text-green-500' : 
                  match.status === 'locked' ? 'bg-yellow-500/20 text-yellow-500' : 
                  'bg-blue-500/20 text-blue-500'
                }`}>
                  {match.status}
                </span>
              </div>
            ))}
            {matches.length === 0 && (
              <p className="text-muted-foreground text-sm">No matches yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create Market</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateMarket} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newMarket.matchId}
                  onChange={(e) => setNewMarket({ ...newMarket, matchId: e.target.value })}
                  required
                >
                  <option value="">Select Match</option>
                  {matches.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.homeTeam} vs {m.awayTeam}
                    </option>
                  ))}
                </select>
                <Input
                  placeholder="Market Name"
                  value={newMarket.name}
                  onChange={(e) => setNewMarket({ ...newMarket, name: e.target.value })}
                  required
                />
                <Input
                  placeholder="Description (optional)"
                  value={newMarket.description}
                  onChange={(e) => setNewMarket({ ...newMarket, description: e.target.value })}
                />
                <Button type="submit">Create Market</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Contract</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddContract} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newContract.matchId}
                  onChange={(e) => {
                    setNewContract({ ...newContract, matchId: e.target.value, marketId: "" });
                  }}
                  required
                >
                  <option value="">Select Match</option>
                  {matches.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.homeTeam} vs {m.awayTeam}
                    </option>
                  ))}
                </select>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newContract.marketId}
                  onChange={(e) => setNewContract({ ...newContract, marketId: e.target.value })}
                  required
                  disabled={!newContract.matchId}
                >
                  <option value="">Select Market</option>
                  {matches
                    .find((m) => m.id === newContract.matchId)
                    ?.markets.map((mk) => (
                      <option key={mk.id} value={mk.id}>
                        {mk.name}
                      </option>
                    ))}
                </select>
                <Input
                  placeholder="Contract Name"
                  value={newContract.name}
                  onChange={(e) => setNewContract({ ...newContract, name: e.target.value })}
                  required
                />
                <Button type="submit">Add Contract</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Markets & Contracts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {matches.map((match) => (
              <div key={match.id} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">
                  {match.homeFlag} {match.homeTeam} vs {match.awayFlag} {match.awayTeam}
                </h3>
                {match.markets.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No markets</p>
                ) : (
                  match.markets.map((market) => (
                    <div key={market.id} className="bg-secondary/50 rounded p-3 mb-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{market.name}</span>
                        <div className="flex gap-2 items-center">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            market.status === 'resolved' ? 'bg-green-500/20 text-green-500' : 
                            market.status === 'locked' ? 'bg-yellow-500/20 text-yellow-500' : 
                            'bg-blue-500/20 text-blue-500'
                          }`}>
                            {market.status}
                          </span>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteMarket(match.id, market.id)}>
                            Delete
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {market.contracts.map((contract) => (
                          <div key={contract.id} className="flex items-center gap-1 bg-background rounded px-2 py-1 text-sm">
                            <span>{contract.name}</span>
                            <span className="text-muted-foreground text-xs">({contract.pool} pts)</span>
                            {market.status !== 'resolved' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 w-5 p-0 text-red-500 hover:text-red-700"
                                onClick={() => handleDeleteContract(match.id, market.id, contract.id)}
                              >
                                ×
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resolve Markets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {matches.map((match) => (
              <div key={match.id} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">
                  {match.homeFlag} {match.homeTeam} vs {match.awayFlag} {match.awayTeam}
                </h3>
                <div className="space-y-2">
                  {match.markets.map((market) => (
                    <div key={market.id} className="flex items-center justify-between bg-secondary/50 rounded p-3">
                      <div>
                        <span className="font-medium">{market.name}</span>
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
                          market.status === 'resolved' ? 'bg-green-500/20 text-green-500' : 
                          market.status === 'locked' ? 'bg-yellow-500/20 text-yellow-500' : 
                          'bg-blue-500/20 text-blue-500'
                        }`}>
                          {market.status}
                        </span>
                      </div>
                      {market.status !== 'resolved' && (
                        <div className="flex gap-2">
                          {market.contracts.map((contract) => (
                            <Button
                              key={contract.id}
                              variant="outline"
                              size="sm"
                              onClick={() => handleResolveMarket(match.id, market.id, contract.id)}
                            >
                              {contract.name}
                            </Button>
                          ))}
                        </div>
                      )}
                      {market.status === 'resolved' && market.result && (
                        <span className="text-sm text-muted-foreground">
                          Won: {market.contracts.find(c => c.id === market.result)?.name}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
