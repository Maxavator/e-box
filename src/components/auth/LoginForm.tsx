
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createTestUsers } from "@/utils/test-users";
import { useAuth } from "@/hooks/use-auth";

interface LoginFormProps {
  onRequestDemo: () => void;
}

const LoginForm = ({ onRequestDemo }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saId, setSaId] = useState("");
  const [saIdPassword, setSaIdPassword] = useState("");
  const [isCreatingUsers, setIsCreatingUsers] = useState(false);
  const { isLoading, handleEmailLogin, handleSaIdLogin } = useAuth();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleEmailLogin(email, password);
  };

  const handleSaIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaIdLogin(saId, saIdPassword);
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
          <Tabs defaultValue="email" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="said">SA ID Number</TabsTrigger>
            </TabsList>
            
            <TabsContent value="email">
              <form onSubmit={handleEmailSubmit} className="space-y-4">
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
                  disabled={isLoading}
                >
                  Login with Email
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="said">
              <form onSubmit={handleSaIdSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="saId">SA ID Number</Label>
                  <Input
                    id="saId"
                    type="text"
                    placeholder="Enter your SA ID Number"
                    value={saId}
                    onChange={(e) => setSaId(e.target.value.replace(/\D/g, '').slice(0, 13))}
                    className="w-full focus:ring-primary"
                    maxLength={13}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="saIdPassword">Password</Label>
                  <Input
                    id="saIdPassword"
                    type="password"
                    placeholder="Enter your password"
                    value={saIdPassword}
                    onChange={(e) => setSaIdPassword(e.target.value)}
                    className="w-full focus:ring-primary"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 transition-colors duration-300"
                  disabled={isLoading}
                >
                  Login with SA ID
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-4">
            <Button
              type="button"
              onClick={() => createTestUsers(setIsCreatingUsers)}
              disabled={isCreatingUsers}
              variant="outline"
              className="w-full"
            >
              {isCreatingUsers ? 'Creating Test Users...' : 'Create Test Users'}
            </Button>
          </div>
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
          Version 1.92
        </span>
      </div>
    </div>
  );
};

export default LoginForm;
