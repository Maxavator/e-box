
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Loader2 } from "lucide-react";

interface DashboardHeaderProps {
  formattedName: string | null;
  isAdmin: boolean;
  jobTitle?: string;
  organizationName?: string;
  lastUpdate: string;
  isDataLoading: boolean;
  refreshData: () => void;
}

export const DashboardHeader = ({
  formattedName,
  isAdmin,
  jobTitle,
  organizationName,
  lastUpdate,
  isDataLoading,
  refreshData
}: DashboardHeaderProps) => {
  // For debugging
  useEffect(() => {
    console.log("DashboardHeader rendering with:", {
      formattedName,
      isAdmin,
      jobTitle,
      organizationName
    });
  }, [formattedName, isAdmin, jobTitle, organizationName]);
  
  return (
    <header className="h-16 bg-card border-b px-8 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {formattedName || 'User'}
          {isAdmin && " (Admin)"}
          {jobTitle && <span className="ml-1 text-xs opacity-80">• {jobTitle}</span>}
          {organizationName && <span className="ml-1 text-xs opacity-80">• {organizationName}</span>}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Last updated: {lastUpdate}</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={refreshData}
          disabled={isDataLoading}
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          {isDataLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            "Refresh Data"
          )}
        </Button>
      </div>
    </header>
  );
};
