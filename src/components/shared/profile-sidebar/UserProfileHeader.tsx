
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserProfileHeaderProps {
  firstName: string;
  lastName: string;
  initials: string;
  avatarUrl?: string;
  jobTitle?: string;
  hasOrganization: boolean;
  isSpecialUser?: boolean;
}

export function UserProfileHeader({ 
  firstName,
  lastName,
  initials, 
  avatarUrl, 
  jobTitle,
  hasOrganization,
  isSpecialUser = false
}: UserProfileHeaderProps) {
  // Add navigation hook
  const navigate = useNavigate();
  
  // Format the name based on user type
  const formattedName = isSpecialUser 
    ? `${firstName} ${lastName}` 
    : `${lastName}, ${firstName}`;
  
  // Display the job title if available, otherwise show appropriate fallback
  const displayedRole = jobTitle || (hasOrganization ? "Private Individual" : "Private Individual");

  // Handle click on user name to navigate to settings
  const handleNameClick = () => {
    navigate('/profile');
  };

  return (
    <div className="flex items-center gap-3 mb-3">
      <Avatar className={cn("h-10 w-10", isSpecialUser ? "ring-2 ring-amber-300" : "")}>
        <AvatarImage src={avatarUrl || ''} alt={formattedName} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div 
        className="flex flex-col cursor-pointer hover:opacity-80 transition-opacity" 
        onClick={handleNameClick}
      >
        <span className={cn("text-sm font-medium", isSpecialUser ? "text-amber-300" : "")}>{formattedName}</span>
        <span className="text-xs text-muted-foreground">{displayedRole}</span>
      </div>
    </div>
  );
}
