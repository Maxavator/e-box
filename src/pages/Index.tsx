
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { Building2, LogIn, Loader2 } from "lucide-react";
import { APP_VERSION } from "@/utils/version";

const Index = () => {
  const navigate = useNavigate();
  const { isAdmin, userRole, isLoading } = useUserRole();
  const [status, setStatus] = useState<string>("Checking your session...");

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setStatus("Checking your access level...");
        
        if (!isLoading) {
          setStatus("Welcome back! Taking you to your dashboard...");
          setTimeout(() => navigate('/dashboard'), 1000);
        }
      } else if (!isLoading) {
        setStatus(""); // Clear status for non-authenticated users
      }
    };

    checkSession();
  }, [navigate, isAdmin, userRole, isLoading]);

  if (isLoading || status !== "") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background animate-fadeIn">
        <img 
          src="/lovable-uploads/dbb30299-d801-4939-9dd4-ef26c4cc55cd.png" 
          alt="e-Box Logo" 
          className="h-20 mb-8 animate-pulse"
        />
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          <p className="text-muted-foreground">{status}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background animate-fadeIn">
      <div className="text-center space-y-6 p-8">
        <img 
          src="/lovable-uploads/dbb30299-d801-4939-9dd4-ef26c4cc55cd.png" 
          alt="e-Box Logo" 
          className="h-24 mx-auto mb-6 hover:scale-105 transition-transform"
        />
        <div className="flex flex-col items-center">
          <p className="text-xs text-muted-foreground">powered by</p>
          <img 
            src="/lovable-uploads/7366015f-cd77-4ca3-94bb-3848e07b8868.png" 
            alt="Afrovation" 
            className="h-6 mt-1"
          />
        </div>
        
        <h1 className="text-4xl font-bold mb-4 animate-fadeIn mt-6">Welcome to e-Box</h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto animate-fadeIn delay-100">
          Your centralized platform for organizational management and collaboration
        </p>
        
        <div className="flex justify-center mt-8 animate-fadeIn delay-200">
          <Button 
            onClick={() => navigate('/auth')}
            className="flex items-center gap-2 transition-all hover:scale-105"
            size="lg"
          >
            <LogIn className="w-5 h-5" />
            Login to Continue
          </Button>
        </div>
      </div>
      
      <footer className="fixed bottom-4 text-center text-sm text-muted-foreground animate-fadeIn delay-300">
        <p>Version {APP_VERSION.replace('v', '')} | © 2025 Afrovation. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
