
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserTable } from "./UserTable";
import { UserWithRole } from "./types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Users, Loader2 } from "lucide-react";
import { golderUsers } from "@/utils/organization/golderUserDefinitions";
import { createOrganizationUsers } from "@/utils/organization/createOrganizationUsers";

export function GolderUsersManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [golderUsers, setGolderUsers] = useState<UserWithRole[]>([]);
  const [golderOrgId, setGolderOrgId] = useState<string | null>(null);
  const [isCreatingUsers, setIsCreatingUsers] = useState(false);

  // Fetch the Golder organization ID
  useEffect(() => {
    const fetchGolderOrgId = async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('id')
        .ilike('name', '%golder%')
        .single();
      
      if (error) {
        console.error('Error fetching Golder organization:', error);
        return;
      }

      setGolderOrgId(data?.id || null);
    };

    fetchGolderOrgId();
  }, []);

  // Fetch all Golder users
  useEffect(() => {
    if (!golderOrgId) return;

    const fetchGolderUsers = async () => {
      setIsLoading(true);
      try {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .eq('organization_id', golderOrgId);
        
        if (profilesError) throw profilesError;

        // Fetch user roles for these profiles
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('*')
          .in('user_id', profiles.map(p => p.id));
        
        if (rolesError) throw rolesError;

        // Map roles to users
        const usersWithRoles = profiles.map(profile => {
          const roles = userRoles.filter(role => role.user_id === profile.id);
          return {
            ...profile,
            user_roles: roles,
            organizations: [{ name: 'Golder (Pty) Ltd.' }],
            is_active: true
          } as UserWithRole;
        });

        setGolderUsers(usersWithRoles);
      } catch (error) {
        console.error('Error fetching Golder users:', error);
        toast.error('Failed to load Golder users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGolderUsers();
  }, [golderOrgId]);

  const handleCreateGolderUsers = async () => {
    if (!golderOrgId) {
      toast.error('Golder organization ID not found');
      return;
    }

    setIsCreatingUsers(true);
    try {
      const result = await createOrganizationUsers(golderUsers, golderOrgId);
      
      if (result.successCount > 0) {
        toast.success(`Successfully created ${result.successCount} Golder users`);
        // Reload the users list
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .eq('organization_id', golderOrgId);
        
        if (!profilesError && profiles) {
          // Update the UI
          const { data: userRoles } = await supabase
            .from('user_roles')
            .select('*')
            .in('user_id', profiles.map(p => p.id));
          
          const usersWithRoles = profiles.map(profile => {
            const roles = (userRoles || []).filter(role => role.user_id === profile.id);
            return {
              ...profile,
              user_roles: roles,
              organizations: [{ name: 'Golder (Pty) Ltd.' }],
              is_active: true
            } as UserWithRole;
          });

          setGolderUsers(usersWithRoles);
        }
      }
      
      if (result.errorCount > 0) {
        toast.warning(`Failed to create ${result.errorCount} users. See console for details.`);
      }
    } catch (error) {
      console.error('Error creating Golder users:', error);
      toast.error('Failed to create Golder users');
    } finally {
      setIsCreatingUsers(false);
    }
  };

  const handleEditUser = (user: UserWithRole) => {
    // Not implemented for Golder users - they are standard users
    toast.info('Editing users from partner organizations is limited.');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Golder (Pty) Ltd. Users</h2>
          <p className="text-sm text-muted-foreground">
            Manage users from Golder (Pty) Ltd. partner organization
          </p>
        </div>
        
        <Button 
          onClick={handleCreateGolderUsers}
          disabled={isCreatingUsers || !golderOrgId}
          className="bg-amber-600 hover:bg-amber-700"
        >
          {isCreatingUsers ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating Users...
            </>
          ) : (
            <>
              <Users className="h-4 w-4 mr-2" />
              Create Golder Users
            </>
          )}
        </Button>
      </div>

      <UserTable
        users={golderUsers}
        isLoading={isLoading}
        onEditUser={handleEditUser}
        isAdmin={true}
        userRole="global_admin"
        showingGolderUsers={true}
      />
    </div>
  );
}
