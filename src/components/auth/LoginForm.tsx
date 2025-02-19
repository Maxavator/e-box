
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Invalid Credentials",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }

    // Test credentials validation
    const validCredentials = [
      { id: "6010203040512", password: "Test6010203040512", type: "regular" },
      { id: "5010203040512", password: "Test5010203040512", type: "org_admin" },
      { id: "4010203040512", password: "Test4010203040512", type: "global_admin" }
    ];

    const matchedCredential = validCredentials.find(
      cred => cred.id === username && cred.password === password
    );

    if (!matchedCredential) {
      toast({
        title: "Invalid Credentials",
        description: "Please check your username and password",
        variant: "destructive",
      });
      return;
    }

    switch (matchedCredential.type) {
      case "global_admin":
        navigate("/admin");
        break;
      case "org_admin":
        navigate("/organization");
        break;
      default:
        navigate("/chat");
    }

    toast({
      title: "Login Successful",
      description: `Welcome ${matchedCredential.type.replace('_', ' ')} user!`,
    });
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
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 transition-colors duration-300"
            >
              Login
            </Button>
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
          Version 1.98
        </span>
      </div>
    </div>
  );
};

export default LoginForm;
