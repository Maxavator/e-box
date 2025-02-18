
import { TabsContent } from "@/components/ui/tabs";
import { DocumentList } from "./DocumentList";
import { EmptyState } from "./EmptyState";
import { Document } from "../types/documents";

interface DocumentTabsProps {
  loading: boolean;
  documents: Document[];
  filterDocuments: (category: string) => Document[];
  onDocumentClick: (doc: Document) => void;
}

export const DocumentTabs = ({
  loading,
  documents,
  filterDocuments,
  onDocumentClick
}: DocumentTabsProps) => {
  return (
    <>
      <TabsContent value="payslips">
        {loading ? (
          <div>Loading...</div>
        ) : filterDocuments('Financial').length > 0 ? (
          <DocumentList 
            documents={filterDocuments('Financial')}
            requiresOTP={true}
            onDocumentClick={onDocumentClick}
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
            onDocumentClick={onDocumentClick}
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
            onDocumentClick={onDocumentClick}
          />
        ) : (
          <EmptyState />
        )}
      </TabsContent>
    </>
  );
};
