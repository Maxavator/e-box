
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LoginFormFields } from "./LoginFormFields";
import { useAuthActions } from "@/hooks/useAuthActions";
import { AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const LoginForm = () => {
  const [saId, setSaId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const authActions = useAuthActions({
    email: saId, // This will be treated as saId in useAuthActions
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

  return (
    <Card className="mt-6 w-full shadow-md border-primary/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Welcome back</CardTitle>
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
            saId={saId}
            setSaId={setSaId}
            password={password}
            setPassword={setPassword}
          />
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
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
    </Card>
  );
};

export default LoginForm;
