
import { Briefcase, AlertCircle, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "@/hooks/useUserProfile";

export function DeskHeader() {
  const { organizationName, loading, error } = useUserProfile();
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Briefcase className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-3xl font-bold leading-tight">Desk {!loading && organizationName ? `@${organizationName}` : ''}</h1>
          {!loading && organizationName && (
            <p className="text-sm text-muted-foreground">Your organizational workspace</p>
          )}
        </div>
      </div>
      
      {error && (
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">Error loading organization information</span>
        </div>
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2"
        onClick={() => navigate("/documents")}
      >
        <FileText className="h-4 w-4" />
        <span>Open My Documents</span>
        <ExternalLink className="h-3 w-3" />
      </Button>
    </div>
  );
}
