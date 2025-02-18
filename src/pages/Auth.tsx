
import { useState } from "react";
import HeroSection from "@/components/auth/HeroSection";
import LoginForm from "@/components/auth/LoginForm";
import DemoRequestDialog from "@/components/auth/DemoRequestDialog";
import { Image } from "lucide-react";

const Auth = () => {
  const [isDemoDialogOpen, setIsDemoDialogOpen] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row items-stretch bg-gradient-to-b from-brand-50 to-background">
      <HeroSection />
      <div className="w-full md:w-1/2 flex flex-col items-center">
        <div className="w-full p-8 flex justify-center">
          <div className="flex items-center gap-2 text-primary">
            <Image className="w-10 h-10" />
            <span className="text-2xl font-bold">e-Box</span>
          </div>
        </div>
        <LoginForm onRequestDemo={() => setIsDemoDialogOpen(true)} />
      </div>
      <DemoRequestDialog 
        open={isDemoDialogOpen} 
        onOpenChange={setIsDemoDialogOpen}
      />
    </div>
  );
};

export default Auth;
