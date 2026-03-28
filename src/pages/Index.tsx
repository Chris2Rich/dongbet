import HeroSection from "@/components/HeroSection";
import PredictionCard from "@/components/PredictionCard";
import HowItWorks from "@/components/HowItWorks";
import CountdownSection from "@/components/CountdownSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      <section className="py-40 relative">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-noise pointer-events-none" />
        
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-5xl sm:text-7xl uppercase text-foreground mb-6 opacity-0 animate-fade-up">
              Make your <span className="text-primary text-glow">call</span>
            </h2>
            <p className="text-muted-foreground text-lg opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
              Try a live prediction right now.
            </p>
          </div>
          <PredictionCard />
        </div>
      </section>

      <div id="how">
        <HowItWorks />
      </div>
      <div id="countdown">
        <CountdownSection />
      </div>
      <FooterSection />
    </div>
  );
};

export default Index;
