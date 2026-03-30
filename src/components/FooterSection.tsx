import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, ArrowRight } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="relative py-16 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-[400px] h-40 sm:h-[250px] bg-primary/5 rounded-full blur-[60px] sm:blur-[80px] pointer-events-none" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-40">
        <h2 className="font-display text-[45vw] leading-none tracking-tighter text-foreground/[0.01] uppercase">
          DONGBET
        </h2>
      </div>

      <div className="relative z-10 px-5 sm:px-6 text-center">
        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl uppercase text-foreground mb-3 sm:mb-4 opacity-0 animate-fade-up">
          Don't just <span className="text-primary">watch</span>
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base mb-8 sm:mb-10 max-w-xs sm:max-w-md mx-auto opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
          Your intuition, rewarded. Join predictors competing this term.
        </p>
        <Button variant="hero" size="default" className="opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }} asChild>
          <Link to="/login">
            <Trophy className="w-4 h-4 mr-1.5" />
            Enter the arena
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </Button>

        <div className="mt-14 sm:mt-20 pt-5 border-t border-border/40">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <span className="font-display text-base text-foreground order-1 sm:order-none">
              DONG<span className="text-primary">BET</span>
            </span>
            <div className="flex items-center gap-5 text-xs sm:text-sm text-muted-foreground order-2 sm:order-none">
              <a href="#" className="hover:text-primary transition-colors">Rules</a>
              <a href="mailto:19czaccaria@thelangton.org.uk" className="hover:text-primary transition-colors">Contact</a>
              <a href="/admin" className="text-[10px] opacity-30 hover:opacity-100 transition-opacity">admin</a>
            </div>
            <span className="text-[10px] sm:text-xs text-muted-foreground order-3 sm:order-none">© 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
