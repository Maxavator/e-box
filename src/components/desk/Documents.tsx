
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { DocumentList } from "./components/DocumentList";
import { EmptyState } from "./components/EmptyState";
import { OTPVerification } from "./components/OTPVerification";
import { Document } from "./types/documents";
import { supabase } from "@/integrations/supabase/client";

export const Documents = () => {
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data: fetchedDocs, error } = await supabase
        .from('documents')
        .select('*');

      if (error) throw error;

      const formattedDocs: Document[] = (fetchedDocs || []).map(doc => ({
        id: doc.id,
        name: doc.name,
        size: doc.size || '0 KB',
        description: doc.description,
        category: doc.category,
        version: doc.version,
        lastModifiedBy: doc.last_modified_by,
        file_path: doc.file_path,
        content_type: doc.content_type,
        isVerified: doc.is_verified,
        requires_otp: doc.requires_otp,
        date: doc.created_at ? new Date(doc.created_at).toLocaleDateString() : undefined,
        created_at: doc.created_at,
        updated_at: doc.updated_at
      }));

      setDocuments(formattedDocs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentClick = async (doc: Document) => {
    if (doc.requires_otp) {
      setSelectedDocument(doc);
      setShowOTPDialog(true);
    } else {
      await downloadDocument(doc);
    }
  };

  const downloadDocument = async (doc: Document) => {
    try {
      if (!doc.file_path) throw new Error("File path not found");

      const { data, error } = await supabase.storage
        .from('documents')
        .download(doc.file_path);

      if (error) throw error;

      // Create a download link
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Downloading ${doc.name}`);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error("Failed to download document");
    }
  };

  const handleOTPVerify = async (otp: string) => {
    if (otp === "123456" && selectedDocument) {
      await downloadDocument(selectedDocument);
      setShowOTPDialog(false);
      setSelectedDocument(null);
    } else {
      toast.error("Invalid OTP");
    }
  };

  const filterDocuments = (category: string) => {
    return documents.filter(doc => doc.category?.toLowerCase() === category.toLowerCase());
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
              {loading ? (
                <div>Loading...</div>
              ) : filterDocuments('Financial').length > 0 ? (
                <DocumentList 
                  documents={filterDocuments('Financial')}
                  requiresOTP={true}
                  onDocumentClick={handleDocumentClick}
                />
              ) : (
                <EmptyState />
              )}
            </TabsContent>
            
            <TabsContent value="contracts">
              {loading ? (
                <div>Loading...</div>
              ) : filterDocuments('Legal').length > 0 ? (
                <DocumentList 
                  documents={filterDocuments('Legal')}
                  requiresOTP={true}
                  onDocumentClick={handleDocumentClick}
                />
              ) : (
                <EmptyState />
              )}
            </TabsContent>
            
            <TabsContent value="other">
              {loading ? (
                <div>Loading...</div>
              ) : documents.filter(doc => 
                !['Financial', 'Legal'].includes(doc.category || '')).length > 0 ? (
                <DocumentList 
                  documents={documents.filter(doc => 
                    !['Financial', 'Legal'].includes(doc.category || ''))}
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
