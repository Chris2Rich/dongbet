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
    <section className="py-16 sm:py-24 md:py-32 relative">
      <div className="container mx-auto text-center">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl uppercase text-foreground mb-4">
          Kicks off <span className="text-primary text-glow">2nd April</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-10 sm:mb-16">
          The competition starts soon. Get ready to prove your football knowledge.
        </p>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
          {units.map((unit) => (
            <div
              key={unit.label}
              className="bg-card border border-border rounded-xl p-4 sm:p-6 transition-all hover:border-primary/30 hover:shadow-[0_0_30px_hsl(138_100%_59%/0.08)]"
            >
              <div className="font-display text-3xl sm:text-4xl md:text-5xl text-primary tabular-nums">
                {String(unit.value).padStart(2, "0")}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-2">
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
