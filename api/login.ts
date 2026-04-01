import { supabase } from './db';



export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code || code.length !== 6) {
      return Response.json({ error: 'Invalid code' }, { status: 400 });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('code', code)
      .single();

    if (error || !user) {
      return Response.json({ error: 'Invalid code' }, { status: 401 });
    }

    return Response.json({
      success: true,
      user: {
        code: user.code,
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
