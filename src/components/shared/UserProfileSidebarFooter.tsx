
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { OnlineStatus } from "@/components/user/OnlineStatus";
import { useQuery } from "@tanstack/react-query";

export function UserProfileSidebarFooter() {
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url, job_title')
        .eq('id', session!.user.id)
        .single();
      return data;
    },
  });

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  if (!profile) return null;

  const initials = `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`;
  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`;
  const jobTitle = profile.job_title || 'Employee';

  return (
    <div className="flex flex-col gap-3 p-3 border-t">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={profile.avatar_url || ''} alt={fullName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{fullName}</span>
          <span className="text-xs text-muted-foreground">{jobTitle}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <OnlineStatus />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLogout}
          className="flex items-center gap-1"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}
