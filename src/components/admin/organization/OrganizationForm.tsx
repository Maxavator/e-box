
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Organization } from "../types";

interface OrganizationFormProps {
  formData: {
    name: string;
    domain: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  mode: "add" | "edit";
}

export const OrganizationForm = ({ formData, handleInputChange, handleSubmit, mode }: OrganizationFormProps) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Organization Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Acme Inc."
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="domain">Domain</Label>
        <Input
          id="domain"
          name="domain"
          value={formData.domain}
          onChange={handleInputChange}
          placeholder="acme.com"
        />
      </div>
      <Button type="submit" className="w-full">
        {mode === "add" ? "Add Organization" : "Update Organization"}
      </Button>
    </form>
  );
};
