
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { UserWithRole } from "./types";
import { UserRow, UserTableEmpty } from "./user-table";

interface UserTableProps {
  users: UserWithRole[] | undefined;
  isLoading: boolean;
  onEditUser: (user: UserWithRole) => void;
  isAdmin: boolean;
  userRole?: string;
  showingGolderUsers?: boolean;
  userOrganizationId?: string;
}

export const UserTable = ({ 
  users, 
  isLoading, 
  onEditUser, 
  isAdmin, 
  userRole, 
  showingGolderUsers = false,
  userOrganizationId,
}: UserTableProps) => {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Username/ID</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <UserTableEmpty 
            isLoading={isLoading} 
            usersCount={users?.length || 0} 
            showingGolderUsers={showingGolderUsers} 
          />
          
          {users?.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              isAdmin={isAdmin}
              userRole={userRole}
              showingGolderUsers={showingGolderUsers}
              userOrganizationId={userOrganizationId}
              onEditUser={onEditUser}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
