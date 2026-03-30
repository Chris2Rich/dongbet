import HeroSection from "@/components/HeroSection";
import PredictionCard from "@/components/PredictionCard";
import HowItWorks from "@/components/HowItWorks";
import CountdownSection from "@/components/CountdownSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <HeroSection />

      <section className="py-16 sm:py-24 relative">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute inset-0 bg-noise pointer-events-none" />
        
        <div className="absolute top-0 left-1/4 w-48 sm:w-[300px] h-40 sm:h-[250px] bg-accent/5 rounded-full blur-[60px] sm:blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 px-5 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl uppercase text-foreground mb-3 opacity-0 animate-fade-up">
              Make your <span className="text-primary">call</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
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
