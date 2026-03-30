import { getRedis } from './_redis';

export const runtime = 'edge';

const ADMIN_SECRET = '051007';

function verifySecret(secret: string): boolean {
  return secret === ADMIN_SECRET;
}

interface User {
  code: string;
  firstname: string;
  lastname: string;
  formgroup: string;
  points: number;
  predictions: any[];
}

export async function POST(request: Request) {
  try {
    const { secret, action, ...data } = await request.json();

    if (!secret || !verifySecret(secret)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!action) {
      return Response.json({ error: 'Missing action' }, { status: 400 });
    }

    const redis = getRedis();

    if (action === 'createUser') {
      const { code, firstname, lastname, formgroup, points = 100 } = data;
      
      if (!code || !firstname || !lastname || !formgroup) {
        return Response.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const userExists = await redis.exists(`user:${code}`);
      if (userExists) {
        return Response.json({ error: 'User already exists' }, { status: 400 });
      }

      const newUser: User = {
        code,
        firstname,
        lastname,
        formgroup,
        points,
        predictions: []
      };

      await redis.set(`user:${code}`, JSON.stringify(newUser));
      await redis.sAdd('users:set', code);

      return Response.json({ success: true, user: newUser });
    }

    if (action === 'updateUserPoints') {
      const { code, points } = data;
      
      if (!code) {
        return Response.json({ error: 'Missing user code' }, { status: 400 });
      }

      if (typeof points !== 'number') {
        return Response.json({ error: 'Invalid points value' }, { status: 400 });
      }

      const userJson = await redis.get(`user:${code}`);
      
      if (!userJson) {
        return Response.json({ error: 'User not found' }, { status: 404 });
      }

      const user = JSON.parse(userJson);
      user.points = points;
      await redis.set(`user:${code}`, JSON.stringify(user));

      return Response.json({ success: true, user });
    }

    if (action === 'getAllUsers') {
      const userCodes = await redis.sMembers('users:set');
      
      if (!userCodes || userCodes.length === 0) {
        return Response.json({ users: [] });
      }

      const userKeys = userCodes.map((c: string) => `user:${c}`);
      const usersArray = await redis.mGet(userKeys);

      const validUsers = usersArray
        .filter(Boolean)
        .map((u: string) => JSON.parse(u));

      return Response.json({ users: validUsers });
    }

    if (action === 'getAllMatches') {
      const matchesJson = await redis.get('matches');
      const matches = matchesJson ? JSON.parse(matchesJson) : [];
      return Response.json({ matches });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
    
  } catch (error) {
    console.error('Admin Redis error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
