
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Organization } from "../types";

interface OrganizationProfileProps {
  organization: Organization;
}

export const OrganizationProfile = ({ organization }: OrganizationProfileProps) => {
  const [name, setName] = useState(organization.name);
  const [domain, setDomain] = useState(organization.domain || "");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState(organization.logo_url);

  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async () => {
      let logoUrl = organization.logo_url;

      // Upload new logo if provided
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const filePath = `${organization.id}/logo.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('organizations')
          .upload(filePath, logoFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('organizations')
          .getPublicUrl(filePath);

        logoUrl = publicUrl;
      }

      const { error } = await supabase
        .from('organizations')
        .update({
          name,
          domain: domain || null,
          logo_url: logoUrl,
        })
        .eq('id', organization.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization'] });
      toast.success("Organization profile updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update organization: ${error.message}`);
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Organization Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="logo">Logo</Label>
            <div className="flex items-center gap-4">
              {logoPreview && (
                <img 
                  src={logoPreview} 
                  alt="Organization logo" 
                  className="w-16 h-16 rounded object-cover"
                />
              )}
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Domain</Label>
            <Input
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
            />
            <p className="text-sm text-muted-foreground">
              Used for automatic user organization assignment
            </p>
          </div>

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};
