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

async function fetchLocalData(): Promise<{ users: Record<string, any>; matches: Match[] }> {
  try {
    const response = await fetch('/data.json');
    if (!response.ok) throw new Error('Failed to fetch data');
    return await response.json();
  } catch {
    return { users: {}, matches: [] };
  }
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
    const data = await fetchLocalData();
    const user = data.users[code];
    
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
    try {
      const data = await fetchLocalData();
      const user = data.users[code];
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
    } catch {}
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
  return await fetchApi('/predict', {
    method: 'POST',
    body: JSON.stringify({ code, matchId, marketId, contractId, stake }),
  });
}

export async function resolveMarket(
  matchId: string, 
  marketId: string,
  contractId: string
): Promise<{ success: boolean; settled: number; totalPayout: number }> {
  return await fetchApi('/resolve', {
    method: 'POST',
    body: JSON.stringify({ matchId, marketId, contractId }),
  });
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    return await fetchApi<LeaderboardEntry[]>('/leaderboard');
  } catch {
    console.warn('API unavailable, using local data');
    const data = await fetchLocalData();
    
    return Object.entries(data.users)
      .map(([code, user]: [string, any]) => ({
        code,
        firstname: user.firstname,
        lastname: user.lastname,
        formgroup: user.formgroup,
        points: user.points || 100,
        rank: 0,
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
    console.warn('API unavailable, using local data');
    const data = await fetchLocalData();
    return data.matches || [];
  }
}
