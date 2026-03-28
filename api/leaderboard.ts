import { get } from '@vercel/blob';

export const runtime = 'edge';

export async function GET() {
  try {
    const blob = await get('users.json', { 
      access: 'private',
      token: process.env.BLOB_READ_WRITE_TOKEN 
    });

    const text = await blob.text();
    const data = JSON.parse(text);
    const users = data.users || {};

    // Convert to array and sort by points
    const leaderboard = Object.entries(users)
      .map(([code, user]: [string, any]) => ({
        code,
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
