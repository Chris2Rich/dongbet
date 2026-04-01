import { supabase } from './_db';



export async function POST(request: Request) {
  try {
    const { matchId, marketId, contractId } = await request.json();

    if (!matchId || !marketId || !contractId) {
      return Response.json({ error: 'Missing matchId, marketId, or contractId' }, { status: 400 });
    }

    const { data: matchRecord, error: matchError } = await supabase
      .from('matches')
      .select('data')
      .eq('id', matchId)
      .single();

    if (matchError || !matchRecord) {
      return Response.json({ error: 'Match not found' }, { status: 404 });
    }

    const match = matchRecord.data;
    const marketIndex = (match.markets || []).findIndex((m: any) => m.id === marketId);
    if (marketIndex === -1) {
      return Response.json({ error: 'Market not found' }, { status: 404 });
    }

    const market = match.markets[marketIndex];
    
    if (market.status === 'resolved') {
      return Response.json({ error: 'Market already resolved' }, { status: 400 });
    }

    const winningContractIndex = market.contracts.findIndex((c: any) => c.id === contractId);
    if (winningContractIndex === -1) {
      return Response.json({ error: 'Contract not found' }, { status: 404 });
    }

    market.status = 'resolved';
    market.result = contractId;

    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');

    let settledCount = 0;
    let totalPayout = 0;

    if (users && users.length > 0) {
      for (const user of users) {
        const predictions = user.predictions || [];
        let userUpdated = false;
        
        for (const prediction of predictions) {
          if (prediction.matchId === matchId && prediction.marketId === marketId) {
            if (prediction.contractId === contractId) {
              const winnings = Math.round(prediction.stake * prediction.probability * 10) / 10;
              user.points += winnings;
              prediction.pointsEarned = winnings;
              totalPayout += winnings;
            } else {
              prediction.pointsEarned = 0;
            }
            settledCount++;
            userUpdated = true;
          }
        }

        if (userUpdated) {
          await supabase
            .from('users')
            .update({ points: user.points, predictions: user.predictions })
            .eq('code', user.code);
        }
      }
    }

    await supabase
      .from('matches')
      .update({ data: match })
      .eq('id', matchId);

    return Response.json({
      success: true,
      market,
      settled: settledCount,
      totalPayout
    });
  } catch (error) {
    console.error('Resolve error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
