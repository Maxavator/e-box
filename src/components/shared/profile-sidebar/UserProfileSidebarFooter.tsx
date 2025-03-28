
import { useUserProfile } from "@/hooks/useUserProfile";
import { UserInfo } from "@/components/user/UserInfo";
import { AdminButton } from "./AdminButton";
import { VersionInfo } from "./VersionInfo";

export function UserProfileSidebarFooter() {
  const { loading } = useUserProfile();
  
  // Show simple loading state
  if (loading) {
    return (
      <div className="flex flex-col p-3 w-full">
        <div className="flex items-center gap-3 mb-3 animate-pulse">
          <div className="h-10 w-10 rounded-full bg-muted"></div>
          <div className="flex flex-col gap-1.5">
            <div className="h-4 w-20 bg-muted rounded"></div>
            <div className="h-3 w-16 bg-muted rounded"></div>
          </div>
        </div>
        <div className="h-4 w-28 bg-muted rounded mt-2 opacity-50"></div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col p-3 w-full border-t border-border/30">
      {/* User info at the footer */}
      <UserInfo className="mb-2" />
      
      <div className="flex items-center gap-2 mt-1">
        <AdminButton />
      </div>
      
      <VersionInfo />
    </div>
  );
}
