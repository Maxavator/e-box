
import { useState } from "react";
import { Document } from "../types/documents";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { sampleDocuments } from "../data/sampleDocuments";

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const fetchDocuments = async () => {
    try {
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

  const downloadDocument = async (doc: Document) => {
    try {
      if (!doc.file_path) throw new Error("File path not found");

      const { data, error } = await supabase.storage
        .from('documents')
        .download(doc.file_path);

      if (error) throw error;

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

  const handleDocumentClick = async (doc: Document) => {
    if (doc.requires_otp) {
      setSelectedDocument(doc);
      setShowOTPDialog(true);
    } else {
      await downloadDocument(doc);
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

  return {
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
  };
};
