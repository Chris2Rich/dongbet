import { getRedis } from './_redis';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code || code.length !== 6) {
      return Response.json({ error: 'Invalid code' }, { status: 400 });
    }

    const redis = getRedis();
    const userJson = await redis.get(`user:${code}`);

    if (!userJson) {
      return Response.json({ error: 'Invalid code' }, { status: 401 });
    }

    const user = JSON.parse(userJson);

    return Response.json({
      success: true,
      user: {
        code,
        firstname: user.firstname,
        lastname: user.lastname,
        formgroup: user.formgroup,
        points: user.points || 0,
        predictions: user.predictions || []
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
