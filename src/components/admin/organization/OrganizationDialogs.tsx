
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { OrganizationForm } from "./OrganizationForm";
import type { OrganizationFormData } from "./useOrganizations";

interface OrganizationDialogsProps {
  isAddOrgOpen: boolean;
  setIsAddOrgOpen: (open: boolean) => void;
  isEditOrgOpen: boolean;
  setIsEditOrgOpen: (open: boolean) => void;
  formData: OrganizationFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export const OrganizationDialogs = ({
  isAddOrgOpen,
  setIsAddOrgOpen,
  isEditOrgOpen,
  setIsEditOrgOpen,
  formData,
  handleInputChange,
  handleSubmit,
  isLoading,
}: OrganizationDialogsProps) => {
  return (
    <>
      <Dialog open={isAddOrgOpen} onOpenChange={setIsAddOrgOpen}>
        <DialogTrigger asChild>
          <Button>
            <Building2 className="w-4 h-4 mr-2" />
            Add Organization
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Organization</DialogTitle>
          </DialogHeader>
          <OrganizationForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            mode="add"
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOrgOpen} onOpenChange={setIsEditOrgOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Organization</DialogTitle>
          </DialogHeader>
          <OrganizationForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            mode="edit"
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
