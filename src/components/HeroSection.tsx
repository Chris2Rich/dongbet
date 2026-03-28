import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-stadium.jpg";
import { Button } from "@/components/ui/button";
import { Trophy, Zap, Users, Award } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Football stadium"
          className="w-full h-full object-cover opacity-35"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background" />
      </div>

      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[250px] h-[250px] bg-accent/10 rounded-full blur-[60px] pointer-events-none" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <h2 className="font-display text-[40vw] leading-none tracking-tighter text-foreground/[0.015] uppercase">
          DONGBET
        </h2>
      </div>

      <div className="relative z-10 px-4 text-center">
        <div className="inline-flex items-center gap-2 sm:gap-3 rounded border border-primary/20 bg-primary/5 px-3 py-1.5 sm:px-4 sm:py-2 mb-8 opacity-0 animate-fade-up">
          <Zap className="w-3.5 h-3.5 text-primary animate-pulse" />
          <span className="text-xs font-medium text-primary">Tournament 2026</span>
          <span className="hidden sm:inline w-1 h-1 rounded-full bg-muted-foreground/50" />
          <span className="hidden sm:inline text-xs text-muted-foreground">2nd April</span>
        </div>

        <h1 className="font-display text-[2.5rem] sm:text-5xl md:text-7xl lg:text-8xl uppercase leading-[0.9] tracking-tight mb-6 opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <span className="text-foreground">DONG</span>
          <span className="text-primary">BET</span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto mb-10 opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
          Your football knowledge, rewarded. Predict match outcomes and climb the leaderboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14 opacity-0 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <Button variant="hero" asChild>
            <Link to="/login">
              <Trophy className="w-4 h-4 mr-2" />
              Join now
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/#how">
              How it works
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-sm mx-auto opacity-0 animate-fade-up" style={{ animationDelay: "400ms" }}>
          {[
            { icon: Users, value: "1K+", label: "Players", color: "text-primary" },
            { icon: Award, value: "£250", label: "Prize", color: "text-accent" },
            { icon: Trophy, value: "50+", label: "Games", color: "text-primary" },
          ].map((stat) => (
            <div key={stat.label} className="glass p-3 sm:p-5 border border-border/50">
              <stat.icon className={`w-4 h-4 ${stat.color} mx-auto mb-2`} />
              <div className={`font-display text-xl sm:text-2xl ${stat.color} mb-0.5`}>{stat.value}</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
