import { kv } from '@vercel/kv';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { matchId, marketId, contractId } = await request.json();

    if (!matchId || !marketId || !contractId) {
      return Response.json({ error: 'Missing matchId, marketId, or contractId' }, { status: 400 });
    }

    const matches = await kv.get('matches') || [];

    const matchIndex = matches.findIndex((m: any) => m.id === matchId);
    if (matchIndex === -1) {
      return Response.json({ error: 'Match not found' }, { status: 404 });
    }

    const match = matches[matchIndex];
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

    // Get all users
    const userCodes = await kv.smembers('users:set');
    let settledCount = 0;
    let totalPayout = 0;

    if (userCodes && userCodes.length > 0) {
      const userKeys = userCodes.map((c: string) => `user:${c}`);
      const usersArray = await kv.mget(...userKeys);

      for (const user of usersArray) {
        if (!user) continue;
        
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
          await kv.set(`user:${user.code}`, user);
        }
      }
    }

    await kv.set('matches', matches);

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
