
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { DocumentList } from "./components/DocumentList";
import { EmptyState } from "./components/EmptyState";
import { OTPVerification } from "./components/OTPVerification";
import { payslips, contracts, otherDocuments } from "./data/documents";
import { Document } from "./types/documents";

export const Documents = () => {
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const handleDocumentClick = (doc: Document) => {
    if (doc.name.toLowerCase().includes('payslip') || doc.name.toLowerCase().includes('contract') || 
        doc.name.toLowerCase().includes('agreement')) {
      setSelectedDocument(doc);
      setShowOTPDialog(true);
    } else if (doc.downloadUrl) {
      const link = document.createElement('a');
      link.href = doc.downloadUrl;
      link.target = '_blank';
      link.download = doc.downloadUrl.split('/').pop() || doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Downloading ${doc.name}`);
    } else {
      toast.error("Download URL not found");
    }
  };

  const handleOTPVerify = (otp: string) => {
    if (otp === "123456" && selectedDocument?.downloadUrl) {
      const link = document.createElement('a');
      link.href = selectedDocument.downloadUrl;
      link.target = '_blank';
      link.download = selectedDocument.downloadUrl.split('/').pop() || selectedDocument.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Verified successfully. Downloading ${selectedDocument.name}`);
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
                  requiresOTP={true}
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
