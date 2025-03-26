
import { TableCell, TableRow } from "@/components/ui/table";
import { UserRoleBadge } from "./UserRoleBadge";
import { ModeratorInfo } from "./ModeratorInfo";
import { UserActions } from "./UserActions";
import type { UserWithRole } from "../types";

interface UserRowProps {
  user: UserWithRole;
  isAdmin: boolean;
  userRole?: string;
  showingGolderUsers?: boolean;
  userOrganizationId?: string;
  onEditUser: (user: UserWithRole) => void;
}

export const UserRow = ({ 
  user, 
  isAdmin, 
  userRole, 
  showingGolderUsers = false,
  userOrganizationId,
  onEditUser,
}: UserRowProps) => {
  const isOrgAdmin = !isAdmin && userRole === 'org_admin';
  const userRoleValue = user.user_roles?.[0]?.role || 'user';
  const isThabo = user.first_name === 'Thabo' && user.last_name === 'Nkosi';
  const isGolderUser = user.organizations?.[0]?.name?.toLowerCase().includes('golder');
  
  // For organizational admins, highlight users in their organization
  const isSameOrganization = (user: UserWithRole) => {
    return userOrganizationId && user.organization_id === userOrganizationId;
  };
  
  const isUserInMyOrg = isOrgAdmin && isSameOrganization(user);
  
  return (
    <TableRow 
      key={user.id} 
      className={isThabo 
        ? "bg-green-50 dark:bg-green-900/10" 
        : isGolderUser && showingGolderUsers 
          ? "bg-amber-50 dark:bg-amber-900/10" 
          : isUserInMyOrg
            ? "bg-blue-50 dark:bg-blue-900/10"
            : ""}
    >
      <TableCell>
        {user.first_name} {user.last_name}
        {isThabo && <span className="ml-2 text-green-600 dark:text-green-400 text-xs">(Target User)</span>}
        {isUserInMyOrg && <span className="ml-2 text-blue-600 dark:text-blue-400 text-xs">(Your Organization)</span>}
      </TableCell>
      <TableCell>User #{user.id.substring(0, 8)}</TableCell>
      <TableCell>
        <UserRoleBadge role={userRoleValue} />
        <ModeratorInfo roleValue={userRoleValue} />
      </TableCell>
      <TableCell>
        {user.organizations?.[0]?.name || 'N/A'}
        {isGolderUser && showingGolderUsers && 
          <span className="ml-2 text-amber-600 dark:text-amber-400 text-xs">(Golder)</span>
        }
      </TableCell>
      <TableCell className="text-right">
        <UserActions 
          user={user} 
          isAdmin={isAdmin} 
          isOrgAdmin={isOrgAdmin} 
          isSameOrganization={isSameOrganization}
          onEditUser={onEditUser}
        />
      </TableCell>
    </TableRow>
  );
};
