import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

const PredictionCard = () => {
  const [selected, setSelected] = useState<string | null>(null);

  const outcomes = [
    { label: "Brazil", value: "home" },
    { label: "Jamaica", value: "away" },
  ];

  return (
    <div className="relative bg-card border border-border rounded-xl p-4 sm:p-6 max-w-md mx-auto overflow-hidden transition-all duration-300 hover:border-primary/30">
      {/* Flash effect */}
      {selected && (
        <div className="absolute inset-0 bg-primary/5 animate-pulse pointer-events-none" />
      )}

      <div className="relative z-10">
        {/* Match header */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Dong Chen</span>
          <span className="text-xs font-medium text-primary tabular-nums">Match 1</span>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between py-6">
          <div className="text-center flex-1">
            <div className="text-3xl mb-2">🇧🇷</div>
            <div className="font-semibold text-foreground text-sm">Brazil</div>
          </div>
          <div className="text-center px-4">
            <div className="font-display text-3xl text-foreground tabular-nums">2 - 1</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-3xl mb-2">🇯🇲</div>
            <div className="font-semibold text-foreground text-sm">Jamaica</div>
          </div>
        </div>

        {/* Prediction toggles */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {outcomes.map((outcome) => (
            <button
              key={outcome.value}
              onClick={() => setSelected(outcome.value)}
              className={`py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 border ${
                selected === outcome.value
                  ? "bg-primary/15 border-primary text-primary"
                  : "bg-secondary border-transparent text-muted-foreground hover:text-foreground hover:border-foreground/20"
              }`}
            >
              {outcome.label}
            </button>
          ))}
        </div>

        {/* Lock button */}
        {selected && (
          <Button variant="hero" size="lg" className="w-full">
            <Lock className="w-4 h-4" />
            Lock prediction
          </Button>
        )}
      </div>
    </div>
  );
};

export default PredictionCard;
