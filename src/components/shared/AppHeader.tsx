
import { AdminMenu } from "@/components/admin/AdminMenu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AppHeaderProps {
  onLogout: () => void;
  onLogoClick: () => void;
}

export function AppHeader({ onLogout, onLogoClick }: AppHeaderProps) {
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
        <button 
          onClick={onLogoClick}
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <img 
            src="/lovable-uploads/81af9ad8-b07d-41cb-b800-92cebc70e699.png" 
            alt="e-Box by Afrovation" 
            className="h-8"
          />
        </button>
      </div>
      <div className="flex items-center gap-4">
        {isAdmin && <AdminMenu />}
      </div>
    </header>
  );
}
