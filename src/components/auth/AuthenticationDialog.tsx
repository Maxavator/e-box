
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { validateSaId, formatSaIdToEmail, formatSaIdPassword } from "@/utils/saIdValidation";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface AuthenticationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  description?: string;
}

export const AuthenticationDialog = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  title = "Authentication Required",
  description = "Please login to continue accessing this feature."
}: AuthenticationDialogProps) => {
  const [saId, setSaId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate SA ID
    const validation = validateSaId(saId);
    if (!validation.isValid) {
      toast.error(validation.message || "Invalid SA ID");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Transform SA ID to email format
      const loginEmail = formatSaIdToEmail(saId);
      
      // Always use the standard password for SA ID logins
      const loginPassword = formatSaIdPassword(saId);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        console.error('Auth error:', error);
        toast.error(error.message || "Login failed. Please try again.");
        return;
      }

      if (!data.user) {
        toast.error("Login failed. Please try again.");
        return;
      }
      
      toast.success("Authentication successful!");
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const goToLoginPage = () => {
    onClose();
    navigate('/auth');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleLogin} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="saId">SA ID Number</Label>
            <Input 
              id="saId"
              placeholder="Enter your SA ID number" 
              value={saId}
              onChange={(e) => setSaId(e.target.value)}
              required
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          </div>
          
          <div className="text-center text-sm text-muted-foreground pt-2">
            <button 
              type="button"
              onClick={goToLoginPage}
              className="hover:underline focus:outline-none"
            >
              Go to full login page
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
