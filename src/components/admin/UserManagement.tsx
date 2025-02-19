
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { UserTable } from "./UserTable";
import { UserDialog } from "./UserDialog";
import { useUserManagement } from "./useUserManagement";
import type { UserWithRole } from "./types";

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
    updateUserMutation,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      updateUserMutation.mutate({ userId: selectedUser.id, data: formData });
    }
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
            <p className="text-sm text-muted-foreground">Managing all users across organizations</p>
          )}
        </div>
        <Button onClick={() => setIsAddUserOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <UserDialog
        isOpen={isAddUserOpen}
        onOpenChange={setIsAddUserOpen}
        title="Add New User"
        formData={formData}
        organizations={organizations}
        onSubmit={handleSubmit}
        onFormChange={handleFormChange}
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
      />

      <UserTable
        users={users}
        isLoading={isLoading}
        onEditUser={handleEditUser}
      />
    </div>
  );
};
