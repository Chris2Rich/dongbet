import { CheckCircle, Mail, Gift } from "lucide-react";

const TournamentOver = () => {
  return (
    <div className="min-h-[100svh] bg-background bg-grid relative overflow-hidden">
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      <div className="absolute top-0 right-0 w-48 sm:w-[400px] h-40 sm:h-[300px] bg-primary/5 rounded-full blur-[60px] sm:blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 sm:w-[300px] h-32 sm:h-[200px] bg-accent/5 rounded-full blur-[50px] sm:blur-[60px] pointer-events-none" />

      <div className="relative z-10 px-4 sm:px-6 py-6 sm:py-12">
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-primary/20 bg-primary/5 mb-6 sm:mb-8 opacity-0 animate-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] sm:text-xs text-primary/80 font-medium">Tournament Complete</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl uppercase text-foreground mb-4 sm:mb-6 opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
            It's <span className="text-primary">over</span>
          </h1>

          <p className="text-muted-foreground text-sm sm:text-lg mb-8 sm:mb-12 opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
            The tournament has ended. Thank you to everyone who participated.
          </p>

          <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
            <div className="glass p-4 sm:p-6 border border-border opacity-0 animate-fade-up" style={{ animationDelay: "300ms" }}>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-sm bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-display text-xs sm:text-sm uppercase text-foreground mb-1">Standings by Email</h3>
                  <p className="text-muted-foreground text-[11px] sm:text-xs">All participants will receive their final standings and results via email.</p>
                </div>
              </div>
            </div>

            <div className="glass p-4 sm:p-6 border border-border opacity-0 animate-fade-up" style={{ animationDelay: "400ms" }}>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-sm bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                </div>
                <div className="text-left">
                  <h3 className="font-display text-xs sm:text-sm uppercase text-foreground mb-1">Winner's Prize</h3>
                  <p className="text-muted-foreground text-[11px] sm:text-xs">The overall winner will receive a £20 Amazon gift card, delivered to their email.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="opacity-0 animate-fade-up" style={{ animationDelay: "500ms" }}>
            <a
              href="/leaderboard"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm"
            >
              <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>View final leaderboard</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentOver;
