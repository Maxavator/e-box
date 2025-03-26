
import { TableCell, TableRow } from "@/components/ui/table";

interface UserTableEmptyProps {
  isLoading: boolean;
  usersCount: number;
  showingGolderUsers?: boolean;
}

export const UserTableEmpty = ({ isLoading, usersCount, showingGolderUsers }: UserTableEmptyProps) => {
  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={5} className="text-center">Loading users...</TableCell>
      </TableRow>
    );
  }
  
  if (!usersCount) {
    return (
      <TableRow>
        <TableCell colSpan={5} className="text-center">
          {showingGolderUsers 
            ? "No Golder (Pty) Ltd. users found" 
            : "No users found"}
        </TableCell>
      </TableRow>
    );
  }
  
  return null;
};
