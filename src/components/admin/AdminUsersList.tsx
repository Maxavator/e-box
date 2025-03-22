
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Shield, UserPlus, Building2, KeyRound } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface AdminUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  organization_name: string | null;
  created_at: string;
}

export const AdminUsersList = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const { data: adminUsers, isLoading: isLoadingAdmins, error, refetch } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      setIsLoading(true);
      
      try {
        // Get all users with admin roles (global_admin or org_admin)
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select(`
            user_id,
            role
          `)
          .in('role', ['global_admin', 'org_admin']);
        
        if (roleError) throw roleError;
        
        if (!roleData.length) return [];
        
        // Get profiles for all admin users
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select(`
            id,
            first_name,
            last_name,
            organization_id,
            created_at
          `)
          .in('id', roleData.map(r => r.user_id));
        
        if (profilesError) throw profilesError;
        
        // Map roles to profiles
        const usersWithRoles = profilesData.map(profile => {
          const roleInfo = roleData.find(r => r.user_id === profile.id);
          return {
            ...profile,
            role: roleInfo?.role || 'unknown'
          };
        });
        
        // Get organization names
        const orgIds = usersWithRoles
          .filter(u => u.organization_id)
          .map(u => u.organization_id);
          
        let orgNames: Record<string, string> = {};
        
        if (orgIds.length > 0) {
          const { data: orgsData, error: orgsError } = await supabase
            .from('organizations')
            .select('id, name')
            .in('id', orgIds);
            
          if (orgsError) throw orgsError;
          
          orgNames = orgsData.reduce((acc, org) => {
            acc[org.id] = org.name;
            return acc;
          }, {} as Record<string, string>);
        }
        
        // Add organization names to user data
        return usersWithRoles.map(user => ({
          ...user,
          organization_name: user.organization_id ? orgNames[user.organization_id] : null
        })) as AdminUser[];
      } catch (error) {
        console.error("Error fetching admin users:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handlePasswordReset = async (userId: string) => {
    try {
      // Get user email
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
      
      if (userError) throw userError;
      
      if (!userData?.user?.email) {
        toast.error("Could not find user email");
        return;
      }
      
      const { error } = await supabase.auth.resetPasswordForEmail(userData.user.email, {
        redirectTo: `${window.location.origin}/admin`,
      });
      
      if (error) throw error;
      
      toast.success("Password reset email sent successfully");
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error(error.message || "Failed to send password reset email");
    }
  };

  if (error) {
    toast.error("Failed to load admin users");
    console.error(error);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-5 w-5 text-primary" />
          Platform Administrators
        </CardTitle>
        <Button variant="outline" onClick={() => refetch()}>
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingAdmins ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Loading administrators...
                </TableCell>
              </TableRow>
            ) : !adminUsers?.length ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No administrators found
                </TableCell>
              </TableRow>
            ) : (
              adminUsers.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>
                    {admin.first_name} {admin.last_name}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{admin.id}</TableCell>
                  <TableCell>
                    <Badge variant={admin.role === 'global_admin' ? 'default' : 'outline'}>
                      {admin.role === 'global_admin' ? 'Global Admin' : 'Org Admin'}
                    </Badge>
                  </TableCell>
                  <TableCell>{admin.organization_name || 'N/A'}</TableCell>
                  <TableCell>{new Date(admin.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePasswordReset(admin.id)}
                    >
                      <KeyRound className="h-4 w-4 mr-2" />
                      Reset Password
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
