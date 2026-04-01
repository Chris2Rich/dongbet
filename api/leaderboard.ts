import { supabase } from './db.js';



export async function GET() {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('points', { ascending: false });

    if (error) {
      return Response.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
    }

    const leaderboard = (users || [])
      .map((user, index) => ({
        code: user.code,
        firstname: user.firstname,
        lastname: user.lastname,
        formgroup: user.formgroup,
        points: user.points || 0,
        predictions: user.predictions?.length || 0,
        rank: index + 1
      }));

    return Response.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
