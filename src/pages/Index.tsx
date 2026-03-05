import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import SupportedLanguagesSection from "@/components/landing/SupportedLanguagesSection";
import ComparisonSection from "@/components/landing/ComparisonSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FAQSection from "@/components/landing/FAQSection";
import TrustSection from "@/components/landing/TrustSection";
import NewsletterSection from "@/components/landing/NewsletterSection";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <SupportedLanguagesSection />
        <ComparisonSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FAQSection />
        <TrustSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
