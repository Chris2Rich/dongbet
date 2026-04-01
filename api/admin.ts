import { getSupabase } from './db.js';



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

    const supabase = getSupabase() as any;

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
        .insert(newUser as any)
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
        .update({ points } as any)
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

      const matchesList = (matches || []).map((m: any) => m.data);
      return Response.json({ matches: matchesList });
    }

    if (action === 'createMatch') {
      const { id, homeTeam, awayTeam, homeFlag, awayFlag, competition, startTime, markets } = data;
      
      if (!id || !homeTeam || !awayTeam || !startTime) {
        return Response.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const matchData = {
        id,
        homeTeam,
        awayTeam,
        homeFlag: homeFlag || '',
        awayFlag: awayFlag || '',
        competition: competition || '',
        startTime,
        status: 'open',
        markets: markets || []
      };

      const { data: createdMatch, error } = await supabase
        .from('matches')
        .insert({ id, data: matchData } as any)
        .select()
        .single();

      if (error) {
        return Response.json({ error: 'Failed to create match' }, { status: 500 });
      }

      return Response.json({ success: true, match: createdMatch.data });
    }

    if (action === 'updateMatch') {
      const { id, matchData } = data;
      
      if (!id || !matchData) {
        return Response.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const { data: updatedMatch, error } = await supabase
        .from('matches')
        .update({ data: matchData } as any)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return Response.json({ error: 'Failed to update match' }, { status: 500 });
      }

      return Response.json({ success: true, match: updatedMatch.data });
    }

    if (action === 'deleteMatch') {
      const { id } = data;
      
      if (!id) {
        return Response.json({ error: 'Missing match ID' }, { status: 400 });
      }

      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', id);

      if (error) {
        return Response.json({ error: 'Failed to delete match' }, { status: 500 });
      }

      return Response.json({ success: true });
    }

    if (action === 'createMarket') {
      const { matchId, market } = data;
      
      if (!matchId || !market || !market.id || !market.name) {
        return Response.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const { data: matchRecord, error: matchError } = await supabase
        .from('matches')
        .select('data')
        .eq('id', matchId)
        .single();

      if (matchError || !matchRecord) {
        return Response.json({ error: 'Match not found' }, { status: 404 });
      }

      const matchData = matchRecord.data;
      if (!matchData.markets) matchData.markets = [];
      matchData.markets.push({
        ...market,
        status: market.status || 'open',
        result: null,
        history: []
      });

      const { error: updateError } = await supabase
        .from('matches')
        .update({ data: matchData })
        .eq('id', matchId);

      if (updateError) {
        return Response.json({ error: 'Failed to create market' }, { status: 500 });
      }

      return Response.json({ success: true, market });
    }

    if (action === 'updateMarket') {
      const { matchId, marketId, updates } = data;
      
      if (!matchId || !marketId || !updates) {
        return Response.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const { data: matchRecord, error: matchError } = await supabase
        .from('matches')
        .select('data')
        .eq('id', matchId)
        .single();

      if (matchError || !matchRecord) {
        return Response.json({ error: 'Match not found' }, { status: 404 });
      }

      const matchData = matchRecord.data;
      const marketIndex = (matchData.markets || []).findIndex((m: any) => m.id === marketId);
      
      if (marketIndex === -1) {
        return Response.json({ error: 'Market not found' }, { status: 404 });
      }

      matchData.markets[marketIndex] = { ...matchData.markets[marketIndex], ...updates };

      const { error: updateError } = await supabase
        .from('matches')
        .update({ data: matchData })
        .eq('id', matchId);

      if (updateError) {
        return Response.json({ error: 'Failed to update market' }, { status: 500 });
      }

      return Response.json({ success: true, market: matchData.markets[marketIndex] });
    }

    if (action === 'deleteMarket') {
      const { matchId, marketId } = data;
      
      if (!matchId || !marketId) {
        return Response.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const { data: matchRecord, error: matchError } = await supabase
        .from('matches')
        .select('data')
        .eq('id', matchId)
        .single();

      if (matchError || !matchRecord) {
        return Response.json({ error: 'Match not found' }, { status: 404 });
      }

      const matchData = matchRecord.data;
      const marketIndex = (matchData.markets || []).findIndex((m: any) => m.id === marketId);
      
      if (marketIndex === -1) {
        return Response.json({ error: 'Market not found' }, { status: 404 });
      }

      matchData.markets.splice(marketIndex, 1);

      const { error: updateError } = await supabase
        .from('matches')
        .update({ data: matchData })
        .eq('id', matchId);

      if (updateError) {
        return Response.json({ error: 'Failed to delete market' }, { status: 500 });
      }

      return Response.json({ success: true });
    }

    if (action === 'addContract') {
      const { matchId, marketId, contract } = data;
      
      if (!matchId || !marketId || !contract || !contract.id || !contract.name) {
        return Response.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const { data: matchRecord, error: matchError } = await supabase
        .from('matches')
        .select('data')
        .eq('id', matchId)
        .single();

      if (matchError || !matchRecord) {
        return Response.json({ error: 'Match not found' }, { status: 404 });
      }

      const matchData = matchRecord.data;
      const marketIndex = (matchData.markets || []).findIndex((m: any) => m.id === marketId);
      
      if (marketIndex === -1) {
        return Response.json({ error: 'Market not found' }, { status: 404 });
      }

      const newContract = {
        ...contract,
        pool: contract.pool || 0,
        odds: contract.odds || 2.0,
        probability: contract.probability || 0.5
      };

      matchData.markets[marketIndex].contracts.push(newContract);

      const { error: updateError } = await supabase
        .from('matches')
        .update({ data: matchData })
        .eq('id', matchId);

      if (updateError) {
        return Response.json({ error: 'Failed to add contract' }, { status: 500 });
      }

      return Response.json({ success: true, contract: newContract });
    }

    if (action === 'updateContract') {
      const { matchId, marketId, contractId, updates } = data;
      
      if (!matchId || !marketId || !contractId || !updates) {
        return Response.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const { data: matchRecord, error: matchError } = await supabase
        .from('matches')
        .select('data')
        .eq('id', matchId)
        .single();

      if (matchError || !matchRecord) {
        return Response.json({ error: 'Match not found' }, { status: 404 });
      }

      const matchData = matchRecord.data;
      const marketIndex = (matchData.markets || []).findIndex((m: any) => m.id === marketId);
      
      if (marketIndex === -1) {
        return Response.json({ error: 'Market not found' }, { status: 404 });
      }

      const contractIndex = matchData.markets[marketIndex].contracts.findIndex((c: any) => c.id === contractId);
      
      if (contractIndex === -1) {
        return Response.json({ error: 'Contract not found' }, { status: 404 });
      }

      matchData.markets[marketIndex].contracts[contractIndex] = { 
        ...matchData.markets[marketIndex].contracts[contractIndex], 
        ...updates 
      };

      const { error: updateError } = await supabase
        .from('matches')
        .update({ data: matchData })
        .eq('id', matchId);

      if (updateError) {
        return Response.json({ error: 'Failed to update contract' }, { status: 500 });
      }

      return Response.json({ success: true, contract: matchData.markets[marketIndex].contracts[contractIndex] });
    }

    if (action === 'deleteContract') {
      const { matchId, marketId, contractId } = data;
      
      if (!matchId || !marketId || !contractId) {
        return Response.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const { data: matchRecord, error: matchError } = await supabase
        .from('matches')
        .select('data')
        .eq('id', matchId)
        .single();

      if (matchError || !matchRecord) {
        return Response.json({ error: 'Match not found' }, { status: 404 });
      }

      const matchData = matchRecord.data;
      const marketIndex = (matchData.markets || []).findIndex((m: any) => m.id === marketId);
      
      if (marketIndex === -1) {
        return Response.json({ error: 'Market not found' }, { status: 404 });
      }

      const contractIndex = matchData.markets[marketIndex].contracts.findIndex((c: any) => c.id === contractId);
      
      if (contractIndex === -1) {
        return Response.json({ error: 'Contract not found' }, { status: 404 });
      }

      matchData.markets[marketIndex].contracts.splice(contractIndex, 1);

      const { error: updateError } = await supabase
        .from('matches')
        .update({ data: matchData })
        .eq('id', matchId);

      if (updateError) {
        return Response.json({ error: 'Failed to delete contract' }, { status: 500 });
      }

      return Response.json({ success: true });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
    
  } catch (error) {
    console.error('Admin error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
