
import { FileText, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Document } from "../types/documents";

interface DocumentListProps {
  documents: Document[];
  requiresOTP?: boolean;
  onDocumentClick: (doc: Document) => void;
}

export const DocumentList = ({ documents, requiresOTP = false, onDocumentClick }: DocumentListProps) => (
  <ScrollArea className="h-[400px]">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Size</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => (
          <TableRow key={doc.name}>
            <TableCell className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {doc.name}
              {requiresOTP && <Lock className="h-3 w-3 text-gray-400" />}
              {doc.isVerified && (
                <CheckCircle2 
                  className="h-3 w-3 text-green-500" 
                  aria-label="E-box Verified"
                />
              )}
            </TableCell>
            <TableCell>{doc.date}</TableCell>
            <TableCell>{doc.size}</TableCell>
            <TableCell className="text-right">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onDocumentClick(doc)}
              >
                Download
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </ScrollArea>
);
