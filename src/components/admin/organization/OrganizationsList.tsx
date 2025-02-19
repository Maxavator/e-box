
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Building2 } from "lucide-react";
import { OrganizationTable } from "./OrganizationTable";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Organization } from "../types";

export const OrganizationsList = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setShowAuthDialog(true);
        return;
      }

      // Get user's role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (roleError) {
        console.error('Error fetching user role:', roleError);
        toast.error("Failed to fetch user role");
        return;
      }

      setUserRole(roleData?.role || null);
    };

    fetchUserInfo();
  }, []);

  const { data: organizations, isLoading } = useQuery({
    queryKey: ['organizations', userRole],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setShowAuthDialog(true);
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching organizations:', error);
        toast.error("Failed to fetch organizations");
        throw error;
      }

      return data as Organization[];
    },
    enabled: userRole !== null,
  });

  const handleLogin = () => {
    navigate("/auth");
  };

  if (!userRole) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Loading user role...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
            <DialogDescription>
              Please log in to access the organization list.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleLogin} className="w-full">
              Go to Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Organizations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OrganizationTable 
            organizations={organizations} 
            isLoading={isLoading} 
            onEdit={() => {}} 
            onDelete={() => {}} 
          />
        </CardContent>
      </Card>
    </>
  );
};
