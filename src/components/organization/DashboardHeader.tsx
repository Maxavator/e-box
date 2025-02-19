
import { Button } from "@/components/ui/button";
import { Building2, LogOut } from "lucide-react";

interface DashboardHeaderProps {
  orgName: string;
  isAdmin: boolean;
  onLogout: () => void;
  onManageOrg: () => void;
}

export const DashboardHeader = ({ 
  orgName, 
  isAdmin, 
  onLogout, 
  onManageOrg 
}: DashboardHeaderProps) => {
  return (
    <header className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <h1 className="heading-responsive font-bold tracking-tight">Organization Dashboard</h1>
        <div className="flex items-center gap-4">
          {orgName && (
            <p className="text-muted-foreground text-responsive">
              {orgName}
              {isAdmin && <span className="ml-2 text-primary">(Admin)</span>}
            </p>
          )}
          <Button 
            variant="destructive" 
            onClick={onLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <p className="text-muted-foreground text-responsive">
          Manage your organization's information and policies
        </p>
        {isAdmin && (
          <Button 
            variant="outline"
            onClick={onManageOrg}
            className="flex items-center gap-2 w-full md:w-auto"
          >
            <Building2 className="h-4 w-4" />
            Manage Organization
          </Button>
        )}
      </div>
    </header>
  );
};
