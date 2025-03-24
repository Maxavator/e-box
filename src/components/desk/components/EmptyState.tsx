
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({ 
  title = "No documents found",
  description = "Documents will appear here once they are added to your account.",
  icon = <FileText className="h-12 w-12 text-gray-400" />,
  actionLabel,
  onAction
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-medium">{title}</h3>
    <p className="text-sm text-gray-500 max-w-md mt-1">{description}</p>
    
    {actionLabel && onAction && (
      <Button 
        variant="outline" 
        className="mt-4"
        onClick={onAction}
      >
        {actionLabel}
      </Button>
    )}
  </div>
);
