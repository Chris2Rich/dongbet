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
    <div className="relative glass p-4 sm:p-6 max-w-[340px] sm:max-w-sm mx-auto overflow-hidden transition-all duration-300 border border-border hover:border-primary/30">
      {selected && (
        <div className="absolute inset-0 bg-primary/5 animate-pulse pointer-events-none" />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">Dong Chen Cup</span>
          <span className="text-[9px] sm:text-[10px] font-medium text-primary px-2 py-0.5 bg-primary/10 rounded-sm">Match 1</span>
        </div>

        <div className="flex items-center justify-between py-4 sm:py-6">
          <div className="text-center flex-1">
            <div className="text-2xl sm:text-3xl mb-1.5">🇧🇷</div>
            <div className="font-display text-xs sm:text-sm uppercase text-foreground">Brazil</div>
          </div>
          <div className="text-center px-3 sm:px-4">
            <div className="font-display text-2xl sm:text-3xl text-primary tabular-nums">2 - 1</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-2xl sm:text-3xl mb-1.5">🇯🇲</div>
            <div className="font-display text-xs sm:text-sm uppercase text-foreground">Jamaica</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          {outcomes.map((outcome) => (
            <button
              key={outcome.value}
              onClick={() => setSelected(outcome.value)}
              className={`py-2.5 sm:py-3 text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-200 border rounded-sm ${
                selected === outcome.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary/50 border-transparent text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              {outcome.label}
            </button>
          ))}
        </div>

        {selected && (
          <a href="./login">
          <Button variant="hero" size="sm" className="w-full animate-fade-up text-xs">
            <Lock className="w-3 h-3 mr-1.5" />
            Predict
          </Button>
          </a>
        )}
      </div>
    </div>
  );
};

export default PredictionCard;
