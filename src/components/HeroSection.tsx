import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-stadium.jpg";
import { Button } from "@/components/ui/button";
import { Trophy, Zap, Users, Award, ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Football stadium"
          className="w-full h-full object-cover opacity-40"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
      </div>

      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: "1s" }} />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <h2 className="font-display text-[30vw] leading-none tracking-tighter text-foreground/[0.02] uppercase animate-float">
          DONGBET
        </h2>
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 mb-10 opacity-0 animate-fade-up">
          <Zap className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm font-medium text-primary">Tournament 2026</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
          <span className="text-sm text-muted-foreground">2nd April</span>
        </div>

        <h1 className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] uppercase leading-[0.85] tracking-tight mb-8 opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <span className="text-foreground">DONG</span>
          <span className="text-primary text-glow">BET</span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
          Your football knowledge, rewarded. Predict match outcomes, climb the leaderboard, and prove you know the game better than anyone.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 opacity-0 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <Button variant="hero" size="xl" className="group" asChild>
            <Link to="/login">
              <Trophy className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              Join the competition
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="border-border/50 hover:border-primary/50" asChild>
            <Link to="/#how">
              How it works
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto opacity-0 animate-fade-up" style={{ animationDelay: "400ms" }}>
          {[
            { icon: Users, value: "1,000+", label: "Predictors", color: "text-primary" },
            { icon: Award, value: "£250", label: "Prize Pool", color: "text-accent" },
            { icon: Trophy, value: "50+", label: "Matches", color: "text-primary" },
          ].map((stat, i) => (
            <div key={stat.label} className="glass rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:scale-105">
              <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-3`} />
              <div className={`font-display text-3xl sm:text-4xl ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-up" style={{ animationDelay: "600ms" }}>
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border border-border/50 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-primary rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
