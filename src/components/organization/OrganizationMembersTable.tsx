
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Mail, ShieldCheck, User } from "lucide-react";
import { OrganizationMember } from "@/hooks/useOrganizationMembers";
import { UserRole } from "@/components/admin/hooks/useUserRole";

interface OrganizationMembersTableProps {
  members: OrganizationMember[];
  isLoading: boolean;
  isAdmin: boolean;
}

export function OrganizationMembersTable({ 
  members, 
  isLoading,
  isAdmin
}: OrganizationMembersTableProps) {
  
  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'global_admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'org_admin':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'hr_moderator':
      case 'comm_moderator':
      case 'stakeholder_moderator':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'global_admin': return 'Global Admin';
      case 'org_admin': return 'Org Admin';
      case 'hr_moderator': return 'HR Moderator';
      case 'comm_moderator': return 'Comms Moderator';
      case 'stakeholder_moderator': return 'Stakeholder Moderator';
      default: return 'Staff';
    }
  };
  
  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
        <p className="text-muted-foreground">Loading organization members...</p>
      </div>
    );
  }
  
  if (members.length === 0) {
    return (
      <div className="py-8 text-center border rounded-md">
        <User className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
        <h3 className="font-medium">No members found</h3>
        <p className="text-sm text-muted-foreground">
          {members.length === 0 ? "No members in your organization yet" : "No members match your search"}
        </p>
      </div>
    );
  }
  
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Last Activity</TableHead>
            {isAdmin && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">
                {member.first_name && member.last_name 
                  ? `${member.first_name} ${member.last_name}`
                  : 'Unnamed User'}
              </TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>
                <Badge className={`${getRoleBadgeStyle(member.role)}`}>
                  {getRoleDisplayName(member.role)}
                </Badge>
              </TableCell>
              <TableCell>
                {member.last_activity 
                  ? formatDistanceToNow(new Date(member.last_activity), { addSuffix: true })
                  : 'Never'}
              </TableCell>
              {isAdmin && (
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Manage Role
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
