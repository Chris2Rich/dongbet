import { getRedis } from './_redis';

export const runtime = 'edge';

function calculateContractProbability(contracts: { pool: number }[]) {
  const total = contracts.reduce((sum, c) => sum + c.pool, 0);
  if (total === 0) {
    return contracts.map(() => 0.5);
  }
  return contracts.map(c => {
    const probability = Math.max(c.pool, 1) / total;
    return Math.round(probability * 100) / 100;
  });
}

export async function POST(request: Request) {
  try {
    const { code, matchId, marketId, contractId, stake } = await request.json();

    if (!code || !matchId || !marketId || !contractId || !stake) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const stakeNum = parseInt(stake);
    if (isNaN(stakeNum) || stakeNum < 1) {
      return Response.json({ error: 'Minimum stake is 1 point' }, { status: 400 });
    }

    const redis = getRedis();

    const userJson = await redis.get(`user:${code}`);
    if (!userJson) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const user = JSON.parse(userJson);

    if (user.points < stakeNum) {
      return Response.json({ error: 'Insufficient points' }, { status: 400 });
    }

    const matchesJson = await redis.get('matches');
    const matches = matchesJson ? JSON.parse(matchesJson) : [];
    
    const matchIndex = matches.findIndex((m: any) => m.id === matchId);
    if (matchIndex === -1) {
      return Response.json({ error: 'Match not found' }, { status: 404 });
    }

    const match = matches[matchIndex];
    
    if (match.status !== 'open') {
      return Response.json({ error: 'Match is not open for predictions' }, { status: 400 });
    }

    const marketIndex = (match.markets || []).findIndex((m: any) => m.id === marketId);
    if (marketIndex === -1) {
      return Response.json({ error: 'Market not found' }, { status: 404 });
    }

    const market = match.markets[marketIndex];
    
    if (market.status !== 'open') {
      return Response.json({ error: 'Market is not open for predictions' }, { status: 400 });
    }

    const contractIndex = market.contracts.findIndex((c: any) => c.id === contractId);
    if (contractIndex === -1) {
      return Response.json({ error: 'Contract not found' }, { status: 404 });
    }

    const existingPrediction = (user.predictions || []).find(
      (p: any) => p.matchId === matchId && p.marketId === marketId
    );
    
    if (existingPrediction) {
      return Response.json({ error: 'Already predicted this market' }, { status: 400 });
    }

    const currentProbability = market.contracts[contractIndex].probability;
    const potentialWin = Math.round(stakeNum * currentProbability * 10) / 10;

    user.points -= stakeNum;
    
    const prediction = {
      matchId,
      marketId,
      contractId,
      stake: stakeNum,
      probability: currentProbability,
      potentialWin,
      pointsEarned: null,
      timestamp: new Date().toISOString()
    };
    
    user.predictions = [...(user.predictions || []), prediction];

    market.contracts[contractIndex].pool += stakeNum;
    
    const newProbabilities = calculateContractProbability(market.contracts);
    market.contracts.forEach((c: any, i: number) => {
      c.probability = newProbabilities[i];
    });

    const history = market.history || [];
    const contractProbabilities: Record<string, number> = {};
    market.contracts.forEach((c: any) => {
      contractProbabilities[c.id] = c.probability;
    });
    history.push({
      timestamp: new Date().toISOString(),
      contracts: contractProbabilities,
      type: 'probability'
    });
    market.history = history;

    await redis.set(`user:${code}`, JSON.stringify(user));
    await redis.set('matches', JSON.stringify(matches));

    return Response.json({
      success: true,
      prediction,
      remainingPoints: user.points,
      market
    });
  } catch (error) {
    console.error('Predict error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
