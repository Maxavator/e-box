
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import type { Organization } from "../types";

interface OrganizationTableProps {
  organizations: Organization[] | undefined;
  isLoading: boolean;
  onEdit: (org: Organization) => void;
  onDelete: (id: string) => void;
}

export const OrganizationTable = ({ organizations, isLoading, onEdit, onDelete }: OrganizationTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Domain</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center">Loading organizations...</TableCell>
          </TableRow>
        ) : organizations?.map((org) => (
          <TableRow key={org.id}>
            <TableCell>{org.name}</TableCell>
            <TableCell>{org.domain || 'N/A'}</TableCell>
            <TableCell>{new Date(org.created_at).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" onClick={() => onEdit(org)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(org.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
