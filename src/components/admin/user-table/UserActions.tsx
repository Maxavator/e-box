
import { Button } from "@/components/ui/button";
import { Pencil, KeyRound, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import type { UserWithRole } from "../types";

interface UserActionsProps {
  user: UserWithRole;
  isAdmin: boolean;
  isOrgAdmin: boolean;
  isSameOrganization: (user: UserWithRole) => boolean;
  onEditUser: (user: UserWithRole) => void;
}

export const UserActions = ({ 
  user, 
  isAdmin, 
  isOrgAdmin, 
  isSameOrganization, 
  onEditUser 
}: UserActionsProps) => {
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  
  const userRoleValue = user.user_roles?.[0]?.role || 'user';
  const isGlobalAdmin = userRoleValue === 'global_admin';
  const isOrgAdminRole = userRoleValue === 'org_admin';
  const isModerator = ['hr_moderator', 'comm_moderator', 'stakeholder_moderator'].includes(userRoleValue);
  const isThabo = user.first_name === 'Thabo' && user.last_name === 'Nkosi';
  const canEdit = isAdmin || (isOrgAdmin && isSameOrganization(user));

  const handlePasswordReset = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin`,
      });
      
      if (error) throw error;
      
      toast.success("Password reset email sent successfully");
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error(error.message || "Failed to send password reset email");
    }
  };

  const handleMakeOrgAdmin = async (userId: string) => {
    setUpdatingUser(userId);
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: 'org_admin',
        });

      if (error) throw error;
      
      toast.success("User has been made an Organization Admin");
      // Force a refresh to show the updated role
      window.location.reload();
    } catch (error: any) {
      console.error("Role update error:", error);
      toast.error(error.message || "Failed to update user role");
    } finally {
      setUpdatingUser(null);
    }
  };

  if (!canEdit) return null;

  return (
    <div className="text-right space-x-2">
      <Button variant="ghost" size="sm" onClick={() => onEditUser(user)}>
        <Pencil className="h-4 w-4 mr-2" />
        Edit
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => handlePasswordReset(user.id)}
      >
        <KeyRound className="h-4 w-4 mr-2" />
        Reset Password
      </Button>
      {!isGlobalAdmin && !isOrgAdminRole && !isModerator && isAdmin && (
        <Button 
          variant={isThabo ? "default" : "ghost"}
          size="sm" 
          onClick={() => handleMakeOrgAdmin(user.id)}
          disabled={updatingUser === user.id}
          className={isThabo ? "bg-green-600 hover:bg-green-700" : ""}
        >
          {updatingUser === user.id ? (
            <span className="animate-spin mr-2">⚪</span>
          ) : (
            <Shield className="h-4 w-4 mr-2" />
          )}
          Make Org Admin
        </Button>
      )}
      {!isGlobalAdmin && !isOrgAdminRole && !isModerator && isOrgAdmin && isSameOrganization(user) && (
        <Button 
          variant="ghost"
          size="sm" 
          onClick={() => handleMakeOrgAdmin(user.id)}
          disabled={updatingUser === user.id}
        >
          {updatingUser === user.id ? (
            <span className="animate-spin mr-2">⚪</span>
          ) : (
            <Shield className="h-4 w-4 mr-2" />
          )}
          Make Org Admin
        </Button>
      )}
    </div>
  );
};
