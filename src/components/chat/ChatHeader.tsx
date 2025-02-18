
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ChatHeaderProps {
  onLogout: () => void;
  onLogoClick: () => void;
}

export function ChatHeader({ onLogout, onLogoClick }: ChatHeaderProps) {
  const [userName, setUserName] = useState<string>('');

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
          setUserName(`${profileData.first_name} ${profileData.last_name}`);
        }
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <header className="border-b bg-white p-4 flex items-center justify-between">
      <button 
        onClick={onLogoClick}
        className="flex items-center gap-2 hover:opacity-90 transition-opacity"
      >
        <img 
          src="/lovable-uploads/81af9ad8-b07d-41cb-b800-92cebc70e699.png" 
          alt="Afrovation" 
          className="h-8"
        />
      </button>
      <div className="flex items-center gap-4">
        {userName && (
          <span className="text-sm text-muted-foreground">
            {userName}
          </span>
        )}
        <Button variant="ghost" size="icon" onClick={onLogout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
