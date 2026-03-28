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
    <section className="py-20 sm:py-32 relative">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-display text-3xl sm:text-5xl uppercase text-foreground mb-4 opacity-0 animate-fade-up">
            How it <span className="text-primary">works</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-md mx-auto opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
            Three steps. Zero luck. Pure football knowledge.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="group relative glass p-5 sm:p-6 text-center border border-border hover:border-primary/30 transition-all duration-300 opacity-0 animate-fade-up"
              style={{ animationDelay: `${200 + i * 100}ms` }}
            >
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded bg-primary/10 text-primary mb-4 sm:mb-6 transition-all duration-300 group-hover:scale-105">
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg uppercase text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>

              <div className="absolute top-3 right-3 font-display text-4xl sm:text-5xl text-foreground/[0.03]">
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
