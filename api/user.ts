import { supabase } from './_db';



export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return Response.json({ error: 'Code required' }, { status: 400 });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('code', code)
      .single();

    if (error || !user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({
      code: user.code,
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

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('code', code)
      .single();

    if (fetchError || !user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const existingPredictions = user.predictions || [];
    const alreadyPredicted = existingPredictions.some((p: any) => p.matchId === prediction.matchId);
    
    if (alreadyPredicted) {
      return Response.json({ error: 'Already predicted' }, { status: 400 });
    }

    const updatedPredictions = [...existingPredictions, {
      ...prediction,
      timestamp: new Date().toISOString(),
      pointsEarned: 0
    }];

    const { error: updateError } = await supabase
      .from('users')
      .update({ predictions: updatedPredictions })
      .eq('code', code);

    if (updateError) {
      return Response.json({ error: 'Failed to save prediction' }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Save prediction error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
