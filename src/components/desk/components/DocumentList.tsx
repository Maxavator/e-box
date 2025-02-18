
import { FileText, Lock, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Document } from "../types/documents";

interface DocumentListProps {
  documents: Document[];
  requiresOTP?: boolean;
  onDocumentClick: (doc: Document) => void;
}

export const DocumentList = ({ documents, requiresOTP = false, onDocumentClick }: DocumentListProps) => {
  const DocumentPreview = ({ document }: { document: Document }) => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{document.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{document.description}</p>
      </div>
      
      {document.previewContent && (
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-700">{document.previewContent}</p>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Category</p>
          <p className="font-medium">{document.category}</p>
        </div>
        <div>
          <p className="text-gray-500">Version</p>
          <p className="font-medium">{document.version}</p>
        </div>
        <div>
          <p className="text-gray-500">Last Modified By</p>
          <p className="font-medium">{document.lastModifiedBy}</p>
        </div>
        <div>
          <p className="text-gray-500">Size</p>
          <p className="font-medium">{document.size}</p>
        </div>
      </div>

      <Button 
        className="w-full"
        onClick={() => onDocumentClick(document)}
      >
        Download Document
      </Button>
    </div>
  );

  return (
    <ScrollArea className="h-[400px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.name}>
              <TableCell className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="font-medium">{doc.name}</span>
                {requiresOTP && <Lock className="h-3 w-3 text-gray-400" />}
                {doc.isVerified && (
                  <CheckCircle2 
                    className="h-3 w-3 text-green-500" 
                    aria-label="E-box Verified"
                  />
                )}
                {doc.description && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{doc.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </TableCell>
              <TableCell>{doc.date}</TableCell>
              <TableCell>{doc.size}</TableCell>
              <TableCell className="text-right space-x-2">
                {doc.previewContent && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Preview
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Document Preview</SheetTitle>
                        <SheetDescription>
                          View document details and content
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-6">
                        <DocumentPreview document={doc} />
                      </div>
                    </SheetContent>
                  </Sheet>
                )}
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
};
