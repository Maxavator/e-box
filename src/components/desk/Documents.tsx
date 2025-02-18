
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
      // Sample documents data
      const sampleDocuments = [
        {
          id: '1',
          name: 'January_2024_Payslip.pdf',
          size: '245 KB',
          category: 'Financial',
          description: 'Monthly payslip for January 2024',
          version: '1.0',
          lastModifiedBy: 'HR System',
          isVerified: true,
          requires_otp: true,
          date: '2024-01-31',
          previewContent: 'This is a secure payslip document for January 2024. Please verify your identity to view the full content.'
        },
        {
          id: '2',
          name: 'Employment_Contract_2024.pdf',
          size: '890 KB',
          category: 'Legal',
          description: 'Updated employment contract for 2024',
          version: '2.1',
          lastModifiedBy: 'Legal Department',
          isVerified: true,
          requires_otp: true,
          date: '2024-01-15',
          previewContent: 'Employment contract including updated terms and conditions for 2024.'
        },
        {
          id: '3',
          name: 'Company_Handbook_2024.pdf',
          size: '1.2 MB',
          category: 'Other',
          description: 'Employee handbook and guidelines',
          version: '3.0',
          lastModifiedBy: 'HR Department',
          isVerified: true,
          requires_otp: false,
          date: '2024-01-01',
          previewContent: 'Company policies, procedures, and guidelines for all employees.'
        },
        {
          id: '4',
          name: 'February_2024_Payslip.pdf',
          size: '242 KB',
          category: 'Financial',
          description: 'Monthly payslip for February 2024',
          version: '1.0',
          lastModifiedBy: 'HR System',
          isVerified: true,
          requires_otp: true,
          date: '2024-02-29',
          previewContent: 'This is a secure payslip document for February 2024. Please verify your identity to view the full content.'
        },
        {
          id: '5',
          name: 'Performance_Review_Q1_2024.pdf',
          size: '350 KB',
          category: 'Other',
          description: 'First quarter performance evaluation',
          version: '1.0',
          lastModifiedBy: 'Line Manager',
          isVerified: true,
          requires_otp: false,
          date: '2024-03-15',
          previewContent: 'Quarterly performance review document including goals and achievements.'
        }
      ];

      const { data: fetchedDocs, error } = await supabase
        .from('documents')
        .select('*');

      if (error) throw error;

      // Use fetched documents if available, otherwise use sample documents
      const docsToUse = fetchedDocs && fetchedDocs.length > 0 ? fetchedDocs : sampleDocuments;

      const formattedDocs: Document[] = docsToUse.map(doc => ({
        id: doc.id,
        name: doc.name,
        size: doc.size || '0 KB',
        description: doc.description,
        category: doc.category,
        version: doc.version,
        lastModifiedBy: doc.lastModifiedBy || doc.last_modified_by,
        file_path: doc.file_path,
        content_type: doc.content_type,
        isVerified: doc.isVerified || doc.is_verified,
        requires_otp: doc.requires_otp,
        date: doc.date || (doc.created_at ? new Date(doc.created_at).toLocaleDateString() : undefined),
        previewContent: doc.previewContent,
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
