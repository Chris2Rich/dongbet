import { Target, TrendingUp, Trophy } from "lucide-react";

const steps = [
  {
    icon: Target,
    title: "Predict",
    description: "Pick your outcomes for upcoming matches. Home win, draw, or away — lock it in before kickoff.",
  },
  {
    icon: TrendingUp,
    title: "Climb",
    description: "Earn points for every correct prediction. The sharper your instincts, the higher you rise.",
  },
  {
    icon: Trophy,
    title: "Win",
    description: "Top the leaderboard at the end of the season and claim your share of the prize pool.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-40 relative">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="font-display text-5xl sm:text-7xl uppercase text-foreground mb-6 opacity-0 animate-fade-up">
            How it <span className="text-primary text-glow">works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
            Three steps. Zero luck. Pure football knowledge.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="group relative glass rounded-3xl p-10 text-center border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-[0_0_60px_hsl(85_100%_55%/0.1)] hover:-translate-y-2 opacity-0 animate-fade-up"
              style={{ animationDelay: `${200 + i * 100}ms` }}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-8 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_hsl(85_100%_55%/0.3)]">
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl uppercase text-foreground mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>

              <div className="absolute top-6 right-6 font-display text-6xl text-foreground/[0.03]">
                {String(i + 1).padStart(2, "0")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
