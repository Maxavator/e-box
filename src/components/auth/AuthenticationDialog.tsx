
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
import { LogIn, Loader2, LockIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { validateSaId, formatSaIdToEmail, formatSaIdPassword } from "@/utils/saIdValidation";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate SA ID
    const validation = validateSaId(saId);
    if (!validation.isValid) {
      toast.error(validation.message || "Invalid SA ID");
      return;
    }
    
    // Make sure password is provided
    if (!password) {
      toast.error("Password is required");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Transform SA ID to email format
      const loginEmail = formatSaIdToEmail(saId);
      
      // Use user-provided password instead of standard password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: password,
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
      
      // Invalidate all queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['sidebarProfile'] });
      
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
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input 
                id="password"
                type="password"
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <LockIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
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
