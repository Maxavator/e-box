
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, KeyRound, Shield } from "lucide-react";
import type { UserWithRole } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

interface UserTableProps {
  users: UserWithRole[] | undefined;
  isLoading: boolean;
  onEditUser: (user: UserWithRole) => void;
  isAdmin: boolean;
  showingGolderUsers?: boolean;
}

export const UserTable = ({ users, isLoading, onEditUser, isAdmin, showingGolderUsers = false }: UserTableProps) => {
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

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
            const userRole = user.user_roles?.[0]?.role || 'user';
            const isOrgAdmin = userRole === 'org_admin';
            const isGlobalAdmin = userRole === 'global_admin';
            const isThabo = user.first_name === 'Thabo' && user.last_name === 'Nkosi';
            const isGolderUser = user.organizations?.[0]?.name?.toLowerCase().includes('golder');
            
            return (
              <TableRow 
                key={user.id} 
                className={isThabo 
                  ? "bg-green-50 dark:bg-green-900/10" 
                  : isGolderUser && showingGolderUsers 
                    ? "bg-amber-50 dark:bg-amber-900/10" 
                    : ""}
              >
                <TableCell>
                  {user.first_name} {user.last_name}
                  {isThabo && <span className="ml-2 text-green-600 dark:text-green-400 text-xs">(Target User)</span>}
                </TableCell>
                <TableCell>User #{user.id.substring(0, 8)}</TableCell>
                <TableCell>
                  {userRole || 'N/A'}
                </TableCell>
                <TableCell>
                  {user.organizations?.[0]?.name || 'N/A'}
                  {isGolderUser && showingGolderUsers && 
                    <span className="ml-2 text-amber-600 dark:text-amber-400 text-xs">(Golder)</span>
                  }
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {isAdmin && (
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
                      {!isGlobalAdmin && !isOrgAdmin && (
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
