export interface User {
  code: string;
  firstname: string;
  lastname: string;
  formgroup: string;
  points: number;
  predictions: Prediction[];
}

export interface Prediction {
  matchId: string;
  marketId: string;
  contractId: string;
  stake: number;
  probability: number;
  odds: number;
  potentialWin: number;
  pointsEarned: number | null;
  timestamp: string;
}

export interface OddsSnapshot {
  timestamp: string;
  contracts: Record<string, number>;
  type: 'probability';
}

export interface Contract {
  id: string;
  name: string;
  description?: string;
  pool: number;
  probability: number;
  odds: number;
}

export interface Market {
  id: string;
  name: string;
  description?: string;
  status: 'open' | 'locked' | 'resolved';
  result: string | null;
  contracts: Contract[];
  history: OddsSnapshot[];
}

export interface Match {
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

export interface LeaderboardEntry {
  code: string;
  firstname: string;
  lastname: string;
  formgroup: string;
  points: number;
  rank: number;
}

export interface AppData {
  users: Record<string, User>;
  matches: Match[];
}
