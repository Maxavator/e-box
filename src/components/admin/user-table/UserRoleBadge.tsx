
import { Badge } from "@/components/ui/badge";

interface UserRoleBadgeProps {
  role: string;
}

export const UserRoleBadge = ({ role }: UserRoleBadgeProps) => {
  const getRoleDisplayName = (role: string) => {
    switch(role) {
      case 'global_admin': return 'Global Admin';
      case 'org_admin': return 'Organization Admin';
      case 'staff': return 'Staff';
      case 'hr_moderator': return 'HR Moderator';
      case 'comm_moderator': return 'Communication Moderator';
      case 'stakeholder_moderator': return 'Stakeholder Moderator';
      default: return role || 'User';
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    if (['global_admin', 'org_admin'].includes(role)) {
      return 'bg-green-600 text-white';
    } else if (['hr_moderator', 'comm_moderator', 'stakeholder_moderator'].includes(role)) {
      return 'bg-blue-600 text-white';
    }
    return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  return (
    <Badge className={`text-xs font-normal ${getRoleBadgeStyle(role)}`}>
      {getRoleDisplayName(role)}
    </Badge>
  );
};
