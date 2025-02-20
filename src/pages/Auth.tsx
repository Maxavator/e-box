
import { useState } from "react";
import HeroSection from "@/components/auth/HeroSection";
import LoginForm from "@/components/auth/LoginForm";
import DemoRequestDialog from "@/components/auth/DemoRequestDialog";
import { OrganizationUsersList } from "@/components/admin/OrganizationUsersList";

const Auth = () => {
  const [isDemoDialogOpen, setIsDemoDialogOpen] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row items-stretch bg-gradient-to-b from-brand-50 to-background">
      <HeroSection />
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
        <div className="w-full px-8 pb-8 flex justify-center">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/4415dded-8eed-482f-ab46-9019698e147f.png" 
              alt="e-Box Logo" 
              className="h-16 w-auto"
            />
          </div>
        </div>
        <LoginForm onRequestDemo={() => setIsDemoDialogOpen(true)} />
        <div className="w-full max-w-md mt-8 px-4">
          <OrganizationUsersList />
        </div>
      </div>
      <DemoRequestDialog 
        open={isDemoDialogOpen} 
        onOpenChange={setIsDemoDialogOpen}
      />
    </div>
  );
};

export default Auth;
