import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { OddsSnapshot, Contract } from '@/lib/types';

interface PriceChartProps {
  history: OddsSnapshot[];
  contracts: Contract[];
}



const COLORS = ['#b8ff4d', '#facc15', '#f5b829', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

const PriceChart = ({ history, contracts }: PriceChartProps) => {
  if (!history || history.length < 2 || !contracts || contracts.length === 0) {
    return (
      <div className="h-12 flex items-center justify-center text-xs text-muted-foreground">
        No price history yet
      </div>
    );
  }

  const chartData = history.map((snapshot, i) => {
    const data: Record<string, any> = { time: i + 1, timestamp: snapshot.timestamp };
    contracts.forEach((contract, idx) => {
      data[contract.id] = snapshot.contracts[contract.id] || 0;
    });
    return data;
  });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] mb-2">
        {contracts.map((contract, idx) => (
          <span key={contract.id} style={{ color: COLORS[idx % COLORS.length] }}>
            ● {contract.name}
          </span>
        ))}
      </div>
      <div className="h-16 bg-background/50 rounded">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
            <XAxis dataKey="time" hide />
            <YAxis 
              domain={[0, 1]} 
              ticks={[0, 0.5, 1]}
              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
              tick={{ fontSize: 9, fill: '#888' }}
              axisLine={false}
              tickLine={false}
              width={28}
            />
            <Tooltip
              content={({ payload }) => {
                if (!payload || !payload.length) return null;
                const data = payload[0]?.payload;
                return (
                  <div className="bg-card border border-border rounded px-2 py-1.5 text-[10px] shadow-lg">
                    <div className="text-muted-foreground mb-1">{formatTime(data.timestamp)}</div>
                    {contracts.map((contract, idx) => (
                      <div key={contract.id} style={{ color: COLORS[idx % COLORS.length] }}>
                        {contract.name}: {((data[contract.id] || 0) * 100).toFixed(0)}%
                      </div>
                    ))}
                  </div>
                );
              }}
            />
            {contracts.map((contract, idx) => (
              <Line 
                key={contract.id}
                type="monotone" 
                dataKey={contract.id} 
                stroke={COLORS[idx % COLORS.length]} 
                strokeWidth={1.5} 
                dot={false}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
