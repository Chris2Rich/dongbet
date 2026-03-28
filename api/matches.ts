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
    const matches = data.matches || [];

    return Response.json({ matches });
  } catch (error) {
    console.error('Matches error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
