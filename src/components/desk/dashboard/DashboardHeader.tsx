
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { useUserRole } from "@/components/admin/hooks/useUserRole";

interface DashboardHeaderProps {
  currentView: string;
  onBackClick: () => void;
  onAdminClick: () => void;
}

export const DashboardHeader = ({ currentView, onBackClick, onAdminClick }: DashboardHeaderProps) => {
  const { userRole } = useUserRole();

  return (
    <header className="h-16 bg-white border-b px-8 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">System Overview</p>
      </div>
      <div className="flex items-center gap-4">
        {currentView !== 'dashboard' && (
          <button
            onClick={onBackClick}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Back to Dashboard
          </button>
        )}
        {userRole === 'org_admin' && (
          <Button
            onClick={onAdminClick}
            className="flex items-center gap-2"
            variant="outline"
          >
            <ShieldCheck className="w-4 h-4" />
            Access Admin Tools
          </Button>
        )}
      </div>
    </header>
  );
};
