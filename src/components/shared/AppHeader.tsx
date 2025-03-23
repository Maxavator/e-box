
import { AdminMenu } from "@/components/admin/AdminMenu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";

interface AppHeaderProps {
  onLogout: () => void;
  onLogoClick: () => void;
}

export function AppHeader({ onLogout, onLogoClick }: AppHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Don't show admin menu on admin-related pages
  const isAdminPage = location.pathname.includes('/admin') || 
                       location.pathname.includes('/organization');
  
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },
  });

  const { data: userRole } = useQuery({
    queryKey: ['userRole', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session!.user.id)
        .single();
      return roleData?.role;
    },
  });

  const isAdmin = userRole === 'org_admin' || userRole === 'global_admin';

  return (
    <header className="border-b bg-white p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Removed logo from header since it's already in the sidebar */}
      </div>
      <div className="flex items-center gap-4">
        {/* Only show AdminMenu if user is admin and not on an admin page */}
        {isAdmin && !isAdminPage && <AdminMenu />}
      </div>
    </header>
  );
}
