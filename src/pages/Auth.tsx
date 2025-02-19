
import { useState } from "react";
import HeroSection from "@/components/auth/HeroSection";
import LoginForm from "@/components/auth/LoginForm";
import DemoRequestDialog from "@/components/auth/DemoRequestDialog";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [isDemoDialogOpen, setIsDemoDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check user role and redirect accordingly
        const { data: isAdmin } = await supabase.rpc('is_global_admin');
        if (isAdmin) {
          navigate("/admin");
        } else {
          const { data: userData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();

          if (userData?.role === 'org_admin') {
            navigate("/organization");
          } else {
            navigate("/chat");
          }
        }
      }
    };

    checkSession();
  }, [navigate]);

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
      </div>
      <DemoRequestDialog 
        open={isDemoDialogOpen} 
        onOpenChange={setIsDemoDialogOpen}
      />
    </div>
  );
};

export default Auth;
