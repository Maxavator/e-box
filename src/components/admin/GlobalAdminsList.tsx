
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useUserRole } from "./hooks/useUserRole";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Loader2 } from "lucide-react";

export function GlobalAdminsList() {
  const [globalAdmins, setGlobalAdmins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin, userRole } = useUserRole();
  
  useEffect(() => {
    const fetchGlobalAdmins = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all users with global_admin role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'global_admin');
          
        if (roleError) throw roleError;
        
        if (roleData && roleData.length > 0) {
          const userIds = roleData.map(role => role.user_id);
          
          // Get profile information for these users
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .in('id', userIds);
            
          if (profileError) throw profileError;
          
          setGlobalAdmins(profileData || []);
        } else {
          setGlobalAdmins([]);
        }
      } catch (error) {
        console.error("Error fetching global admins:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Only fetch if the user has admin access
    if (isAdmin || userRole === 'global_admin') {
      fetchGlobalAdmins();
    }
  }, [isAdmin, userRole]);
  
  if (!isAdmin && userRole !== 'global_admin') {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="p-4 text-center">
            <p className="text-red-500">You don't have permission to view global administrators.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center gap-2">
        <Shield className="h-5 w-5 text-green-600" />
        <CardTitle>Global Administrators</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : globalAdmins.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-muted-foreground">No global administrators found.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email/ID</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {globalAdmins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>
                    {admin.first_name} {admin.last_name}
                  </TableCell>
                  <TableCell>
                    {admin.email || `User #${admin.id.substring(0, 8)}`}
                  </TableCell>
                  <TableCell>
                    {admin.organization_id || 'No organization'}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-600">Global Admin</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
