
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { Building2, LogIn } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { isAdmin, userRole, isLoading } = useUserRole();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // If user is logged in and has appropriate role, redirect to admin
      if (session && !isLoading && (isAdmin || userRole === 'org_admin')) {
        navigate('/admin');
      }
      // If user is logged in but not admin, redirect to dashboard
      else if (session && !isLoading) {
        navigate('/dashboard');
      }
    };

    checkSession();
  }, [navigate, isAdmin, userRole, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <img 
          src="/lovable-uploads/81af9ad8-b07d-41cb-b800-92cebc70e699.png" 
          alt="Logo" 
          className="h-16 mx-auto mb-8"
        />
        <h1 className="text-4xl font-bold mb-4">Welcome to e-Box</h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          Your centralized platform for organizational management and collaboration
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button 
            onClick={() => navigate('/auth')}
            className="flex items-center gap-2"
            size="lg"
          >
            <LogIn className="w-5 h-5" />
            Login to Continue
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate('/auth')}
            className="flex items-center gap-2"
            size="lg"
          >
            <Building2 className="w-5 h-5" />
            Request Demo
          </Button>
        </div>
      </div>
      
      <footer className="fixed bottom-4 text-center text-sm text-muted-foreground">
        <p>Version 1.91 | © 2024 e-Box. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
