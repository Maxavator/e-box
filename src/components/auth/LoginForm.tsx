import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LoginFormProps {
  onRequestDemo: () => void;
}

const LoginForm = ({ onRequestDemo }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saId, setSaId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'saId'>('email');
  const navigate = useNavigate();

  const validateSaId = (id: string) => {
    // Basic SA ID validation (13 digits)
    return /^\d{13}$/.test(id);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginMethod === 'email') {
      if (!email || !password) {
        toast.error("Please enter both email and password");
        return;
      }
    } else {
      if (!saId) {
        toast.error("Please enter your SA ID number");
        return;
      }
      if (!validateSaId(saId)) {
        toast.error("Please enter a valid 13-digit SA ID number");
        return;
      }
    }

    setIsLoading(true);
    try {
      if (loginMethod === 'email') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        if (data.session) {
          toast.success("Login successful!");
          navigate("/admin");
        }
      } else {
        // Using SA ID as both email and password for simplicity
        // In a real app, you'd want to hash this and handle it more securely
        const { data, error } = await supabase.auth.signInWithPassword({
          email: `${saId}@said.auth`,
          password: saId,
        });

        if (error) throw error;
        if (data.session) {
          toast.success("Login successful!");
          navigate("/admin");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (loginMethod === 'email') {
      if (!email || !password) {
        toast.error("Please enter both email and password");
        return;
      }
    } else {
      if (!saId) {
        toast.error("Please enter your SA ID number");
        return;
      }
      if (!validateSaId(saId)) {
        toast.error("Please enter a valid 13-digit SA ID number");
        return;
      }
    }

    setIsLoading(true);
    try {
      if (loginMethod === 'email') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        if (data.user) {
          toast.success("Registration successful! Please check your email to confirm your account.");
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: `${saId}@said.auth`,
          password: saId,
        });

        if (error) throw error;
        if (data.user) {
          toast.success("Registration successful with SA ID!");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up");
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
          <div className="mb-4 flex gap-2">
            <Button
              type="button"
              variant={loginMethod === 'email' ? "default" : "outline"}
              className="w-1/2"
              onClick={() => setLoginMethod('email')}
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
            <Button
              type="button"
              variant={loginMethod === 'saId' ? "default" : "outline"}
              className="w-1/2"
              onClick={() => setLoginMethod('saId')}
            >
              <Mail className="w-4 h-4 mr-2" />
              SA ID
            </Button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginMethod === 'email' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full focus:ring-primary"
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
                          <p>Password must be at least 6 characters</p>
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
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="saId">SA ID Number</Label>
                <Input
                  id="saId"
                  type="text"
                  placeholder="Enter your 13-digit SA ID"
                  value={saId}
                  onChange={(e) => setSaId(e.target.value)}
                  className="w-full focus:ring-primary"
                  maxLength={13}
                />
              </div>
            )}
            <div className="space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 transition-colors duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Login"}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                className="w-full"
                onClick={handleSignUp}
                disabled={isLoading}
              >
                Sign Up
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-4">
          <div className="text-center w-full">
            <button
              type="button"
              onClick={onRequestDemo}
              className="text-primary hover:text-primary/80 text-sm font-medium transition-colors inline-flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Request a Demo
            </button>
          </div>
        </CardFooter>
      </Card>
      <div className="mt-4">
        <span className="text-xs text-gray-500">
          Version 1.91
        </span>
      </div>
    </div>
  );
};

export default LoginForm;
