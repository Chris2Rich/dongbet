import { get, put } from '@vercel/blob';

export const runtime = 'edge';

const BLOB_PATH = 'users.json';

export async function POST(request: Request) {
  try {
    const { matchId, marketId, contractId } = await request.json();

    if (!matchId || !marketId || !contractId) {
      return Response.json({ error: 'Missing matchId, marketId, or contractId' }, { status: 400 });
    }

    const blob = await get(BLOB_PATH, { 
      access: 'private',
      token: process.env.BLOB_READ_WRITE_TOKEN 
    });

    const text = await blob.text();
    const data = JSON.parse(text);
    const users = data.users || {};
    const matches = data.matches || [];

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

    let settledCount = 0;
    let totalPayout = 0;

    for (const [code, user] of Object.entries(users)) {
      const userData = user as any;
      const predictions = userData.predictions || [];
      
      for (const prediction of predictions) {
        if (prediction.matchId === matchId && prediction.marketId === marketId) {
          if (prediction.contractId === contractId) {
            const winnings = Math.round(prediction.stake * prediction.odds * 10) / 10;
            userData.points += winnings;
            prediction.pointsEarned = winnings;
            totalPayout += winnings;
          } else {
            prediction.pointsEarned = 0;
          }
          settledCount++;
        }
      }
    }

    await put(BLOB_PATH, JSON.stringify({ users, matches }, null, 2), {
      access: 'private',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: 'application/json',
      allowOverwrite: true
    });

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
