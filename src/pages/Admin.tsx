import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const ADMIN_SECRET = "051007";

interface User {
  code: string;
  firstname: string;
  lastname: string;
  formgroup: string;
  points: number;
}

interface Contract {
  id: string;
  name: string;
  pool: number;
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
