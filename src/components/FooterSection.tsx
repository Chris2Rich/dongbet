import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="relative py-32 overflow-hidden">
      {/* Massive brand watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <h2
          className="font-display text-[22vw] leading-none tracking-tighter text-foreground/[0.03] uppercase"
          aria-hidden="true"
        >
          DONGBET
        </h2>
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase text-foreground mb-4">
          Don't just <span className="text-primary text-glow">watch</span>
        </h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-lg mx-auto">
          Your intuition, rewarded. Join thousands of predictors competing at the end of the term.
        </p>
        <Button variant="hero" size="xl" className="animate-pulse-glow">
          <Trophy className="w-5 h-5" />
          Enter the arena
        </Button>

        <div className="mt-20 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-display text-lg text-foreground">
              DONG<span className="text-primary">BET</span>
            </span>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Rules</a>
              <a href="mailto:19czaccaria@thelangton.org.uk" className="hover:text-foreground transition-colors">Contact</a>
            </div>
            <span className="text-xs text-muted-foreground">2026 DongBet</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
