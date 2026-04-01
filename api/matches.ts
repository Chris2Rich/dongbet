import { getSupabase } from './db.js';



export async function GET() {
  try {
    const supabase = getSupabase() as any;
    const { data: matches, error } = await supabase
      .from('matches')
      .select('data')
      .order('created_at', { ascending: false });

    if (error) {
      return Response.json({ error: 'Failed to fetch matches' }, { status: 500 });
    }

    const matchesList = (matches || []).map(m => m.data);
    return Response.json({ matches: matchesList });
  } catch (error) {
    console.error('Matches error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
