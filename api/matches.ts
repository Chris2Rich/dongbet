import { kv } from '@vercel/kv';

export const runtime = 'edge';

export async function GET() {
  try {
    const matches = await kv.get('matches');
    return Response.json({ matches: matches || [] });
  } catch (error) {
    console.error('Matches error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
