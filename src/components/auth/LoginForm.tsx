
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

    const isGlobalAdmin = username.startsWith("admin");
    const isOrgAdmin = username.startsWith("org");
    
    if (isGlobalAdmin) {
      navigate("/admin");
    } else if (isOrgAdmin) {
      navigate("/organization");
    } else {
      navigate("/chat");
    }
  };

  return (
    <div className="w-full md:w-1/2 p-8 md:p-16 flex items-center justify-center bg-gradient-to-br from-white/90 to-white/50 backdrop-blur-sm">
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
              <Label htmlFor="username">Username</Label>
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
              <Label htmlFor="password">Password</Label>
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
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={onRequestDemo}
                className="text-primary hover:text-primary/80 text-sm font-medium transition-colors inline-flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Request a Demo
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
