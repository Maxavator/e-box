
import { useNavigate } from "react-router-dom";
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
  // Add navigation hook
  const navigate = useNavigate();
  
  // Format the name as "last_name, first_name"
  const formattedName = `${lastName || ''}, ${firstName || ''}`.trim() || 'User';
  
  // Display the job title if available, otherwise show appropriate fallback
  const displayedRole = jobTitle || (hasOrganization ? "Employee" : "Private Individual");

  // Handle click on user name to navigate to settings
  const handleNameClick = () => {
    navigate('/profile');
  };

  // For debugging
  console.log('UserProfileHeader - User data:', {
    firstName,
    lastName,
    formattedName,
    jobTitle,
    displayedRole
  });

  return (
    <div className="flex items-center gap-3 mb-3">
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatarUrl || ''} alt={formattedName} />
        <AvatarFallback>{initials || 'U'}</AvatarFallback>
      </Avatar>
      <div 
        className="flex flex-col cursor-pointer hover:opacity-80 transition-opacity" 
        onClick={handleNameClick}
      >
        <span className="text-sm font-medium">{formattedName}</span>
        <span className="text-xs text-muted-foreground">{displayedRole}</span>
      </div>
    </div>
  );
}
