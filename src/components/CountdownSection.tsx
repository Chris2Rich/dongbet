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
    { label: "Mins", value: timeLeft.minutes },
    { label: "Secs", value: timeLeft.seconds },
  ];

  return (
    <section className="py-16 sm:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      
      <div className="absolute top-0 right-1/4 w-48 sm:w-[300px] h-48 sm:h-[300px] bg-accent/5 rounded-full blur-[60px] sm:blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-40 sm:w-[250px] h-40 sm:h-[200px] bg-primary/5 rounded-full blur-[50px] sm:blur-[60px] pointer-events-none" />

      <div className="relative z-10 px-5 sm:px-6 text-center">
        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl uppercase text-foreground mb-2 sm:mb-3 opacity-0 animate-fade-up">
          Kicks off <span className="text-primary">2nd April</span>
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-sm sm:max-w-md mx-auto mb-8 sm:mb-12 opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
          The competition starts soon.
        </p>

        <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-xs sm:max-w-md mx-auto">
          {units.map((unit, i) => (
            <div
              key={unit.label}
              className="glass p-3 sm:p-5 border border-border hover:border-primary/30 transition-all duration-300 opacity-0 animate-fade-up"
              style={{ animationDelay: `${200 + i * 100}ms` }}
            >
              <div className="font-display text-2xl sm:text-4xl md:text-5xl text-primary tabular-nums leading-none mb-1 sm:mb-1.5">
                {String(unit.value).padStart(2, "0")}
              </div>
              <div className="text-[9px] sm:text-[11px] text-muted-foreground uppercase tracking-widest">
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
