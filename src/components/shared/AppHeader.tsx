
import { useEffect, useState } from "react";
import { UserProfile } from "@/components/user/UserProfile";
import { supabase } from "@/integrations/supabase/client";
import { UserInfo } from "@/components/user/UserInfo";
import { AdminMenu } from "@/components/admin/AdminMenu";

interface AppHeaderProps {
  onLogout: () => void;
  onLogoClick: () => void;
}

export function AppHeader({ onLogout, onLogoClick }: AppHeaderProps) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        setIsAdmin(roleData?.role === 'org_admin' || roleData?.role === 'global_admin');
      }
    };

    fetchUserRole();
  }, []);

  return (
    <header className="border-b bg-white p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onLogoClick}
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <img 
            src="/lovable-uploads/81af9ad8-b07d-41cb-b800-92cebc70e699.png" 
            alt="Logo" 
            className="h-8"
          />
        </button>
        <UserInfo />
      </div>
      <div className="flex items-center gap-4">
        {isAdmin && <AdminMenu />}
        <UserProfile onLogout={onLogout} />
      </div>
    </header>
  );
}
