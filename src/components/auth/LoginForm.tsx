
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Mail, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { LoginFormFields } from "./LoginFormFields";
import { Alert, AlertDescription } from "@/components/ui/alert";

const LoginForm = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    isConnectionChecking,
    connectionError,
    handleLogin,
  } = useAuth();
  
  const [demoDialogOpen, setDemoDialogOpen] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleLogin();
  };

  const buttonText = isConnectionChecking 
    ? "Checking connection..." 
    : isLoading 
      ? "Signing in..." 
      : "Sign in";

  const isButtonDisabled = isLoading || isConnectionChecking;

  return (
    <Card className="w-full mt-6 border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">Sign in</CardTitle>
        <CardDescription>
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {connectionError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Database connection error: {connectionError}
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={onSubmit} className="space-y-4">
          <LoginFormFields
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
          />
          <div className="space-y-4">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isButtonDisabled}
            >
              {buttonText}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
