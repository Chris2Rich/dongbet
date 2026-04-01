import { supabase } from './_db';



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

    if (action === 'createUser') {
      const { code, firstname, lastname, formgroup, points = 100 } = data;
      
      if (!code || !firstname || !lastname || !formgroup) {
        return Response.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const { data: existingUser } = await supabase
        .from('users')
        .select('code')
        .eq('code', code)
        .single();

      if (existingUser) {
        return Response.json({ error: 'User already exists' }, { status: 400 });
      }

      const newUser = {
        code,
        firstname,
        lastname,
        formgroup,
        points,
        predictions: []
      };

      const { data: createdUser, error } = await supabase
        .from('users')
        .insert(newUser)
        .select()
        .single();

      if (error) {
        return Response.json({ error: 'Failed to create user' }, { status: 500 });
      }

      return Response.json({ success: true, user: createdUser });
    }

    if (action === 'updateUserPoints') {
      const { code, points } = data;
      
      if (!code) {
        return Response.json({ error: 'Missing user code' }, { status: 400 });
      }

      if (typeof points !== 'number') {
        return Response.json({ error: 'Invalid points value' }, { status: 400 });
      }

      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('code', code)
        .single();
      
      if (fetchError || !user) {
        return Response.json({ error: 'User not found' }, { status: 404 });
      }

      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({ points })
        .eq('code', code)
        .select()
        .single();

      if (updateError) {
        return Response.json({ error: 'Failed to update user' }, { status: 500 });
      }

      return Response.json({ success: true, user: updatedUser });
    }

    if (action === 'getAllUsers') {
      const { data: users, error } = await supabase
        .from('users')
        .select('*');

      if (error) {
        return Response.json({ error: 'Failed to fetch users' }, { status: 500 });
      }

      return Response.json({ users: users || [] });
    }

    if (action === 'getAllMatches') {
      const { data: matches, error } = await supabase
        .from('matches')
        .select('data')
        .order('created_at', { ascending: false });

      if (error) {
        return Response.json({ error: 'Failed to fetch matches' }, { status: 500 });
      }

      const matchesList = (matches || []).map(m => m.data);
      return Response.json({ matches: matchesList });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
    
  } catch (error) {
    console.error('Admin error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
