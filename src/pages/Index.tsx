import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PredictionCard from "@/components/PredictionCard";
import HowItWorks from "@/components/HowItWorks";
import CountdownSection from "@/components/CountdownSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      {/* Live prediction showcase */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl uppercase text-foreground mb-3">
              Make your <span className="text-primary text-glow">call</span>
            </h2>
            <p className="text-muted-foreground">Try a live prediction right now.</p>
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
