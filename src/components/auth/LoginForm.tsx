
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { LoginFormFields } from "./LoginFormFields";

interface LoginFormProps {
  onRequestDemo: () => void;
}

const LoginForm = ({ onRequestDemo }: LoginFormProps) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleLogin,
  } = useAuth();

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
            <LoginFormFields
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
            />
            <div className="space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 transition-colors duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Login"}
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
