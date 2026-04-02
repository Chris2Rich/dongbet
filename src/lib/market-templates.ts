export interface MarketTemplate {
  name: string;
  contracts: { name: string }[];
}

export function generateDefaultMarkets(homeTeam: string, awayTeam: string) {
  const templates: MarketTemplate[] = [
    {
      name: `${homeTeam} or ${awayTeam}?`,
      contracts: [
        { name: `${homeTeam} Win` },
        { name: `Draw` },
        { name: `${awayTeam} Win` },
      ],
    },
    {
      name: `${homeTeam} Goals`,
      contracts: [
        { name: "0" },
        { name: "1" },
        { name: "2" },
        { name: "3" },
        { name: "4+" },
      ],
    },
    {
      name: `${awayTeam} Goals`,
      contracts: [
        { name: "0" },
        { name: "1" },
        { name: "2" },
        { name: "3" },
        { name: "4+" },
      ],
    },
    {
      name: "Total Goals",
      contracts: [
        { name: "0" },
        { name: "1" },
        { name: "2" },
        { name: "3" },
        { name: "4" },
        { name: "5+" },
      ],
    },
    {
      name: "Total Saves",
      contracts: [
        { name: "0" },
        { name: "1-2" },
        { name: "3-5" },
        { name: "6-8" },
        { name: "9+" },
      ],
    },
    {
      name: "Shots on Target",
      contracts: [
        { name: "0" },
        { name: "1-2" },
        { name: "3-5" },
        { name: "6-8" },
        { name: "9+" },
      ],
    },
    {
      name: "Extra Time?",
      contracts: [
        { name: "Yes" },
        { name: "No" },
      ],
    },
  ];

  const now = new Date().toISOString();

  return templates.map((template, i) => {
    const marketId = `market-${Date.now()}-${i}`;
    return {
      id: marketId,
      name: template.name,
      status: "open" as const,
      result: null,
      contracts: template.contracts.map((c, j) => ({
        id: `contract-${marketId}-${j}`,
        name: c.name,
        pool: 0,
        odds: 2.0,
        probability: 0.5,
      })),
      history: [],
    };
  });
}
