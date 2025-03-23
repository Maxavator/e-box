
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
  
  // Only display "Private Individual" when there's no organization
  // If they have an organization but no job title, we'll let the organization name show via OrganizationInfo
  const displayedRole = hasOrganization ? (jobTitle || "") : "Private Individual";

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
