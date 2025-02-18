
import { FileText } from "lucide-react";

export const EmptyState = () => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <FileText className="h-12 w-12 text-gray-400 mb-4" />
    <h3 className="text-lg font-medium">No documents found</h3>
    <p className="text-sm text-gray-500">Documents will appear here once they are added to your account.</p>
  </div>
);
