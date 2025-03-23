
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfileHeaderProps {
  fullName: string;
  initials: string;
  avatarUrl?: string;
  jobTitle?: string;
}

export function UserProfileHeader({ fullName, initials, avatarUrl, jobTitle }: UserProfileHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatarUrl || ''} alt={fullName} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{fullName}</span>
        <span className="text-xs text-muted-foreground">{jobTitle}</span>
      </div>
    </div>
  );
}
