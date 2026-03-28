import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, ArrowRight } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-40">
        <h2 className="font-display text-[45vw] leading-none tracking-tighter text-foreground/[0.01] uppercase">
          DONGBET
        </h2>
      </div>

      <div className="relative z-10 px-4 text-center">
        <h2 className="font-display text-3xl sm:text-5xl uppercase text-foreground mb-4 opacity-0 animate-fade-up">
          Don't just <span className="text-primary">watch</span>
        </h2>
        <p className="text-muted-foreground text-base mb-10 max-w-md mx-auto opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
          Your intuition, rewarded. Join predictors competing this term.
        </p>
        <Button variant="hero" className="opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }} asChild>
          <Link to="/login">
            <Trophy className="w-4 h-4 mr-2" />
            Enter the arena
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </Button>

        <div className="mt-16 sm:mt-20 pt-6 border-t border-border/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-display text-lg text-foreground">
              DONG<span className="text-primary">BET</span>
            </span>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Rules</a>
              <a href="mailto:19czaccaria@thelangton.org.uk" className="hover:text-primary transition-colors">Contact</a>
            </div>
            <span className="text-xs text-muted-foreground">© 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
