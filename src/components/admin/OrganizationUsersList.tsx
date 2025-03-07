
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<UserWithRoles[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch all users regardless of organization for demo purposes
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select(`
            id,
            first_name,
            last_name
          `);

        if (profilesError) throw profilesError;

        // Then get their roles
        const usersWithRoles = await Promise.all((profiles || []).map(async (profile) => {
          try {
            const { data: userRoles, error: rolesError } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', profile.id);

            if (rolesError) throw rolesError;

            return {
              ...profile,
              user_roles: userRoles || []
            } as UserWithRoles;
          } catch (error) {
            console.error('Error fetching user roles:', error);
            return {
              ...profile,
              user_roles: []
            } as UserWithRoles;
          }
        }));

        setUsers(usersWithRoles);
        setIsLoading(false);
      } catch (err: any) {
        console.error('Error fetching users:', err);
        setError(err?.message || 'An error occurred while fetching users');
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Test Users</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="p-4 text-red-500 bg-red-50 rounded-md">
            Error: {error}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <svg className="animate-spin h-5 w-5 mr-3 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading users...
                    </div>
                  </TableCell>
                </TableRow>
              ) : !users?.length ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    No users found. Make sure Supabase is properly configured.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.first_name || ''} {user.last_name || ''}
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
        )}
      </CardContent>
    </Card>
  );
};
