
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Mail, AlertCircle, Info } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { LoginFormFields } from "./LoginFormFields";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define interface for user structure
interface SupabaseUser {
  id: string;
  email?: string;
  email_confirmed_at?: string | null;
}

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
      
      // Transform SA ID to email format if needed (same logic as in useAuthActions)
      const loginEmail = email.includes('@') ? email : `${email}@said.auth`;
      
      try {
        // Check if user exists in auth
        const { data, error } = await supabase.auth.admin.listUsers();
        
        if (error) {
          console.error("Error checking user status:", error);
          setUserStatus("Error: " + error.message);
          return;
        }
        
        if (!data || !data.users) {
          setUserStatus("Error: Could not retrieve user list");
          return;
        }
        
        const foundUser = data.users.find(u => {
          // Type-safe check for user object and email property
          if (typeof u === 'object' && u !== null && 'email' in u) {
            return (u as { email: string }).email === loginEmail;
          }
          return false;
        });
        
        if (!foundUser) {
          setUserStatus("No user found with this email/ID");
          return;
        }
        
        // Check if email is confirmed (safely access properties with type assertion)
        if (
          typeof foundUser === 'object' && 
          foundUser !== null && 
          'email_confirmed_at' in foundUser && 
          !foundUser.email_confirmed_at
        ) {
          // Auto-confirm the email
          if ('id' in foundUser) {
            const userId = (foundUser as SupabaseUser).id;
            const { error: updateError } = await supabase.auth.admin.updateUserById(
              userId,
              { email_confirm: true }
            );
            
            if (updateError) {
              console.error("Error confirming email:", updateError);
              setUserStatus("Error confirming email: " + updateError.message);
              return;
            }
            
            setUserStatus("User activated! You can now log in.");
            toast.success("User email confirmed successfully");
          } else {
            setUserStatus("Error: User object is missing ID");
          }
        } else {
          setUserStatus("User is already active");
        }
      } catch (error: any) {
        console.error("Error listing users:", error);
        setUserStatus("Error retrieving users: " + (error.message || "Unknown error"));
      }
    } catch (error: any) {
      console.error("Error in check user status:", error);
      setUserStatus("Error: " + (error.message || "Unknown error"));
    }
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
        
        {userStatus && (
          <Alert variant={userStatus.includes("Error") ? "destructive" : userStatus.includes("activated") ? "default" : "default"} 
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
            
            <Button 
              type="button" 
              variant="outline"
              className="w-full mt-2"
              onClick={checkUserStatus}
              disabled={isButtonDisabled || !email}
            >
              Check/Activate User
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
