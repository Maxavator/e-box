
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, KeyRound, Eye, Activity } from "lucide-react";
import type { UserWithRole } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'global_admin':
        return 'default';
      case 'org_admin':
        return 'secondary';
      case 'staff':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getUserActivityLevel = (user: UserWithRole) => {
    // Using the last_activity field from our updated schema
    if (!user.last_activity) return 'Inactive';
    
    const lastActivityDate = new Date(user.last_activity);
    const now = new Date();
    const daysSinceLastActivity = Math.floor((now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastActivity < 1) return 'High';
    if (daysSinceLastActivity < 7) return 'Medium';
    if (daysSinceLastActivity < 30) return 'Low';
    return 'Inactive';
  };
  
  const getActivityBadgeVariant = (activityLevel: string) => {
    switch (activityLevel) {
      case 'High':
        return 'default'; // Changed from 'success' to a valid variant
      case 'Medium':
        return 'secondary'; // Changed from 'warning' to a valid variant
      case 'Low':
        return 'outline'; // Changed from 'secondary' to maintain consistency
      case 'Inactive':
      default:
        return 'destructive';
    }
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email / ID</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>Activity Level</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">Loading users...</TableCell>
            </TableRow>
          ) : !users?.length ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">No users found</TableCell>
            </TableRow>
          ) : users?.map((user) => {
            const activityLevel = getUserActivityLevel(user);
            return (
              <TableRow key={user.id}>
                <TableCell>
                  {user.first_name} {user.last_name}
                </TableCell>
                <TableCell className="font-mono text-xs">{user.id}</TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(user.user_roles?.[0]?.role || 'user')}>
                    {user.user_roles?.[0]?.role || 'user'}
                  </Badge>
                </TableCell>
                <TableCell>{user.organizations?.[0]?.name || 'N/A'}</TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant={getActivityBadgeVariant(activityLevel)} className="flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          {activityLevel}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        {user.last_activity ? 
                          `Last active: ${new Date(user.last_activity).toLocaleString()}` : 
                          'No activity recorded'
                        }
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
                        Reset
                      </Button>
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
