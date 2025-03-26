
import { useState } from "react";
import { AuthenticationDialog } from "@/components/auth/AuthenticationDialog";
import { useSession } from "@supabase/auth-helpers-react";

export function useAuthDialog() {
  const session = useSession();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [onSuccessCallback, setOnSuccessCallback] = useState<(() => void) | undefined>(undefined);
  const [customTitle, setCustomTitle] = useState<string | undefined>(undefined);
  const [customDescription, setCustomDescription] = useState<string | undefined>(undefined);
  
  const checkAuth = (callback?: () => void, title?: string, description?: string): boolean => {
    if (!session) {
      setIsAuthDialogOpen(true);
      if (callback) {
        setOnSuccessCallback(() => callback);
      }
      if (title) {
        setCustomTitle(title);
      }
      if (description) {
        setCustomDescription(description);
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
    setCustomTitle(undefined);
    setCustomDescription(undefined);
  };
  
  const openAuthDialog = (callback?: () => void, title?: string, description?: string) => {
    setIsAuthDialogOpen(true);
    if (callback) {
      setOnSuccessCallback(() => callback);
    }
    if (title) {
      setCustomTitle(title);
    }
    if (description) {
      setCustomDescription(description);
    }
  };
  
  const AuthDialog = () => (
    <AuthenticationDialog 
      isOpen={isAuthDialogOpen} 
      onClose={closeAuthDialog}
      onSuccess={onSuccessCallback}
      title={customTitle}
      description={customDescription}
    />
  );
  
  return {
    checkAuth,
    closeAuthDialog,
    openAuthDialog,
    isAuthenticated: !!session,
    AuthDialog
  };
}
