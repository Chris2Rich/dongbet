import { getRedis } from './_redis';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return Response.json({ error: 'Code required' }, { status: 400 });
    }

    const redis = getRedis();
    const userJson = await redis.get(`user:${code}`);

    if (!userJson) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const user = JSON.parse(userJson);

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

    const redis = getRedis();
    const userJson = await redis.get(`user:${code}`);

    if (!userJson) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const user = JSON.parse(userJson);

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

    await redis.set(`user:${code}`, JSON.stringify(user));

    return Response.json({ success: true });
  } catch (error) {
    console.error('Save prediction error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
