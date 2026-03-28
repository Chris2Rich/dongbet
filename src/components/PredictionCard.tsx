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
    <div className="relative glass rounded-3xl p-6 sm:p-8 max-w-md mx-auto overflow-hidden transition-all duration-500 border border-border hover:border-primary/30 hover:shadow-[0_0_60px_hsl(85_100%_55%/0.1)]">
      {selected && (
        <div className="absolute inset-0 bg-primary/5 animate-pulse pointer-events-none rounded-3xl" />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Dong Chen Cup</span>
          <span className="text-xs font-medium text-primary px-3 py-1 rounded-full bg-primary/10">Match 1</span>
        </div>

        <div className="flex items-center justify-between py-8">
          <div className="text-center flex-1">
            <div className="text-5xl mb-3">🇧🇷</div>
            <div className="font-display text-lg uppercase text-foreground">Brazil</div>
          </div>
          <div className="text-center px-6">
            <div className="font-display text-4xl text-primary tabular-nums">2 - 1</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-5xl mb-3">🇯🇲</div>
            <div className="font-display text-lg uppercase text-foreground">Jamaica</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {outcomes.map((outcome) => (
            <button
              key={outcome.value}
              onClick={() => setSelected(outcome.value)}
              className={`py-4 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all duration-300 border ${
                selected === outcome.value
                  ? "bg-primary text-primary-foreground border-primary shadow-[0_0_20px_hsl(85_100%_55%/0.3)]"
                  : "bg-secondary/50 border-transparent text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              {outcome.label}
            </button>
          ))}
        </div>

        {selected && (
          <Button variant="hero" size="lg" className="w-full animate-fade-up">
            <Lock className="w-4 h-4 mr-2" />
            Lock prediction
          </Button>
        )}
      </div>
    </div>
  );
};

export default PredictionCard;
