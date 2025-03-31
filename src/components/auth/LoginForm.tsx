
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LoginFormFields } from "./LoginFormFields";
import { useAuthActions } from "@/hooks/useAuthActions";
import { AlertCircle, Loader2, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { APP_VERSION } from "@/utils/version";

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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
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
              </TooltipTrigger>
              <TooltipContent className="bg-blue-50 border-blue-200">
                <div className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-blue-500" />
                  <span className="font-medium text-blue-700">Secure Authentication</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  This system uses secure authentication to protect your data.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Version information */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              e-Box Enterprise Platform {APP_VERSION}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              © 2025 Afrovation (Pty) Ltd. All rights reserved.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
