
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Users } from "lucide-react";

interface AfrovationUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  province: string | null;
  organization_id: string | null;
  sa_id: string | null;
  organization_name?: string;
  role?: string;
  email?: string;
}

export const AfrovationUsers = () => {
  const [users, setUsers] = useState<AfrovationUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch all profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select(`
            id,
            first_name,
            last_name,
            province,
            organization_id,
            sa_id
          `);

        if (profilesError) throw profilesError;
        
        console.log(`Found ${profiles?.length || 0} profiles`);

        // Fetch organizations to get names
        const organizationIds = profiles
          ?.filter(profile => profile.organization_id)
          .map(profile => profile.organization_id) || [];
          
        const uniqueOrgIds = [...new Set(organizationIds)];
        
        let organizationsMap: Record<string, string> = {};
        if (uniqueOrgIds.length > 0) {
          const { data: organizations } = await supabase
            .from('organizations')
            .select('id, name')
            .in('id', uniqueOrgIds);
          
          if (organizations) {
            organizationsMap = organizations.reduce((acc, org) => {
              acc[org.id] = org.name;
              return acc;
            }, {} as Record<string, string>);
          }
        }
        
        // Fetch user roles
        const { data: userRoles } = await supabase
          .from('user_roles')
          .select('user_id, role');
          
        const userRolesMap: Record<string, string> = {};
        if (userRoles) {
          userRoles.forEach(ur => {
            userRolesMap[ur.user_id] = ur.role;
          });
        }
        
        // Map organizations and roles to users
        const usersWithDetails = profiles?.map(profile => {
          return {
            ...profile,
            organization_name: profile.organization_id ? organizationsMap[profile.organization_id] : undefined,
            role: userRolesMap[profile.id] || 'user'
          };
        }) || [];

        setUsers(usersWithDetails);
      } catch (err: any) {
        console.error('Error fetching users:', err);
        setError(err?.message || 'An error occurred while fetching users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    if (!searchQuery.trim()) return true;
    
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
    const province = (user.province || '').toLowerCase();
    const orgName = (user.organization_name || '').toLowerCase();
    const role = (user.role || '').toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    
    return fullName.includes(searchLower) || 
           province.includes(searchLower) || 
           orgName.includes(searchLower) ||
           role.includes(searchLower);
  });

  const getRoleBadgeStyle = (role: string) => {
    if (role === 'global_admin') return 'bg-green-600 text-white';
    if (role === 'org_admin') return 'bg-blue-600 text-white';
    if (role.includes('moderator')) return 'bg-purple-600 text-white';
    return 'bg-gray-200 text-gray-800';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Afrovation Users
          </h2>
          <p className="text-sm text-muted-foreground">
            View all registered users in the Afrovation platform
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Total registered users: {users.length}
          </CardDescription>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name, province, organization..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="bg-red-50 text-red-800 p-4 rounded-md">
              <p>Error: {error}</p>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>ID #</TableHead>
                    <TableHead>Province</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex justify-center items-center">
                          <Loader2 className="h-6 w-6 animate-spin mr-2" />
                          <span>Loading users...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        {searchQuery ? "No users match your search query" : "No users found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => {
                      const isThaboNkosi = user.first_name === 'Thabo' && user.last_name === 'Nkosi';
                      
                      return (
                        <TableRow 
                          key={user.id} 
                          className={isThaboNkosi ? "bg-green-50" : ""}
                        >
                          <TableCell className="font-medium">
                            {user.first_name} {user.last_name}
                            {isThaboNkosi && <span className="ml-2 text-green-600 text-xs">(Target User)</span>}
                          </TableCell>
                          <TableCell>{user.sa_id || "N/A"}</TableCell>
                          <TableCell>{user.province || "N/A"}</TableCell>
                          <TableCell>{user.organization_name || "N/A"}</TableCell>
                          <TableCell>
                            <Badge className={getRoleBadgeStyle(user.role || 'user')}>
                              {user.role || "User"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
