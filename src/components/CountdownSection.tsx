import { useState, useEffect } from "react";

const TARGET_DATE = new Date("2026-04-02T09:00:00");

const CountdownSection = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const now = new Date();
    const diff = Math.max(0, TARGET_DATE.getTime() - now.getTime());
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <section className="py-40 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 text-center">
        <h2 className="font-display text-5xl sm:text-7xl uppercase text-foreground mb-4 opacity-0 animate-fade-up">
          Kicks off <span className="text-primary text-glow">2nd April</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-16 opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
          The competition starts soon. Get ready to prove your football knowledge.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto">
          {units.map((unit, i) => (
            <div
              key={unit.label}
              className="glass rounded-3xl p-6 sm:p-8 border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-[0_0_40px_hsl(85_100%_55%/0.1)] hover:-translate-y-1 opacity-0 animate-fade-up"
              style={{ animationDelay: `${200 + i * 100}ms` }}
            >
              <div className="font-display text-5xl sm:text-6xl md:text-7xl text-primary tabular-nums mb-2">
                {String(unit.value).padStart(2, "0")}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-widest">
                {unit.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CountdownSection;
