
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, KeyRound, Shield } from "lucide-react";
import type { UserWithRole } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface UserTableProps {
  users: UserWithRole[] | undefined;
  isLoading: boolean;
  onEditUser: (user: UserWithRole) => void;
  isAdmin: boolean;
  userRole?: string;
  showingGolderUsers?: boolean;
  userOrganizationId?: string;
}

export const UserTable = ({ 
  users, 
  isLoading, 
  onEditUser, 
  isAdmin, 
  userRole, 
  showingGolderUsers = false,
  userOrganizationId,
}: UserTableProps) => {
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  const isOrgAdmin = !isAdmin && userRole === 'org_admin';

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

  const getRoleDisplayName = (role: string) => {
    switch(role) {
      case 'global_admin': return 'Global Admin';
      case 'org_admin': return 'Organization Admin';
      case 'staff': return 'Staff';
      case 'hr_moderator': return 'HR Moderator';
      case 'comm_moderator': return 'Communication Moderator';
      case 'stakeholder_moderator': return 'Stakeholder Moderator';
      default: return role || 'User';
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    if (['global_admin', 'org_admin'].includes(role)) {
      return 'bg-green-600 text-white';
    } else if (['hr_moderator', 'comm_moderator', 'stakeholder_moderator'].includes(role)) {
      return 'bg-blue-600 text-white';
    }
    return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  // Check if a user belongs to the org admin's organization
  const isSameOrganization = (user: UserWithRole) => {
    return userOrganizationId && user.organization_id === userOrganizationId;
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Username/ID</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">Loading users...</TableCell>
            </TableRow>
          ) : !users?.length ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                {showingGolderUsers 
                  ? "No Golder (Pty) Ltd. users found" 
                  : "No users found"}
              </TableCell>
            </TableRow>
          ) : users?.map((user) => {
            const userRoleValue = user.user_roles?.[0]?.role || 'user';
            const isGlobalAdmin = userRoleValue === 'global_admin';
            const isOrgAdminRole = userRoleValue === 'org_admin';
            const isModerator = ['hr_moderator', 'comm_moderator', 'stakeholder_moderator'].includes(userRoleValue);
            const isThabo = user.first_name === 'Thabo' && user.last_name === 'Nkosi';
            const isGolderUser = user.organizations?.[0]?.name?.toLowerCase().includes('golder');
            
            // For organizational admins, highlight users in their organization
            const isUserInMyOrg = isOrgAdmin && isSameOrganization(user);
            
            return (
              <TableRow 
                key={user.id} 
                className={isThabo 
                  ? "bg-green-50 dark:bg-green-900/10" 
                  : isGolderUser && showingGolderUsers 
                    ? "bg-amber-50 dark:bg-amber-900/10" 
                    : isUserInMyOrg
                      ? "bg-blue-50 dark:bg-blue-900/10"
                      : ""}
              >
                <TableCell>
                  {user.first_name} {user.last_name}
                  {isThabo && <span className="ml-2 text-green-600 dark:text-green-400 text-xs">(Target User)</span>}
                  {isUserInMyOrg && <span className="ml-2 text-blue-600 dark:text-blue-400 text-xs">(Your Organization)</span>}
                </TableCell>
                <TableCell>User #{user.id.substring(0, 8)}</TableCell>
                <TableCell>
                  <Badge className={`text-xs font-normal ${getRoleBadgeStyle(userRoleValue)}`}>
                    {getRoleDisplayName(userRoleValue)}
                  </Badge>
                  {isModerator && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      {userRoleValue === 'hr_moderator' && 'Manages HR, leave requests, vacancies'}
                      {userRoleValue === 'comm_moderator' && 'Manages internal & external communications'}
                      {userRoleValue === 'stakeholder_moderator' && 'Manages stakeholder communications'}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {user.organizations?.[0]?.name || 'N/A'}
                  {isGolderUser && showingGolderUsers && 
                    <span className="ml-2 text-amber-600 dark:text-amber-400 text-xs">(Golder)</span>
                  }
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {(isAdmin || (isOrgAdmin && isSameOrganization(user))) && (
                    <>
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
                    </>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
