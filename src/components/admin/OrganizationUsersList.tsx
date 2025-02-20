
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserRole } from "@/types/database";

interface UserWithRoles {
  id: string;
  first_name: string | null;
  last_name: string | null;
  user_roles: {
    role: UserRole['role'];
  }[];
}

export const OrganizationUsersList = () => {
  const { data: organizationData, isLoading: isOrgLoading } = useQuery({
    queryKey: ['organization', 'golder'],
    queryFn: async () => {
      const { data: org, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('name', 'Golder Manufacturing (Pty) Ltd.')
        .single();
      
      if (error) throw error;
      return org;
    },
  });

  const { data: users, isLoading: isUsersLoading } = useQuery<UserWithRoles[]>({
    queryKey: ['organization-users', organizationData?.id],
    queryFn: async () => {
      if (!organizationData?.id) return [];
      
      // First get all profiles for the organization
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name
        `)
        .eq('organization_id', organizationData.id);

      if (profilesError) throw profilesError;

      // Then get their roles
      const usersWithRoles = await Promise.all((profiles || []).map(async (profile) => {
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', profile.id);

        if (rolesError) throw rolesError;

        return {
          ...profile,
          user_roles: userRoles || []
        } as UserWithRoles;
      }));

      return usersWithRoles;
    },
    enabled: !!organizationData?.id,
  });

  if (isOrgLoading || isUsersLoading) {
    return <div className="p-4">Loading users...</div>;
  }

  if (!organizationData) {
    return <div className="p-4">Organization not found</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Golder Manufacturing (Pty) Ltd. Users</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!users?.length ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    {user.user_roles?.[0]?.role || 'No role assigned'}
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
