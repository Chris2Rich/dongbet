import HeroSection from "@/components/HeroSection";
import PredictionCard from "@/components/PredictionCard";
import HowItWorks from "@/components/HowItWorks";
import CountdownSection from "@/components/CountdownSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      <section className="py-20 sm:py-28 relative">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-noise pointer-events-none" />
        
        <div className="absolute top-0 left-1/4 w-[300px] h-[250px] bg-accent/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 px-4">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="font-display text-3xl sm:text-5xl uppercase text-foreground mb-4 opacity-0 animate-fade-up">
              Make your <span className="text-primary">call</span>
            </h2>
            <p className="text-muted-foreground text-base opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
              Try a live prediction.
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
