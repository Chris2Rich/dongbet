import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 rounded-full border border-border bg-background/60 backdrop-blur-xl px-6 py-2.5 shadow-lg">
      <span className="font-display text-base text-foreground tracking-tight">
        DONG<span className="text-primary">BET</span>
      </span>
      <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
        <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
        <a href="#countdown" className="hover:text-foreground transition-colors">Countdown</a>
      </div>
      <Button size="sm">Join now</Button>
    </nav>
  );
};

export default Navbar;
