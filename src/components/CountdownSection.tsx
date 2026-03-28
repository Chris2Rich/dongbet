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
    <section className="py-20 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[250px] h-[200px] bg-primary/5 rounded-full blur-[60px] pointer-events-none" />

      <div className="relative z-10 px-4 text-center">
        <h2 className="font-display text-3xl sm:text-5xl uppercase text-foreground mb-3 opacity-0 animate-fade-up">
          Kicks off <span className="text-primary">2nd April</span>
        </h2>
        <p className="text-muted-foreground text-base max-w-md mx-auto mb-10 sm:mb-14 opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
          The competition starts soon.
        </p>

        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto">
          {units.map((unit, i) => (
            <div
              key={unit.label}
              className="glass p-3 sm:p-5 border border-border hover:border-primary/30 transition-all duration-300 opacity-0 animate-fade-up"
              style={{ animationDelay: `${200 + i * 100}ms` }}
            >
              <div className="font-display text-2.5rem sm:text-4xl md:text-5xl text-primary tabular-nums">
                {String(unit.value).padStart(2, "0")}
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">
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
