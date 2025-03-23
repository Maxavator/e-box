
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { UserFormData, Organization } from "./types";

interface UserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  formData: UserFormData;
  organizations: Organization[] | null | undefined;
  onSubmit: (e: React.FormEvent) => void;
  onFormChange: (field: keyof UserFormData, value: string) => void;
  isEdit?: boolean;
  isSubmitting?: boolean;
  isOrgAdmin?: boolean;
}

export const UserDialog = ({
  isOpen,
  onOpenChange,
  title,
  formData,
  organizations,
  onSubmit,
  onFormChange,
  isEdit = false,
  isSubmitting = false,
  isOrgAdmin = false,
}: UserDialogProps) => {
  // Find current organization name for org admins
  const currentOrgName = isOrgAdmin && organizations 
    ? organizations.find(org => org.id === formData.organizationId)?.name 
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          {!isEdit && (
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => onFormChange('email', e.target.value)}
                placeholder="user@example.com"
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => onFormChange('firstName', e.target.value)}
              placeholder="John"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => onFormChange('lastName', e.target.value)}
              placeholder="Doe"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => onFormChange('role', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="org_admin">Organization Admin</SelectItem>
                {!isOrgAdmin && (
                  <SelectItem value="global_admin">Global Admin</SelectItem>
                )}
              </SelectContent>
            </Select>
            {isOrgAdmin && formData.role === "global_admin" && (
              <p className="text-xs text-amber-600 mt-1">
                Note: As an organization admin, you cannot create global admins. 
                The user will be assigned the organization admin role.
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            {isOrgAdmin ? (
              <div className="border rounded-md px-3 py-2 bg-muted text-muted-foreground">
                {currentOrgName || "Your organization"}
                <p className="text-xs mt-1">
                  As an organization admin, you can only manage users in your organization.
                </p>
              </div>
            ) : (
              <Select
                value={formData.organizationId}
                onValueChange={(value) => onFormChange('organizationId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  {organizations?.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⚪</span>
                {isEdit ? "Updating..." : "Creating..."}
              </span>
            ) : (
              isEdit ? "Update User" : "Add User"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
