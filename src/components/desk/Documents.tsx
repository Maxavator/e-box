
import { useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OTPVerification } from "./components/OTPVerification";
import { DocumentTabs } from "./components/DocumentTabs";
import { useDocuments } from "./hooks/useDocuments";
import { Badge } from "@/components/ui/badge";
import { FileText, Shield, Lock } from "lucide-react";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/useUserProfile";

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

  const { organizationName } = useUserProfile();

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Function to handle OTP success notification
  const handleOTPSuccess = (documentName: string) => {
    toast.success(`Document access granted`, {
      description: `You can now download "${documentName}"`,
      duration: 4000,
    });
  };

  // Function to handle OTP error
  const handleOTPError = () => {
    toast.error(`Verification failed`, {
      description: `The code entered was incorrect or has expired. Please try again.`,
      duration: 4000,
    });
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            My Documents
            {organizationName && (
              <Badge variant="outline" className="ml-2">
                {organizationName}
              </Badge>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your secure documents and files
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span>Secured</span>
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <Lock className="h-3 w-3" />
            <span>OTP Protected</span>
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Center</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="payslips" className="w-full">
            <TabsList className="w-full justify-start mb-6">
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
        onVerify={(otp) => {
          if (handleOTPVerify(otp)) {
            handleOTPSuccess(selectedDocument?.name || 'document');
          } else {
            handleOTPError();
          }
        }}
      />
    </div>
  );
};
