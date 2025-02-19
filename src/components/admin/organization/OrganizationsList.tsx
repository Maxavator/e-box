
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
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setShowAuthDialog(true);
          return;
        }

        const { data: isGlobalAdmin, error } = await supabase.rpc('is_global_admin');
        
        if (error) {
          console.error('Error checking admin status:', error);
          toast.error("Failed to verify admin status");
          return;
        }

        setIsAdmin(isGlobalAdmin);
      } catch (error) {
        console.error('Error in checkAdminStatus:', error);
        toast.error("Failed to verify authentication status");
      }
    };

    checkAdminStatus();
  }, []);

  const { data: organizations, isLoading } = useQuery({
    queryKey: ['organizations', isAdmin],
    queryFn: async () => {
      try {
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
      } catch (error) {
        console.error('Error in queryFn:', error);
        throw error;
      }
    },
    enabled: isAdmin !== null,
  });

  const handleLogin = () => {
    navigate("/auth");
  };

  if (isAdmin === null) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Verifying access...</p>
        </CardContent>
      </Card>
    );
  }

  if (isAdmin === false) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">You don't have permission to view organizations.</p>
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
