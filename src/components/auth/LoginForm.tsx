
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Mail, AlertCircle, Info } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { LoginFormFields } from "./LoginFormFields";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TEST_ACCOUNTS } from "@/constants/auth";

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
  
  const [userStatus, setUserStatus] = useState("");
  const [isActivating, setIsActivating] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleLogin();
  };

  const checkUserStatus = async () => {
    try {
      if (!email) {
        toast.error("Please enter an email or SA ID");
        return;
      }
      
      setUserStatus("Checking user status...");
      setIsActivating(true);
      
      // Transform SA ID to email format if needed (same logic as in useAuthActions)
      const loginEmail = email.includes('@') ? email : `${email}@said.auth`;
      
      try {
        // Instead of using admin API, we'll try to send a password reset email
        // which will work even if the email isn't confirmed and tells us if the user exists
        const { error } = await supabase.auth.resetPasswordForEmail(loginEmail, {
          redirectTo: `${window.location.origin}/auth`,
        });
        
        if (error) {
          // If the error indicates the user doesn't exist
          if (error.message.includes("user not found") || error.message.includes("Invalid email")) {
            setUserStatus("No user found with this email/ID");
          } else {
            console.error("Error checking user status:", error);
            setUserStatus("Error: " + error.message);
          }
          setIsActivating(false);
          return;
        }
        
        // If no error, the user exists and the password reset email was sent
        setUserStatus("User found! A password reset email has been sent. Please check your inbox to reset your password and activate your account.");
        toast.success("Password reset email sent successfully");
        
      } catch (error: any) {
        console.error("Error checking user:", error);
        setUserStatus("Error: " + (error.message || "Unknown error"));
      } finally {
        setIsActivating(false);
      }
    } catch (error: any) {
      console.error("Error in check user status:", error);
      setUserStatus("Error: " + (error.message || "Unknown error"));
      setIsActivating(false);
    }
  };

  const buttonText = isConnectionChecking 
    ? "Checking connection..." 
    : isLoading 
      ? "Signing in..." 
      : "Sign in";

  const isButtonDisabled = isLoading || isConnectionChecking;

  const fillTestCredentials = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      setEmail(TEST_ACCOUNTS.GLOBAL_ADMIN);
      setPassword("password123");
    } else {
      setEmail(TEST_ACCOUNTS.REGULAR);
      setPassword("password123");
    }
  };

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
        
        {userStatus && (
          <Alert variant={userStatus.includes("Error") ? "destructive" : userStatus.includes("Password reset") ? "default" : "default"} 
                className="mb-4 bg-muted">
            <Info className="h-4 w-4" />
            <AlertDescription>
              {userStatus}
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
          <div className="space-y-2">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isButtonDisabled}
            >
              {buttonText}
            </Button>
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button 
                type="button" 
                variant="outline"
                className="w-full"
                onClick={() => fillTestCredentials('admin')}
              >
                Use Admin Account
              </Button>
              
              <Button 
                type="button" 
                variant="outline"
                className="w-full"
                onClick={() => fillTestCredentials('user')}
              >
                Use User Account
              </Button>
            </div>
            
            <Button 
              type="button" 
              variant="outline"
              className="w-full mt-2"
              onClick={checkUserStatus}
              disabled={isButtonDisabled || !email || isActivating}
            >
              {isActivating ? "Checking Account..." : "Check Account / Reset Password"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
