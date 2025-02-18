
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const DocumentList = ({ documents }: { documents: { name: string; date: string; size: string }[] }) => (
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
            </TableCell>
            <TableCell>{doc.date}</TableCell>
            <TableCell>{doc.size}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">
                Download
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </ScrollArea>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <FileText className="h-12 w-12 text-gray-400 mb-4" />
    <h3 className="text-lg font-medium">No documents found</h3>
    <p className="text-sm text-gray-500">Documents will appear here once they are added to your account.</p>
  </div>
);

export const Documents = () => {
  // Sample data - replace with actual data from your backend
  const payslips = [
    { name: "Payslip March 2024", date: "2024-03-01", size: "156 KB" },
    { name: "Payslip February 2024", date: "2024-02-01", size: "155 KB" },
    { name: "Payslip January 2024", date: "2024-01-01", size: "154 KB" },
  ];

  const contracts = [
    { name: "Employment Contract", date: "2023-01-15", size: "2.1 MB" },
    { name: "NDA Agreement", date: "2023-01-15", size: "890 KB" },
  ];

  const otherDocuments = [
    { name: "Company Handbook", date: "2023-12-01", size: "3.2 MB" },
    { name: "Travel Policy", date: "2023-11-15", size: "645 KB" },
    { name: "Benefits Guide", date: "2023-10-01", size: "1.8 MB" },
  ];

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>My Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="payslips" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="payslips">Payslips</TabsTrigger>
              <TabsTrigger value="contracts">Contracts</TabsTrigger>
              <TabsTrigger value="other">Other Documents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="payslips">
              {payslips.length > 0 ? (
                <DocumentList documents={payslips} />
              ) : (
                <EmptyState />
              )}
            </TabsContent>
            
            <TabsContent value="contracts">
              {contracts.length > 0 ? (
                <DocumentList documents={contracts} />
              ) : (
                <EmptyState />
              )}
            </TabsContent>
            
            <TabsContent value="other">
              {otherDocuments.length > 0 ? (
                <DocumentList documents={otherDocuments} />
              ) : (
                <EmptyState />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
