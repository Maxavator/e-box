
import { useState } from "react";
import HeroSection from "@/components/auth/HeroSection";
import LoginForm from "@/components/auth/LoginForm";
import DemoRequestDialog from "@/components/auth/DemoRequestDialog";

const Auth = () => {
  const [isDemoDialogOpen, setIsDemoDialogOpen] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row items-stretch bg-gradient-to-b from-brand-50 to-background">
      <HeroSection />
      <LoginForm onRequestDemo={() => setIsDemoDialogOpen(true)} />
      <DemoRequestDialog 
        open={isDemoDialogOpen} 
        onOpenChange={setIsDemoDialogOpen}
      />
    </div>
  );
};

export default Auth;
