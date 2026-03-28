import type { User, LeaderboardEntry, Match } from './types';

const API_BASE = '/api';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

export async function login(code: string): Promise<User> {
  try {
    const result = await fetchApi<{ success: boolean; user: User }>('/login', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
    return result.user;
  } catch (error) {
    console.warn('API unavailable, using local data');
    const response = await fetch('/users.json');
    const users: Record<string, { 
      firstname: string; 
      lastname: string; 
      formgroup: string;
      points: number;
      predictions: any[];
    }> = await response.json();
    const user = users[code];
    
    if (user) {
      return {
        code,
        firstname: user.firstname,
        lastname: user.lastname,
        formgroup: user.formgroup,
        points: user.points || 100,
        predictions: user.predictions || [],
      };
    }
    throw new Error('Invalid code');
  }
}

export async function getUser(code: string): Promise<User | null> {
  try {
    return await fetchApi<User>(`/user?code=${code}`);
  } catch {
    return null;
  }
}

export async function predict(
  code: string, 
  matchId: string,
  marketId: string,
  contractId: string, 
  stake: number
): Promise<{ success: boolean; prediction: any; remainingPoints: number; market: any }> {
  try {
    return await fetchApi('/predict', {
      method: 'POST',
      body: JSON.stringify({ code, matchId, marketId, contractId, stake }),
    });
  } catch (error) {
    throw error;
  }
}

export async function resolveMarket(
  matchId: string, 
  marketId: string,
  contractId: string
): Promise<{ success: boolean; settled: number; totalPayout: number }> {
  try {
    return await fetchApi('/resolve', {
      method: 'POST',
      body: JSON.stringify({ matchId, marketId, contractId }),
    });
  } catch (error) {
    throw error;
  }
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    return await fetchApi<LeaderboardEntry[]>('/leaderboard');
  } catch {
    console.warn('API unavailable, using local data');
    const response = await fetch('/users.json');
    const users: Record<string, { 
      firstname: string; 
      lastname: string; 
      formgroup: string;
      points: number;
    }> = await response.json();
    
    return Object.entries(users)
      .map(([code, user], index) => ({
        code,
        firstname: user.firstname,
        lastname: user.lastname,
        formgroup: user.formgroup,
        points: user.points || 100,
        rank: index + 1,
      }))
      .sort((a, b) => b.points - a.points)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));
  }
}

export async function getMatches(): Promise<Match[]> {
  try {
    const data = await fetchApi<{ matches: Match[] }>('/matches');
    return data.matches;
  } catch {
    return [];
  }
}
