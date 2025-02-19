
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import type { Organization } from "../types";

export interface OrganizationTableProps {
  organizations: Organization[];
  isLoading: boolean;
  onEdit: (org: Organization) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
}

export const OrganizationTable = ({ organizations, isLoading, onEdit, onDelete, isAdmin }: OrganizationTableProps) => {
  if (isLoading) {
    return <div className="p-4">Loading organizations...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Domain</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {organizations.map((org) => (
          <TableRow key={org.id}>
            <TableCell>{org.name}</TableCell>
            <TableCell>{org.domain || "-"}</TableCell>
            <TableCell>{new Date(org.created_at).toLocaleDateString()}</TableCell>
            <TableCell className="space-x-2">
              {isAdmin && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(org)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(org.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
