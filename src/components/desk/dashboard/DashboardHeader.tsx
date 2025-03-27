
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DashboardHeaderProps {
  currentView: string;
  onBackClick: () => void;
  onAdminClick: () => void;
}

export const DashboardHeader = ({ currentView, onBackClick, onAdminClick }: DashboardHeaderProps) => {
  const { userRole } = useUserRole();
  const location = useLocation();
  
  // Get the user's profile info
  const { data: profile } = useQuery({
    queryKey: ['headerProfileData'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, job_title')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile data:', error);
        return null;
      }
      
      return data;
    },
  });
  
  // Format user name
  const userName = profile ? 
    `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User' : 
    'User';
  
  // Don't show admin button on admin-related pages
  const isAdminPage = location.pathname.includes('/admin') || 
                      location.pathname.includes('/organization');

  return (
    <header className="h-16 bg-card border-b px-4 md:px-6 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          <span className="font-medium">{userName}</span>
          {profile?.job_title ? ` • ${profile.job_title}` : " • System Overview"}
        </p>
      </div>
      <div className="flex items-center gap-4">
        {currentView !== 'dashboard' && (
          <button
            onClick={onBackClick}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Back to Dashboard
          </button>
        )}
        {userRole === 'org_admin' && !isAdminPage && (
          <Button
            onClick={onAdminClick}
            className="flex items-center gap-2"
            variant="outline"
          >
            <ShieldCheck className="w-4 h-4" />
            Access Admin Tools
          </Button>
        )}
      </div>
    </header>
  );
};
