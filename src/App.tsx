import { LanguageProvider } from "@/lib/language-context";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";

export default function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <HeroSection />
      </div>
    </LanguageProvider>
  );
}
