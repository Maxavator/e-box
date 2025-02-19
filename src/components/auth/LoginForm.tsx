
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface LoginFormProps {
  onRequestDemo: () => void;
}

const LoginForm = ({ onRequestDemo }: LoginFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!username || !password) {
      uiToast({
        title: "Invalid Credentials",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Query the user's email using their SA ID
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('sa_id', username)
        .single();

      if (profileError || !profiles) {
        console.error('Profile lookup error:', profileError);
        toast.error("Invalid credentials");
        setIsLoading(false);
        return;
      }

      // Now authenticate with Supabase using the email associated with the SA ID
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: `${username}@example.com`,
        password: password,
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        toast.error("Invalid credentials");
        setIsLoading(false);
        return;
      }

      // After successful authentication, check the user role
      const { data: isGlobalAdmin, error: adminCheckError } = await supabase.rpc('is_global_admin');
      
      if (adminCheckError) {
        console.error('Error checking admin status:', adminCheckError);
        toast.error("Failed to verify admin status");
        setIsLoading(false);
        return;
      }

      if (isGlobalAdmin) {
        navigate("/admin");
        toast.success("Welcome, Global Admin!");
      } else {
        // Check if user is an org admin
        const { data: isOrgAdmin, error: orgAdminCheckError } = await supabase.rpc('is_org_admin');
        
        if (orgAdminCheckError) {
          console.error('Error checking org admin status:', orgAdminCheckError);
          toast.error("Failed to verify organization admin status");
          setIsLoading(false);
          return;
        }

        if (isOrgAdmin) {
          navigate("/organization");
          toast.success("Welcome, Organization Admin!");
        } else {
          navigate("/chat");
          toast.success("Welcome!");
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col items-center justify-center bg-gradient-to-br from-white/90 to-white/50 backdrop-blur-sm">
      <Card className="w-full max-w-md animate-fadeIn shadow-xl hover:shadow-2xl transition-shadow duration-300 border-primary/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-primary">
            Welcome to e-Box
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            Enter your credentials to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="username">Username</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>For testing, use:</p>
                      <p>Regular user: 6010203040512</p>
                      <p>Org admin: 5010203040512</p>
                      <p>Global admin: 4010203040512</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full focus:ring-primary"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Password format: Test + username</p>
                      <p>Example: Test6010203040512</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full focus:ring-primary"
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 transition-colors duration-300"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-4">
          <div className="text-center w-full">
            <button
              type="button"
              onClick={onRequestDemo}
              className="text-primary hover:text-primary/80 text-sm font-medium transition-colors inline-flex items-center gap-2"
              disabled={isLoading}
            >
              <Mail className="w-4 h-4" />
              Request a Demo
            </button>
          </div>
        </CardFooter>
      </Card>
      <div className="mt-4">
        <span className="text-xs text-gray-500">
          Version 1.98
        </span>
      </div>
    </div>
  );
};

export default LoginForm;
