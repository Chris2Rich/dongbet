import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-stadium.jpg";
import { Button } from "@/components/ui/button";
import { Trophy, Zap, Users, Award, Ticket } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Football stadium"
          className="w-full h-full object-cover opacity-30"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
      </div>

      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="absolute top-1/3 left-1/4 w-48 sm:w-[300px] h-48 sm:h-[300px] bg-primary/8 rounded-full blur-[60px] sm:blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-40 sm:w-[250px] h-40 sm:h-[250px] bg-accent/8 rounded-full blur-[50px] sm:blur-[60px] pointer-events-none" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <h2 className="font-display text-[30vw] sm:text-[40vw] md:text-[50vw] leading-none tracking-tighter text-foreground/[0.015] uppercase whitespace-nowrap">
          DONGBET
        </h2>
      </div>

      <div className="relative z-10 w-full px-5 sm:px-6 text-center pt-20 pb-10">
        <div className="inline-flex items-center gap-2 rounded-sm border border-primary/20 bg-primary/5 px-3 py-1.5 mb-6 sm:mb-8 opacity-0 animate-fade-up">
          <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary animate-pulse" />
          <span className="text-[11px] sm:text-xs font-medium text-primary tracking-wide">Tournament 2026</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
          <span className="text-[11px] sm:text-xs text-muted-foreground">2nd April</span>
        </div>

        <h1 className="font-display text-3xl md:text-7xl lg:text-8xl uppercase leading-[0.85] tracking-tight mb-4 sm:mb-6 opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <span className="text-foreground">DONG</span>
          <span className="text-primary">BET</span>
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground max-w-xs sm:max-w-md mx-auto mb-8 sm:mb-10 leading-relaxed opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
          Your football knowledge, rewarded. Predict match outcomes and climb the leaderboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10 sm:mb-14 opacity-0 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <Button variant="hero" size="lg" asChild>
            <Link to="/login">
              <Trophy className="w-4 h-4 mr-1.5" />
              Join now
            </Link>
          </Button>
          <Button variant="outline" size="default" asChild>
            <Link to="/#how">
              How it works
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 max-w-xs sm:max-w-sm mx-auto opacity-0 animate-fade-up" style={{ animationDelay: "400ms" }}>
          {[
            { icon: Award, value: "£50", label: "Prize", color: "text-accent" },
            { icon: Ticket, value: "£3", label: "Entry", color: "text-primary" },
          ].map((stat) => (
            <div key={stat.label} className="glass p-3 sm:p-4 border border-border/50">
              <stat.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${stat.color} mx-auto mb-1.5 sm:mb-2`} />
              <div className={`font-display text-lg sm:text-xl ${stat.color} tabular-nums mb-0.5`}>{stat.value}</div>
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
