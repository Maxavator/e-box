
import { Button } from "@/components/ui/button";
import { UserPlus, Users, RefreshCcw, Search, Building, Filter } from "lucide-react";
import { UserTable } from "./UserTable";
import { UserDialog } from "./UserDialog";
import { useUserManagement } from "./useUserManagement";
import type { UserWithRole } from "./types";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const UserManagement = () => {
  const {
    isAdmin,
    userRole,
    organizations,
    users,
    isLoading,
    isAddUserOpen,
    setIsAddUserOpen,
    isEditUserOpen,
    setIsEditUserOpen,
    selectedUser,
    setSelectedUser,
    formData,
    setFormData,
    handleSubmit,
    createUserMutation,
    updateUserMutation,
    refreshUsersList,
    userProfile,
  } = useUserManagement();

  const [searchQuery, setSearchQuery] = useState("");
  const [organizationFilter, setOrganizationFilter] = useState<string>("all");

  const handleEditUser = (user: UserWithRole) => {
    setSelectedUser(user);
    setFormData({
      email: user.id,
      firstName: user.first_name || "",
      lastName: user.last_name || "",
      role: user.user_roles[0]?.role || "staff",
      organizationId: user.organization_id || "",
    });
    setIsEditUserOpen(true);
  };

  const handleFormChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // First filter by organization if filter is set
  const orgFilteredUsers = users ? 
    (organizationFilter === "all" ? 
      users : 
      users.filter(user => user.organization_id === organizationFilter)
    ) : 
    [];

  // Then filter by search query if present
  const filteredUsers = searchQuery ? 
    orgFilteredUsers.filter(user => 
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.organizations[0]?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
    ) : 
    orgFilteredUsers;

  // Get a list of organization IDs that have Golder in their name
  const golderOrgIds = organizations
    ?.filter(org => org.name.toLowerCase().includes('golder'))
    .map(org => org.id) || [];

  // Count how many users are from Golder organizations
  const golderUsersCount = users?.filter(user => 
    user.organization_id && golderOrgIds.includes(user.organization_id)
  ).length || 0;

  if (!isAdmin && userRole !== 'org_admin') {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">You don't have permission to view user management.</p>
      </div>
    );
  }

  const isOrgAdmin = !isAdmin && userRole === 'org_admin';
  const orgName = userProfile?.organization_id 
    ? organizations?.find(org => org.id === userProfile.organization_id)?.name 
    : '';

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">User Management</h2>
          {isOrgAdmin && (
            <p className="text-sm text-muted-foreground">
              Managing users for {orgName || 'your organization'}
            </p>
          )}
          {isAdmin && (
            <p className="text-sm text-muted-foreground">
              Managing all users across organizations
              {golderUsersCount > 0 && (
                <span className="ml-1">
                  (including {golderUsersCount} Golder {golderUsersCount === 1 ? 'user' : 'users'})
                </span>
              )}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshUsersList} title="Refresh user list">
            <RefreshCcw className="w-4 h-4" />
          </Button>
          <Button onClick={() => setIsAddUserOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users by name, email or organization..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {isAdmin && organizations && organizations.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={organizationFilter} onValueChange={setOrganizationFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by organization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                    {org.name.toLowerCase().includes('golder') && " (Golder)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <UserDialog
        isOpen={isAddUserOpen}
        onOpenChange={setIsAddUserOpen}
        title="Add New User"
        formData={formData}
        organizations={organizations}
        onSubmit={handleSubmit}
        onFormChange={handleFormChange}
        isSubmitting={createUserMutation.isPending}
        isOrgAdmin={isOrgAdmin}
      />

      <UserDialog
        isOpen={isEditUserOpen}
        onOpenChange={setIsEditUserOpen}
        title="Edit User"
        formData={formData}
        organizations={organizations}
        onSubmit={handleSubmit}
        onFormChange={handleFormChange}
        isEdit
        isSubmitting={updateUserMutation.isPending}
        isOrgAdmin={isOrgAdmin}
      />

      <UserTable
        users={filteredUsers}
        isLoading={isLoading}
        onEditUser={handleEditUser}
        isAdmin={!!isAdmin}
        userRole={userRole}
        showingGolderUsers={organizationFilter === "all" ? false : golderOrgIds.includes(organizationFilter)}
        userOrganizationId={userProfile?.organization_id}
      />
      
      <div className="text-sm text-muted-foreground mt-2">
        {filteredUsers.length > 0 ? (
          <p>Showing {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} 
            {organizationFilter !== "all" && organizations && (
              <span> from {organizations.find(org => org.id === organizationFilter)?.name || 'selected organization'}</span>
            )}
          </p>
        ) : (
          <p>No users found with the current filters.</p>
        )}
      </div>
    </div>
  );
};
