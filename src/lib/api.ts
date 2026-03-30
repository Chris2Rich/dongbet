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
  const result = await fetchApi<{ success: boolean; user: User }>('/login', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
  return result.user;
}

export async function getUser(code: string): Promise<User | null> {
  return await fetchApi<User>(`/user?code=${code}`);
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
  return await fetchApi<LeaderboardEntry[]>('/leaderboard');
}

export async function getMatches(): Promise<Match[]> {
  const data = await fetchApi<{ matches: Match[] }>('/matches');
  return data.matches;
}
