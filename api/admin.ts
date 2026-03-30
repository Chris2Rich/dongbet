import { get, put } from '@vercel/blob';

export const runtime = 'edge';

const BLOB_PATH = 'users.json';
const ADMIN_SECRET = '051007';

function verifySecret(secret: string): boolean {
  return secret === ADMIN_SECRET;
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

    const blob = await get(BLOB_PATH, { 
      access: 'private',
      token: process.env.BLOB_READ_WRITE_TOKEN 
    });

    const text = await blob.text();
    const storage = JSON.parse(text);
    const users = storage.users || {};

    if (action === 'createUser') {
      const { code, firstname, lastname, formgroup, points = 100 } = data;
      
      if (!code || !firstname || !lastname || !formgroup) {
        return Response.json({ error: 'Missing required fields' }, { status: 400 });
      }

      if (users[code]) {
        return Response.json({ error: 'User already exists' }, { status: 400 });
      }

      users[code] = {
        firstname,
        lastname,
        formgroup,
        points,
        predictions: []
      };

      await put(BLOB_PATH, JSON.stringify({ users, matches: storage.matches }, null, 2), {
        access: 'private',
        token: process.env.BLOB_READ_WRITE_TOKEN,
        contentType: 'application/json',
        allowOverwrite: true
      });

      return Response.json({ success: true, user: users[code] });
    }

    if (action === 'updateUserPoints') {
      const { code, points } = data;
      
      if (!code || !users[code]) {
        return Response.json({ error: 'User not found' }, { status: 404 });
      }

      if (typeof points !== 'number') {
        return Response.json({ error: 'Invalid points value' }, { status: 400 });
      }

      users[code].points = points;

      await put(BLOB_PATH, JSON.stringify({ users, matches: storage.matches }, null, 2), {
        access: 'private',
        token: process.env.BLOB_READ_WRITE_TOKEN,
        contentType: 'application/json',
        allowOverwrite: true
      });

      return Response.json({ success: true, user: users[code] });
    }

    if (action === 'getAllUsers') {
      return Response.json({ users: Object.entries(users).map(([code, user]: [string, any]) => ({
        code,
        ...user
      }))});
    }

    if (action === 'getAllMatches') {
      return Response.json({ matches: storage.matches || [] });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Admin error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
