
import { useState } from "react";
import { AuthenticationDialog } from "@/components/auth/AuthenticationDialog";
import { useSession } from "@supabase/auth-helpers-react";

export function useAuthDialog() {
  const session = useSession();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [onSuccessCallback, setOnSuccessCallback] = useState<(() => void) | undefined>(undefined);
  
  const checkAuth = (callback?: () => void): boolean => {
    if (!session) {
      setIsAuthDialogOpen(true);
      if (callback) {
        setOnSuccessCallback(() => callback);
      }
      return false;
    }
    
    if (callback) {
      callback();
    }
    return true;
  };
  
  const closeAuthDialog = () => {
    setIsAuthDialogOpen(false);
    setOnSuccessCallback(undefined);
  };
  
  const AuthDialog = () => (
    <AuthenticationDialog 
      isOpen={isAuthDialogOpen} 
      onClose={closeAuthDialog}
      onSuccess={onSuccessCallback}
    />
  );
  
  return {
    checkAuth,
    closeAuthDialog,
    isAuthenticated: !!session,
    AuthDialog
  };
}
