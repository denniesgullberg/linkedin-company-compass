import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import RatingCategories from "@/components/RatingCategories";
import InstallGuide from "@/components/InstallGuide";

const Index = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <HowItWorks />
      <RatingCategories />
      <InstallGuide />
      
      <footer className="border-t border-border py-8 px-6 text-center">
        <p className="font-mono text-xs text-muted-foreground tracking-wider">
          HIRESCORE — Built for applicants, by applicants.
        </p>
      </footer>
    </main>
  );
};

export default Index;
