import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, ArrowRight } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="relative py-40 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-50">
        <h2 className="font-display text-[35vw] leading-none tracking-tighter text-foreground/[0.015] uppercase animate-float">
          DONGBET
        </h2>
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <h2 className="font-display text-5xl sm:text-7xl md:text-8xl uppercase text-foreground mb-6 opacity-0 animate-fade-up">
          Don't just <span className="text-primary text-glow">watch</span>
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-lg mx-auto opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
          Your intuition, rewarded. Join thousands of predictors competing at the end of the term.
        </p>
        <Button variant="hero" size="xl" className="animate-pulse-slow opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }} asChild>
          <Link to="/login">
            <Trophy className="w-5 h-5 mr-2" />
            Enter the arena
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>

        <div className="mt-24 pt-8 border-t border-border/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <span className="font-display text-xl text-foreground">
              DONG<span className="text-primary">BET</span>
            </span>
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Rules</a>
              <a href="mailto:19czaccaria@thelangton.org.uk" className="hover:text-primary transition-colors">Contact</a>
            </div>
            <span className="text-xs text-muted-foreground">© 2026 DongBet</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
