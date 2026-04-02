import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { login } from "@/lib/api";

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
      const user = await login(fullCode);
      localStorage.setItem("dongbet_user", JSON.stringify(user));
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code. Please check and try again.");
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
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
    <div className="min-h-[100svh] bg-background bg-grid flex flex-col items-center justify-center px-5 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 sm:w-[500px] h-48 sm:h-[400px] bg-primary/5 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-48 sm:w-[300px] h-32 sm:h-[200px] bg-accent/5 rounded-full blur-[60px] sm:blur-[80px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-primary/20 bg-primary/5 mb-6 sm:mb-8 opacity-0 animate-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] sm:text-xs text-primary/80 font-medium">Tournament 2026</span>
          </div>
          
          <h1 className="font-display text-3xl sm:text-5xl uppercase text-foreground mb-2 sm:mb-3 opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
            DONG<span className="text-primary">BET</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
            Enter your 6-digit code
          </p>
        </div>

        <div 
          className={`glass p-5 sm:p-8 transition-all duration-300 ${isFocused ? 'border-primary/30' : ''} opacity-0 animate-scale-in`}
          style={{ animationDelay: "300ms" }}
        >
          <div className="flex justify-center gap-2 sm:gap-3 mb-5 sm:mb-6">
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
                className="w-10 h-12 sm:w-12 sm:h-14 text-lg sm:text-2xl font-bold text-center border border-border bg-secondary/50 text-foreground focus:border-primary focus:bg-primary/10 outline-none transition-all rounded-sm"
              />
            ))}
          </div>

          {error && (
            <p className="text-center text-xs sm:text-sm text-red-400 mb-4 animate-fade-up">{error}</p>
          )}

          <Button
            onClick={handleManualSubmit}
            disabled={loading || code.join("").length !== 6}
            className="w-full h-10 sm:h-11 text-xs sm:text-sm font-semibold disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Continue"}
          </Button>
        </div>

        <p className="text-center text-muted-foreground/60 text-[11px] sm:text-xs mt-5 sm:mt-6 opacity-0 animate-fade-up" style={{ animationDelay: "400ms" }}>
          Get your code from the DongBet stall. Each account costs £3.
        </p>
      </div>
    </div>
  );
};

export default Login;
