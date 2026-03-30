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
    description: "Top the leaderboard at the end and claim your share of the prize pool.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 sm:py-28 relative">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      
      <div className="absolute top-1/2 left-0 w-48 sm:w-[300px] h-48 sm:h-[300px] bg-primary/5 rounded-full blur-[60px] sm:blur-[80px] pointer-events-none" />

      <div className="relative z-10 px-5 sm:px-6">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl uppercase text-foreground mb-3 opacity-0 animate-fade-up">
            How it <span className="text-primary">works</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-sm sm:max-w-md mx-auto opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
            Three steps. Zero luck. Pure football knowledge.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 max-w-3xl mx-auto">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="group relative glass p-5 sm:p-6 text-center border border-border hover:border-primary/30 transition-all duration-300 opacity-0 animate-fade-up"
              style={{ animationDelay: `${200 + i * 100}ms` }}
            >
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-sm bg-primary/10 text-primary mb-3 sm:mb-5 transition-transform duration-300 group-hover:scale-105">
                  <step.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-display text-base sm:text-lg uppercase text-foreground mb-1.5 sm:mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{step.description}</p>
              </div>

              <div className="absolute top-2.5 right-3 font-display text-3xl sm:text-5xl text-foreground/[0.03]">
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
