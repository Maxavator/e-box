
import { Button } from "@/components/ui/button";
import { UserPlus, Users, RefreshCcw } from "lucide-react";
import { UserTable } from "./UserTable";
import { UserDialog } from "./UserDialog";
import { useUserManagement } from "./useUserManagement";
import type { UserWithRole } from "./types";
import { Badge } from "@/components/ui/badge";

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
    showingGolderUsers,
    toggleGolderUsers,
    golderOrgId,
  } = useUserManagement();

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

  if (!isAdmin && userRole !== 'org_admin') {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">You don't have permission to view user management.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">User Management</h2>
          {userRole === 'org_admin' && (
            <p className="text-sm text-muted-foreground">Managing users for your organization</p>
          )}
          {isAdmin && (
            <p className="text-sm text-muted-foreground">
              {showingGolderUsers 
                ? "Showing all Golder (Pty) Ltd. users only" 
                : "Managing all users across organizations"}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {isAdmin && golderOrgId && (
            <Button 
              variant={showingGolderUsers ? "default" : "outline"} 
              onClick={toggleGolderUsers}
              className={showingGolderUsers ? "bg-amber-600 hover:bg-amber-700" : ""}
            >
              <Users className="w-4 h-4 mr-2" />
              {showingGolderUsers ? "Show All Organizations" : "Show Golder Users"}
              {showingGolderUsers && (
                <Badge variant="outline" className="ml-2 bg-white text-amber-600">
                  Filtered
                </Badge>
              )}
            </Button>
          )}
          <Button variant="outline" onClick={refreshUsersList} title="Refresh user list">
            <RefreshCcw className="w-4 h-4" />
          </Button>
          <Button onClick={() => setIsAddUserOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
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
      />

      <UserTable
        users={users}
        isLoading={isLoading}
        onEditUser={handleEditUser}
        isAdmin={!!isAdmin}
        showingGolderUsers={showingGolderUsers}
      />
    </div>
  );
};
