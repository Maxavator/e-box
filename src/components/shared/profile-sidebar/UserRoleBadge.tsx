
import { Badge } from "@/components/ui/badge";
import { useUserRole } from "@/components/admin/hooks/useUserRole";

export function UserRoleBadge() {
  const { userRole } = useUserRole();
  
  const getRoleDisplayText = (role: string | undefined) => {
    switch(role) {
      case 'global_admin': return 'Global Admin';
      case 'org_admin': return 'Org Admin';
      case 'staff': return 'Staff';
      case 'hr_moderator': return 'HR Moderator';
      case 'comm_moderator': return 'Communication Moderator';
      case 'stakeholder_moderator': return 'Stakeholder Moderator';
      case 'survey_moderator': return 'Survey Moderator';
      default: return 'User';
    }
  };
  
  const getRoleBadgeStyle = (role: string | undefined) => {
    if (['global_admin', 'org_admin'].includes(role || '')) {
      return 'bg-green-600 hover:bg-green-700';
    } else if (['hr_moderator', 'comm_moderator', 'stakeholder_moderator', 'survey_moderator'].includes(role || '')) {
      return 'bg-blue-600 hover:bg-blue-700';
    }
    return '';
  };

  const isAdmin = ['global_admin', 'org_admin'].includes(userRole || '');
  const isModerator = ['hr_moderator', 'comm_moderator', 'stakeholder_moderator', 'survey_moderator'].includes(userRole || '');
  
  return (
    <Badge 
      variant={isAdmin || isModerator ? "default" : "outline"}
      className={`text-xs ${getRoleBadgeStyle(userRole)}`}
    >
      {getRoleDisplayText(userRole)}
    </Badge>
  );
}
