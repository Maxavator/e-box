
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import HeroSection from "@/components/auth/HeroSection";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
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
    <div className="flex min-h-screen bg-white text-foreground overflow-hidden">
      <div className="hidden lg:flex lg:w-3/5 bg-primary/5">
        <HeroSection />
      </div>
      <div className="flex flex-col justify-center w-full lg:w-2/5 px-4 py-12 sm:px-6 lg:px-12">
        <div className="w-full max-w-sm mx-auto">
          <div className="flex flex-col items-center mb-8">
            <img 
              src="/lovable-uploads/81af9ad8-b07d-41cb-b800-92cebc70e699.png" 
              alt="e-Box Logo" 
              className="h-16 mb-4"
            />
            <h2 className="text-2xl font-semibold text-gray-900 mt-2">Welcome Back</h2>
            <p className="text-gray-600 text-sm mt-1">Sign in to your account to continue</p>
          </div>
          
          <LoginForm />

          <Alert className="mt-6 bg-blue-50 border-blue-100">
            <InfoIcon className="h-4 w-4 text-blue-500" />
            <AlertTitle className="text-blue-800">Secure Authentication</AlertTitle>
            <AlertDescription className="text-xs text-blue-700">
              This system uses secure authentication to protect your data. All connections are encrypted.
            </AlertDescription>
          </Alert>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© 2025 Afrovation (Pty) Ltd. All rights reserved.</p>
            <p className="mt-1">Your workplace communication solution.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
