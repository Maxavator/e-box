
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, KeyRound } from "lucide-react";
import type { UserWithRole } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserTableProps {
  users: UserWithRole[] | undefined;
  isLoading: boolean;
  onEditUser: (user: UserWithRole) => void;
  isAdmin: boolean;
}

export const UserTable = ({ users, isLoading, onEditUser, isAdmin }: UserTableProps) => {
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

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
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
              <TableCell colSpan={5} className="text-center">No users found</TableCell>
            </TableRow>
          ) : users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                {user.first_name} {user.last_name}
              </TableCell>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.user_roles?.[0]?.role || 'N/A'}</TableCell>
              <TableCell>{user.organizations?.[0]?.name || 'N/A'}</TableCell>
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
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
