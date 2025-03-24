
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserFormData } from "./types";
import { Organization } from "@/types/supabase-types";

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
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => onFormChange("firstName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => onFormChange("lastName", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onFormChange("email", e.target.value)}
              required
              disabled={isEdit}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => onFormChange("role", value)}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {!isOrgAdmin && (
                  <SelectItem value="global_admin">Global Admin</SelectItem>
                )}
                <SelectItem value="org_admin">Organization Admin</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="user">User</SelectItem>
                
                {/* New moderator roles */}
                <SelectItem value="hr_moderator">HR Moderator</SelectItem>
                <SelectItem value="comm_moderator">Communication Moderator</SelectItem>
                <SelectItem value="stakeholder_moderator">Stakeholder Moderator</SelectItem>
              </SelectContent>
            </Select>
            {formData.role === 'hr_moderator' && (
              <p className="text-xs text-muted-foreground mt-1">
                HR Moderator can manage HR information, leave requests, and issue vacancies.
              </p>
            )}
            {formData.role === 'comm_moderator' && (
              <p className="text-xs text-muted-foreground mt-1">
                Communication Moderator can manage internal, external, and broadcast communications.
              </p>
            )}
            {formData.role === 'stakeholder_moderator' && (
              <p className="text-xs text-muted-foreground mt-1">
                Stakeholder Moderator can manage external communication with shareholders and public announcements.
              </p>
            )}
          </div>

          {!isOrgAdmin && (
            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Select
                value={formData.organizationId}
                onValueChange={(value) => onFormChange("organizationId", value)}
              >
                <SelectTrigger id="organization">
                  <SelectValue placeholder="Select an organization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {organizations?.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
