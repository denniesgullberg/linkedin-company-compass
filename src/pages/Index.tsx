import { Link } from "react-router-dom";
import { BarChart3 } from "lucide-react";
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

      <section className="py-16 px-6 text-center">
        <Link
          to="/leaderboard"
          className="inline-flex items-center gap-3 bg-primary text-primary-foreground font-mono font-bold text-sm px-8 py-4 rounded hover:bg-primary/90 transition-colors"
        >
          <BarChart3 className="w-5 h-5" />
          VIEW LEADERBOARD
        </Link>
      </section>
      
      <footer className="border-t border-border py-8 px-6 text-center">
        <p className="font-mono text-xs text-muted-foreground tracking-wider">
          HIRESCORE — Built for applicants, by applicants.
        </p>
      </footer>
    </main>
  );
};

export default Index;
