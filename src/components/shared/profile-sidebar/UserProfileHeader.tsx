
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfileHeaderProps {
  firstName: string;
  lastName: string;
  initials: string;
  avatarUrl?: string;
  jobTitle?: string;
  hasOrganization: boolean;
}

export function UserProfileHeader({ 
  firstName,
  lastName,
  initials, 
  avatarUrl, 
  jobTitle,
  hasOrganization
}: UserProfileHeaderProps) {
  // Format the name as "last_name, first_name"
  const formattedName = `${lastName}, ${firstName}`;
  
  // Display the job title if available, otherwise show appropriate fallback
  const displayedRole = jobTitle || (hasOrganization ? "Chief Information Officer" : "Private Individual");

  return (
    <div className="flex items-center gap-3 mb-3">
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatarUrl || ''} alt={formattedName} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{formattedName}</span>
        <span className="text-xs text-muted-foreground">{displayedRole}</span>
      </div>
    </div>
  );
}
