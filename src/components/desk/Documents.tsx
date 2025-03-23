
import { useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OTPVerification } from "./components/OTPVerification";
import { DocumentTabs } from "./components/DocumentTabs";
import { useDocuments } from "./hooks/useDocuments";

export const Documents = () => {
  const {
    documents,
    loading,
    showOTPDialog,
    selectedDocument,
    fetchDocuments,
    handleDocumentClick,
    handleOTPVerify,
    filterDocuments,
    setShowOTPDialog,
    setSelectedDocument
  } = useDocuments();

  useEffect(() => {
    fetchDocuments();
  }, []);

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
            
            <DocumentTabs
              loading={loading}
              documents={documents}
              filterDocuments={filterDocuments}
              onDocumentClick={handleDocumentClick}
            />
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
