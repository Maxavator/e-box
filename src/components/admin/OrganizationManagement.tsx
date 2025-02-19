
import { OrganizationTable } from "./organization/OrganizationTable";
import { OrganizationDialogs } from "./organization/OrganizationDialogs";
import { useOrganizations } from "./organization/useOrganizations";

export const OrganizationManagement = () => {
  const {
    organizations,
    isLoading,
    isAddOrgOpen,
    setIsAddOrgOpen,
    isEditOrgOpen,
    setIsEditOrgOpen,
    formData,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleInputChange,
  } = useOrganizations();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Organization Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage and monitor organizations across the platform
          </p>
        </div>
        <OrganizationDialogs
          isAddOrgOpen={isAddOrgOpen}
          setIsAddOrgOpen={setIsAddOrgOpen}
          isEditOrgOpen={isEditOrgOpen}
          setIsEditOrgOpen={setIsEditOrgOpen}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </div>

      <div className="border rounded-lg">
        <OrganizationTable
          organizations={organizations || []}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};
