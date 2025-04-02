
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield } from "lucide-react";

interface UserProfileHeaderProps {
  firstName: string;
  lastName: string;
  initials: string;
  avatarUrl?: string;
  jobTitle?: string;
  hasOrganization: boolean;
  province?: string;
}

export function UserProfileHeader({ 
  firstName,
  lastName,
  initials, 
  avatarUrl, 
  jobTitle,
  hasOrganization,
  province
}: UserProfileHeaderProps) {
  // Add navigation hook
  const navigate = useNavigate();
  
  // Format the name to show full name with fallback
  let displayName = "User";
  
  if (firstName && lastName) {
    displayName = `${firstName} ${lastName}`;
  } else if (firstName) {
    displayName = firstName;
  } else if (lastName) {
    displayName = lastName;
  }
  
  // Display the job title if available, otherwise show appropriate fallback
  const displayedRole = jobTitle || (hasOrganization ? "Employee" : "User");

  // Handle click on user name to navigate to settings
  const handleNameClick = () => {
    navigate('/profile');
  };

  return (
    <div className="flex items-center gap-3 mb-3">
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatarUrl || ''} alt={displayName} />
        <AvatarFallback>{initials || '?'}</AvatarFallback>
      </Avatar>
      <div 
        className="flex flex-col cursor-pointer hover:opacity-80 transition-opacity" 
        onClick={handleNameClick}
      >
        <span className="text-sm font-semibold">{displayName}</span>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">{displayedRole}</span>
          {province && (
            <span className="text-xs flex items-center text-muted-foreground">
              <Shield className="h-3 w-3 mx-1" />
              {province}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
