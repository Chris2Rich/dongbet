import { Target, TrendingUp, Trophy } from "lucide-react";

const steps = [
  {
    icon: Target,
    title: "PREDICT",
    description: "Pick your outcomes for upcoming matches and events that will happen on the day. Which team will win — make predictions before and during games.",
  },
  {
    icon: TrendingUp,
    title: "CLIMB",
    description: "Earn points for every correct prediction. The sharper your instincts, the higher you rise.",
  },
  {
    icon: Trophy,
    title: "WIN",
    description: "Top the leaderboard. At the end of the tournament winners will recieve their prizes.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 sm:py-24 md:py-32 relative">
      <div className="container mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl uppercase text-foreground mb-4">
            How it <span className="text-primary text-glow">works</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Three steps. Zero luck. Pure football knowledge.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="group relative bg-card border border-border rounded-xl p-6 sm:p-8 text-center transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_hsl(138_100%_59%/0.08)]"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 text-primary mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-110">
                <step.icon className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="font-display text-lg sm:text-xl uppercase text-foreground mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>

              {/* Step number */}
              <div className="absolute top-4 right-4 font-display text-5xl text-foreground/[0.04]">
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
