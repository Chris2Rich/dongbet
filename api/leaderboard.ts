import { kv } from '@vercel/kv';

export const runtime = 'edge';

export async function GET() {
  try {
    const userCodes = await kv.smembers('users:set');
    
    if (!userCodes || userCodes.length === 0) {
      return Response.json([]);
    }

    const userKeys = userCodes.map((code: string) => `user:${code}`);
    const usersArray = await kv.mget(...userKeys);

    const leaderboard = (usersArray || [])
      .filter(Boolean)
      .map((user: any) => ({
        code: user.code,
        firstname: user.firstname,
        lastname: user.lastname,
        formgroup: user.formgroup,
        points: user.points || 0,
        predictions: user.predictions?.length || 0
      }))
      .sort((a, b) => b.points - a.points)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));

    return Response.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
