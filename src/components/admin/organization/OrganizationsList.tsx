
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Building2 } from "lucide-react";
import { OrganizationTable } from "./OrganizationTable";
import { toast } from "sonner";
import { useState } from "react";
import { OrganizationForm } from "./OrganizationForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Organization {
  id: string;
  name: string;
  domain: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
  _count?: {
    profiles: number;
  };
}

export const OrganizationsList = () => {
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: organizations, isLoading, error, refetch } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      // Fetch organizations with member count
      const { data, error: orgsError } = await supabase
        .from('organizations')
        .select(`
          id,
          name,
          domain,
          logo_url,
          created_at,
          updated_at,
          profiles:profiles(count)
        `)
        .order('name');

      if (orgsError) {
        console.error('Error fetching organizations:', orgsError);
        toast.error('Failed to fetch organizations');
        throw orgsError;
      }

      return data.map(org => ({
        ...org,
        _count: {
          profiles: org.profiles?.[0]?.count || 0
        }
      })) as Organization[];
    },
    retry: 1,
    refetchOnWindowFocus: false
  });

  const handleEdit = (org: Organization) => {
    setEditingOrg(org);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    toast.error("Delete functionality not implemented");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrg) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const domain = formData.get('domain') as string;

    try {
      const { error } = await supabase
        .from('organizations')
        .update({ 
          name,
          domain: domain || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingOrg.id);

      if (error) throw error;

      toast.success('Organization updated successfully');
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error updating organization:', error);
      toast.error('Failed to update organization');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingOrg) return;
    
    setEditingOrg(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [e.target.name]: e.target.value
      };
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Organizations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="space-y-4">
              <div className="text-destructive">
                Failed to load organizations. Please try again later.
              </div>
              <button 
                onClick={() => refetch()}
                className="text-sm text-primary hover:underline"
              >
                Retry
              </button>
            </div>
          ) : (
            <OrganizationTable 
              organizations={organizations || []} 
              isLoading={isLoading} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Organization</DialogTitle>
          </DialogHeader>
          {editingOrg && (
            <OrganizationForm
              formData={{
                name: editingOrg.name,
                domain: editingOrg.domain || ''
              }}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              mode="edit"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
