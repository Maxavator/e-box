
import { TabsContent } from "@/components/ui/tabs";
import { DocumentList } from "./DocumentList";
import { EmptyState } from "./EmptyState";
import { Document } from "../types/documents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Lock, FileStack } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

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
  const documentsStats = {
    total: documents.length,
    financial: filterDocuments('Financial').length,
    legal: filterDocuments('Legal').length,
    other: documents.filter(doc => !['Financial', 'Legal'].includes(doc.category || '')).length,
    secured: documents.filter(doc => doc.requires_otp).length,
    verified: documents.filter(doc => doc.is_verified).length
  };

  const renderDocumentSummary = (category: string, count: number, icon: React.ReactNode, description: string) => (
    <div className="p-4 border rounded-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-muted-foreground">{category}</p>
          <h3 className="text-2xl font-bold mt-1">{count}</h3>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="bg-primary/10 p-2 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <TabsContent value="payslips">
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Payslip Documents
              </CardTitle>
              <Badge variant="outline" className="flex items-center gap-1">
                <Lock className="h-3 w-3" /> 
                Secure Documents
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {renderDocumentSummary(
                "Financial Documents", 
                documentsStats.financial, 
                <FileStack className="h-5 w-5 text-blue-600" />,
                "Payslips and financial statements"
              )}
              {renderDocumentSummary(
                "Secured with OTP", 
                documentsStats.secured, 
                <Lock className="h-5 w-5 text-amber-600" />,
                "Protected with one-time password"
              )}
              {renderDocumentSummary(
                "Verified Documents", 
                documentsStats.verified, 
                <FileText className="h-5 w-5 text-green-600" />,
                "Documents with digital signatures"
              )}
            </div>
            {loading ? (
              <div className="py-8 flex flex-col items-center justify-center">
                <Progress value={40} className="w-full max-w-sm mb-4" />
                <p className="text-sm text-muted-foreground">Loading your financial documents...</p>
              </div>
            ) : filterDocuments('Financial').length > 0 ? (
              <DocumentList 
                documents={filterDocuments('Financial')}
                requiresOTP={true}
                onDocumentClick={onDocumentClick}
              />
            ) : (
              <EmptyState 
                title="No Financial Documents" 
                description="No financial documents like payslips or statements have been added to your account yet." 
              />
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="contracts">
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Contract Documents
              </CardTitle>
              <Badge variant="outline" className="flex items-center gap-1">
                <Lock className="h-3 w-3" /> 
                Legal Documents
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 flex flex-col items-center justify-center">
                <Progress value={60} className="w-full max-w-sm mb-4" />
                <p className="text-sm text-muted-foreground">Loading your legal documents...</p>
              </div>
            ) : filterDocuments('Legal').length > 0 ? (
              <DocumentList 
                documents={filterDocuments('Legal')}
                requiresOTP={true}
                onDocumentClick={onDocumentClick}
              />
            ) : (
              <EmptyState 
                title="No Legal Documents" 
                description="No contracts or legal documents have been added to your account yet."
              />
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="other">
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Other Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 flex flex-col items-center justify-center">
                <Progress value={80} className="w-full max-w-sm mb-4" />
                <p className="text-sm text-muted-foreground">Loading your documents...</p>
              </div>
            ) : documents.filter(doc => 
              !['Financial', 'Legal'].includes(doc.category || '')).length > 0 ? (
              <DocumentList 
                documents={documents.filter(doc => 
                  !['Financial', 'Legal'].includes(doc.category || ''))}
                onDocumentClick={onDocumentClick}
              />
            ) : (
              <EmptyState 
                title="No Other Documents" 
                description="No additional documents have been added to your account yet."
              />
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
};
