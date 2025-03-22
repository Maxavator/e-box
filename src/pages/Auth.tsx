
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import HeroSection from "@/components/auth/HeroSection";
import DemoRequestDialog from "@/components/auth/DemoRequestDialog";
import { CreateGolderOrgButton } from "@/components/auth/CreateGolderOrgButton";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/dashboard");
      }
    };
    
    checkSession();
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:flex md:w-1/2 bg-primary/5">
        <HeroSection />
      </div>
      <div className="flex flex-col justify-center w-full md:w-1/2 px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="w-full max-w-sm mx-auto">
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your credentials below to access your workspace
          </p>
          
          <LoginForm />

          <div className="mt-4">
            <DemoRequestDialog />
          </div>

          <div className="mt-8 border-t pt-4">
            <h3 className="text-sm font-medium">Developer Tools</h3>
            <CreateGolderOrgButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
