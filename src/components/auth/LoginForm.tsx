
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LoginFormFields } from "./LoginFormFields";
import { useAuthActions } from "@/hooks/useAuthActions";
import { AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const authActions = useAuthActions({
    email,
    password,
    setIsLoading,
    navigate,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await authActions.handleLogin();
    } catch (error: any) {
      setError(error.message || "Login failed. Please try again.");
    }
  };

  const fillTestAccount = (type: "admin" | "user" | "orgAdmin") => {
    if (type === "admin") {
      setEmail("admin@e-box.co.za");
      setPassword("Admin@2025!Security");
    } else if (type === "orgAdmin") {
      setEmail("org-admin@e-box.co.za");
      setPassword("OrgAdmin123!");
    } else {
      setEmail("user@e-box.co.za");
      setPassword("UserPass123!");
    }
  };

  return (
    <Card className="mt-6 w-full">
      <CardHeader>
        <CardTitle className="text-lg">Sign in with your credentials</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <LoginFormFields
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="w-full pt-4 border-t text-sm text-muted-foreground">
          <p className="mb-2 font-medium">Test Accounts (Click to fill):</p>
          <div className="grid grid-cols-1 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="justify-start text-xs"
              onClick={() => fillTestAccount("admin")}
            >
              Global Admin: admin@e-box.co.za / Admin@2025!Security
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="justify-start text-xs"
              onClick={() => fillTestAccount("orgAdmin")}
            >
              Org Admin: org-admin@e-box.co.za / OrgAdmin123!
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="justify-start text-xs"
              onClick={() => fillTestAccount("user")}
            >
              Regular User: user@e-box.co.za / UserPass123!
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
