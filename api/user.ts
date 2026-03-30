import { kv } from '@vercel/kv';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return Response.json({ error: 'Code required' }, { status: 400 });
    }

    const user = await kv.get(`user:${code}`);

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({
      code,
      firstname: user.firstname,
      lastname: user.lastname,
      formgroup: user.formgroup,
      points: user.points || 0,
      predictions: user.predictions || []
    });
  } catch (error) {
    console.error('Get user error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { code, prediction } = await request.json();

    if (!code || !prediction) {
      return Response.json({ error: 'Missing data' }, { status: 400 });
    }

    const user = await kv.get(`user:${code}`);

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const existingPredictions = user.predictions || [];
    const alreadyPredicted = existingPredictions.some((p: any) => p.matchId === prediction.matchId);
    
    if (alreadyPredicted) {
      return Response.json({ error: 'Already predicted' }, { status: 400 });
    }

    user.predictions = [...existingPredictions, {
      ...prediction,
      timestamp: new Date().toISOString(),
      pointsEarned: 0
    }];

    await kv.set(`user:${code}`, user);

    return Response.json({ success: true });
  } catch (error) {
    console.error('Save prediction error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
