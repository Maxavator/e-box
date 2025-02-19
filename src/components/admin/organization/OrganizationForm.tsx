
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Organization } from "../types";

interface OrganizationFormProps {
  formData: {
    name: string;
    domain: string;
    logo_url?: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  mode: "add" | "edit";
  isLoading?: boolean;
}

export const OrganizationForm = ({ 
  formData, 
  handleInputChange, 
  handleSubmit, 
  mode,
  isLoading 
}: OrganizationFormProps) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="required">Organization Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Acme Inc."
          required
          minLength={2}
          maxLength={100}
          className="focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-muted-foreground">
          Enter a unique name for your organization (2-100 characters)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="domain">Domain</Label>
        <Input
          id="domain"
          name="domain"
          value={formData.domain}
          onChange={handleInputChange}
          placeholder="acme.com"
          type="text"
          pattern="^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$"
          title="Please enter a valid domain name (e.g., example.com)"
          className="focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-muted-foreground">
          The primary domain associated with your organization
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="logo_url">Logo URL</Label>
        <Input
          id="logo_url"
          name="logo_url"
          value={formData.logo_url || ''}
          onChange={handleInputChange}
          placeholder="https://example.com/logo.png"
          type="url"
          className="focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-muted-foreground">
          URL to your organization's logo (optional)
        </p>
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">⚪</span>
            {mode === "add" ? "Creating..." : "Updating..."}
          </span>
        ) : (
          mode === "add" ? "Add Organization" : "Update Organization"
        )}
      </Button>
    </form>
  );
};
