import heroImage from "@/assets/hero-stadium.jpg";
import { Button } from "@/components/ui/button";
import { Trophy, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Football stadium under floodlights"
          className="w-full h-full object-cover opacity-30"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <h2
          className="font-display text-[18vw] leading-none tracking-tighter text-foreground/[0.03] uppercase"
          aria-hidden="true"
        >
          DONGBET
        </h2>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-8">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Season 2026 is live</span>
          </div>
        </div>

        <h1
          className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl uppercase leading-[0.9] tracking-tight mb-6 animate-fade-up"
          style={{ animationDelay: "100ms" }}
        >
          <span className="text-foreground">DONG</span>
          <span className="text-primary text-glow">BET</span>
        </h1>

        <p
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up"
          style={{ animationDelay: "200ms" }}
        >
          Your football knowledge, rewarded. Predict match outcomes, climb the leaderboard, and prove you know the game better than anyone.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
          style={{ animationDelay: "300ms" }}
        >
          <Button variant="hero" size="xl">
            <Trophy className="w-5 h-5" />
            Join the competition
          </Button>
          <Button variant="outline" size="lg">
            How it works
          </Button>
        </div>

        {/* Stats bar */}
        <div
          className="mt-16 grid grid-cols-3 max-w-lg mx-auto gap-6 animate-fade-up"
          style={{ animationDelay: "400ms" }}
        >
          {[
            { value: "12K+", label: "Predictors" },
            { value: "£5K", label: "Prize Pool" },
            { value: "380", label: "Matches" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-2xl sm:text-3xl text-primary">{stat.value}</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
