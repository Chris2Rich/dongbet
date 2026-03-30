import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 sm:gap-6 rounded-full border border-border bg-background/70 backdrop-blur-xl px-4 sm:px-6 py-2 sm:py-2.5 shadow-lg shadow-background/50">
      <span className="font-display text-sm sm:text-base text-foreground tracking-tight">
        DONG<span className="text-primary">BET</span>
      </span>
      <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
        <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
        <a href="#countdown" className="hover:text-foreground transition-colors">Countdown</a>
      </div>
      <Button size="sm" className="text-xs" asChild>
        <Link to="/login">Join now</Link>
      </Button>
    </nav>
  );
};

export default Navbar;
