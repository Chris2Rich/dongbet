const leaders = [
  { rank: 1, name: "DongMaster99", points: 2847, trend: "+12" },
  { rank: 2, name: "GoalKingFC", points: 2801, trend: "+8" },
  { rank: 3, name: "TacticalGenius", points: 2756, trend: "+15" },
  { rank: 4, name: "PitchProphet", points: 2698, trend: "+5" },
  { rank: 5, name: "MatchdayKing", points: 2645, trend: "+10" },
];

const LeaderboardSection = () => {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase text-foreground mb-4">
            The <span className="text-primary text-glow">standings</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Real-time rankings. Updated after every match.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="grid grid-cols-[3rem_1fr_5rem_4rem] gap-4 px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider border-b border-border">
            <span>#</span>
            <span>Player</span>
            <span className="text-right">Points</span>
            <span className="text-right">GW</span>
          </div>

          {/* Rows */}
          {leaders.map((leader) => (
            <div
              key={leader.rank}
              className={`grid grid-cols-[3rem_1fr_5rem_4rem] gap-4 px-4 py-4 items-center border-b border-border/50 transition-colors hover:bg-card ${
                leader.rank <= 3 ? "" : ""
              }`}
            >
              <span
                className={`font-display text-lg ${
                  leader.rank === 1
                    ? "text-primary"
                    : leader.rank <= 3
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {String(leader.rank).padStart(2, "0")}
              </span>
              <span className="font-semibold text-foreground">{leader.name}</span>
              <span className="text-right font-semibold text-foreground tabular-nums">
                {leader.points.toLocaleString()}
              </span>
              <span className="text-right text-sm text-primary tabular-nums">
                {leader.trend}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeaderboardSection;
