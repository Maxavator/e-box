
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface Organization {
  id: string;
  name: string;
  domain: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
  _count?: {
    profiles: number;
  };
}

interface OrganizationTableProps {
  organizations: Organization[];
  isLoading: boolean;
  onEdit: (org: Organization) => void;
  onDelete: (id: string) => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const OrganizationTable = ({
  organizations,
  isLoading,
  onEdit,
  onDelete,
}: OrganizationTableProps) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Organization</TableHead>
          <TableHead>Domain</TableHead>
          <TableHead>Members</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {organizations.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground">
              No organizations found
            </TableCell>
          </TableRow>
        ) : (
          organizations.map((org) => (
            <TableRow key={org.id} className="group">
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  {org.logo_url ? (
                    <img 
                      src={org.logo_url} 
                      alt={org.name} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {org.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <span>{org.name}</span>
                </div>
              </TableCell>
              <TableCell>
                {org.domain ? (
                  <Badge variant="outline" className="font-mono">
                    {org.domain}
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{org._count?.profiles || 0}</span>
                </div>
              </TableCell>
              <TableCell>{formatDate(org.created_at)}</TableCell>
              <TableCell>{formatDate(org.updated_at)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(org)}
                    className="hover:text-primary"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(org.id)}
                    className="hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
