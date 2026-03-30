import { getRedis } from './_redis';

export const runtime = 'edge';

export async function GET() {
  try {
    const redis = getRedis();
    const matchesJson = await redis.get('matches');
    const matches = matchesJson ? JSON.parse(matchesJson) : [];
    return Response.json({ matches });
  } catch (error) {
    console.error('Matches error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
