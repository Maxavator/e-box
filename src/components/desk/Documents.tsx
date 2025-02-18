
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const DocumentList = ({ 
  documents, 
  requiresOTP = false,
  onDocumentClick 
}: { 
  documents: { name: string; date: string; size: string }[];
  requiresOTP?: boolean;
  onDocumentClick: (doc: { name: string; date: string; size: string }) => void;
}) => (
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

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <FileText className="h-12 w-12 text-gray-400 mb-4" />
    <h3 className="text-lg font-medium">No documents found</h3>
    <p className="text-sm text-gray-500">Documents will appear here once they are added to your account.</p>
  </div>
);

const OTPVerification = ({ 
  isOpen, 
  onClose,
  onVerify 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onVerify: (otp: string) => void;
}) => {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(otp);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Security Verification</DialogTitle>
          <DialogDescription>
            Enter the OTP sent to your email to access the payslip
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center py-4">
            <InputOTP
              value={otp}
              onChange={(value) => setOtp(value)}
              maxLength={6}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, index) => (
                    <InputOTPSlot key={index} {...slot} />
                  ))}
                </InputOTPGroup>
              )}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Verify
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const Documents = () => {
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{ name: string; date: string; size: string } | null>(null);

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

  const handleDocumentClick = (doc: { name: string; date: string; size: string }) => {
    if (doc.name.toLowerCase().includes('payslip')) {
      setSelectedDocument(doc);
      setShowOTPDialog(true);
    } else {
      // Handle regular document download
      toast.success(`Downloading ${doc.name}`);
    }
  };

  const handleOTPVerify = (otp: string) => {
    // In a real application, you would verify the OTP with your backend
    if (otp === "123456") { // Example verification
      toast.success(`Verified successfully. Downloading ${selectedDocument?.name}`);
      setShowOTPDialog(false);
      setSelectedDocument(null);
    } else {
      toast.error("Invalid OTP");
    }
  };

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
                <DocumentList 
                  documents={payslips} 
                  requiresOTP={true}
                  onDocumentClick={handleDocumentClick}
                />
              ) : (
                <EmptyState />
              )}
            </TabsContent>
            
            <TabsContent value="contracts">
              {contracts.length > 0 ? (
                <DocumentList 
                  documents={contracts}
                  onDocumentClick={handleDocumentClick}
                />
              ) : (
                <EmptyState />
              )}
            </TabsContent>
            
            <TabsContent value="other">
              {otherDocuments.length > 0 ? (
                <DocumentList 
                  documents={otherDocuments}
                  onDocumentClick={handleDocumentClick}
                />
              ) : (
                <EmptyState />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <OTPVerification 
        isOpen={showOTPDialog}
        onClose={() => {
          setShowOTPDialog(false);
          setSelectedDocument(null);
        }}
        onVerify={handleOTPVerify}
      />
    </div>
  );
};
