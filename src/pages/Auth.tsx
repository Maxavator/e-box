
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import HeroSection from "@/components/auth/HeroSection";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createGlobalAdmin } from "@/utils/admin/createGlobalAdmin";

const Auth = () => {
  const navigate = useNavigate();
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

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

  const handleCreateAdmin = async () => {
    try {
      setIsCreatingAdmin(true);
      const adminUser = await createGlobalAdmin();
      if (adminUser) {
        toast.success(`Global admin created: ${adminUser.email}`);
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      toast.error("Failed to create global admin");
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-foreground">
      <div className="hidden md:flex md:w-1/2 bg-primary/5">
        <HeroSection />
      </div>
      <div className="flex flex-col justify-center w-full md:w-1/2 px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="w-full max-w-sm mx-auto">
          <div className="flex flex-col items-center mb-8">
            <img 
              src="/lovable-uploads/81af9ad8-b07d-41cb-b800-92cebc70e699.png" 
              alt="e-Box Logo" 
              className="h-16 mb-4"
            />
          </div>
          
          <LoginForm />

          <Alert className="mt-6 bg-blue-50">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Secure Authentication</AlertTitle>
            <AlertDescription className="text-xs">
              This system uses secure authentication to protect your data.
            </AlertDescription>
          </Alert>

          <div className="mt-8 border-t pt-6">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleCreateAdmin}
              disabled={isCreatingAdmin}
            >
              {isCreatingAdmin ? "Creating Admin..." : "Create Global Admin"}
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              This will create a default global admin account
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
