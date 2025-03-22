
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LoginFormFields } from "./LoginFormFields";
import { useAuthActions } from "@/hooks/useAuthActions";
import { AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatSaIdPassword } from "@/utils/saIdValidation";

const LoginForm = () => {
  const [saId, setSaId] = useState("");
  const [password, setPassword] = useState("StaffPass123!"); // Default password is always set here, but not used
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const authActions = useAuthActions({
    email: saId, // This will be treated as saId in useAuthActions
    password, // This password is actually ignored in useAuthActions
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

  const fillTestAccount = (saId: string) => {
    setSaId(saId);
    setPassword("StaffPass123!"); // Set to standard password for consistency
  };

  return (
    <Card className="mt-6 w-full">
      <CardHeader>
        <CardTitle className="text-lg">Sign in with your SA ID number</CardTitle>
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
              onClick={() => fillTestAccount("8801015800082")}
            >
              Org Admin: Thabo Nkosi (8801015800082)
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="justify-start text-xs"
              onClick={() => fillTestAccount("9001075800087")}
            >
              Staff: Bongani Khumalo (9001075800087)
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="justify-start text-xs"
              onClick={() => fillTestAccount("8606120800186")}
            >
              Staff: Zanele Ndlovu (8606120800186)
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
