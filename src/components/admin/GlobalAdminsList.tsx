
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useUserRole } from "./hooks/useUserRole";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Loader2, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface GlobalAdmin {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  organization_id: string | null;
  sa_id: string | null;
}

export function GlobalAdminsList() {
  const [globalAdmins, setGlobalAdmins] = useState<GlobalAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin, userRole } = useUserRole();
  
  useEffect(() => {
    const fetchGlobalAdmins = async () => {
      try {
        setIsLoading(true);
        
        // 1. Fetch hardcoded global admins by SA ID
        const hardcodedAdminIds = ['4010203040512', '7810205441087', '8905115811087'];
        const { data: hardcodedAdminsData, error: hardcodedError } = await supabase
          .from('profiles')
          .select('*')
          .in('sa_id', hardcodedAdminIds);
          
        if (hardcodedError) throw hardcodedError;
        
        // Store the SA IDs we've already found to avoid duplicates
        const foundSaIds = new Set(hardcodedAdminsData?.map(admin => admin.sa_id) || []);
        
        // 2. Fetch users with global_admin role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'global_admin');
          
        if (roleError) throw roleError;
        
        let roleBasedAdmins: GlobalAdmin[] = [];
        
        if (roleData && roleData.length > 0) {
          const userIds = roleData.map(role => role.user_id);
          
          // Get profile information for these users
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .in('id', userIds);
            
          if (profileError) throw profileError;
          
          // Filter out users who are already included via SA ID
          roleBasedAdmins = (profileData || []).filter(admin => 
            !admin.sa_id || !foundSaIds.has(admin.sa_id)
          );
        }
        
        // Combine both sets of admins
        setGlobalAdmins([...(hardcodedAdminsData || []), ...roleBasedAdmins]);
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
                <TableHead>SA ID</TableHead>
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
                    {admin.sa_id ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex items-center">
                              <span className="mr-1">{admin.sa_id}</span>
                              <Info className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Hardcoded global admin</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
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
