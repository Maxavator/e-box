
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AppHeaderProps {
  onLogout: () => void;
  onLogoClick: () => void;
}

export function AppHeader({ onLogout, onLogoClick }: AppHeaderProps) {
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();

        if (profileData) {
          setDisplayName(`${profileData.first_name} ${profileData.last_name}`);
        }
      }
    };

    fetchUserInfo();
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
            alt="Afrovation" 
            className="h-12" // Increased from h-8 to h-12
          />
        </button>
        {displayName && (
          <span className="text-sm font-medium text-muted-foreground">
            Welcome, {displayName}
          </span>
        )}
      </div>
      <UserProfile onLogout={onLogout} />
    </header>
  );
}
