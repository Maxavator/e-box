
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import HeroSection from "@/components/auth/HeroSection";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          return;
        }
        
        if (data.session) {
          console.log("User already logged in, redirecting to dashboard");
          toast.success("Already logged in");
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Failed to check session:", err);
      }
    };
    
    checkSession();
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-white text-foreground">
      <div className="hidden md:flex md:w-1/2 bg-primary/5">
        <HeroSection />
      </div>
      <div className="flex flex-col justify-center w-full md:w-1/2 px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="w-full max-w-sm mx-auto">
          <div className="flex flex-col items-center mb-8">
            <img 
              src="/lovable-uploads/dbb30299-d801-4939-9dd4-ef26c4cc55cd.png" 
              alt="e-Box Logo" 
              className="h-20 mb-4"
            />
            <div className="text-center text-xs text-muted-foreground mt-1">
              <p>powered by</p>
              <img 
                src="/lovable-uploads/7366015f-cd77-4ca3-94bb-3848e07b8868.png" 
                alt="Afrovation Logo" 
                className="h-5 mt-1" 
              />
            </div>
          </div>
          
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Auth;
