import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface UserData {
  firstname: string;
  lastname: string;
  formgroup: string;
}

const Login = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((digit) => digit !== "")) {
      handleSubmit(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (fullCode: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/users.json");
      const users: Record<string, UserData> = await response.json();

      const user = users[fullCode];
      if (user) {
        localStorage.setItem("dongbet_user", JSON.stringify(user));
        window.location.href = "/dashboard";
      } else {
        setError("Invalid code. Please check and try again.");
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = () => {
    const fullCode = code.join("");
    if (fullCode.length === 6) {
      handleSubmit(fullCode);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-grid flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 mb-8 opacity-0 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary/80 font-medium">Tournament 2026</span>
          </div>
          
          <h1 className="font-display text-5xl sm:text-7xl uppercase text-foreground mb-4 opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
            DONG<span className="text-primary text-glow">BET</span>
          </h1>
          <p className="text-muted-foreground text-lg opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
            Enter your code to join the competition
          </p>
        </div>

        <div 
          className={`glass rounded-2xl p-8 transition-all duration-500 ${isFocused ? 'border-primary/30 shadow-[0_0_60px_hsl(85_100%_55%/0.1)]' : ''} opacity-0 animate-scale-in`}
          style={{ animationDelay: "300ms" }}
        >
          <div className="flex justify-center gap-3 mb-8">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={loading}
                className="w-12 h-16 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border border-border bg-secondary/50 text-foreground focus:border-primary focus:bg-primary/10 focus:shadow-[0_0_20px_hsl(85_100%_55%/0.2)] outline-none transition-all duration-300"
              />
            ))}
          </div>

          {error && (
            <p className="text-center text-sm text-red-400 mb-6 animate-fade-up">{error}</p>
          )}

          <Button
            onClick={handleManualSubmit}
            disabled={loading || code.join("").length !== 6}
            className="w-full h-12 text-base font-semibold bg-primary text-background hover:bg-primary/90 rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_hsl(85_100%_55%/0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Verifying...
              </span>
            ) : (
              "Continue"
            )}
          </Button>
        </div>

        <p className="text-center text-muted-foreground/60 text-sm mt-8 opacity-0 animate-fade-up" style={{ animationDelay: "400ms" }}>
          Got your code from your teacher
        </p>
      </div>
    </div>
  );
};

export default Login;
