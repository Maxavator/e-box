
import { Button } from "@/components/ui/button";
import { Building2, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface DashboardHeaderProps {
  orgName: string;
  isAdmin: boolean;
  onLogout: () => void;
  onManageOrg: () => void;
}

export const DashboardHeader = ({ 
  orgName, 
  isAdmin, 
  onLogout, 
  onManageOrg 
}: DashboardHeaderProps) => {
  // Get current session
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },
  });

  // Get user profile
  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, job_title')
        .eq('id', session!.user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data;
    },
  });

  // Format the name as "first_name last_name"
  const formattedName = profile ? 
    `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 
    '';

  // Special case for Thabo Nkosi - set job title to "Chief Information Officer"
  let jobTitle = profile?.job_title || '';
  if (profile?.first_name === 'Thabo' && profile?.last_name === 'Nkosi') {
    jobTitle = 'Chief Information Officer';
  }

  // For debugging
  console.log('DashboardHeader - Profile data:', {
    firstName: profile?.first_name,
    lastName: profile?.last_name,
    formattedName,
    jobTitle
  });

  return (
    <header className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <h1 className="heading-responsive font-bold tracking-tight">Organization Dashboard</h1>
        <div className="flex items-center gap-4">
          {orgName && (
            <p className="text-muted-foreground text-responsive">
              {orgName}
              {isAdmin && <span className="ml-2 text-primary">(Admin)</span>}
            </p>
          )}
          <div className="flex items-center gap-4">
            {formattedName && (
              <span className="text-sm text-muted-foreground flex flex-col">
                <span>{formattedName}</span>
                {jobTitle && <span className="text-xs opacity-75">{jobTitle}</span>}
              </span>
            )}
            <Button 
              variant="destructive" 
              onClick={onLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <p className="text-muted-foreground text-responsive">
          Manage your organization's information and policies
        </p>
        {isAdmin && (
          <Button 
            variant="outline"
            onClick={onManageOrg}
            className="flex items-center gap-2 w-full md:w-auto"
          >
            <Building2 className="h-4 w-4" />
            Manage Organization
          </Button>
        )}
      </div>
    </header>
  );
};
