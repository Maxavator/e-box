
import { useState, useEffect } from "react";
import { UserManagement } from "@/components/admin/UserManagement";
import { AdminView, NavigationCards } from "@/components/admin/dashboard/NavigationCards";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { StatsCards } from "@/components/admin/dashboard/StatsCards";
import { AdminReporting } from "@/components/admin/dashboard/AdminReporting";
import { LookupTools } from "@/components/admin/dashboard/LookupTools";
import { DocumentationPortal } from "@/components/admin/documentation/DocumentationPortal";
import { SystemsDocumentation } from "@/components/admin/documentation/SystemsDocumentation";
import { useUserProfile } from "@/hooks/useUserProfile";

export const AdminPortal = () => {
  const [activeView, setActiveView] = useState<AdminView>("dashboard");
  const { organizationName, userDisplayName, loading } = useUserProfile();
  
  // Get the user's name from the profile
  const userName = userDisplayName || 'User';

  // Handle navigation between different admin views
  const handleViewChange = (view: AdminView) => {
    setActiveView(view);
  };

  // Log when view changes for debugging
  useEffect(() => {
    console.log("Admin view changed to:", activeView);
  }, [activeView]);

  const renderViewContent = () => {
    switch (activeView) {
      case "users":
        return <UserManagement />;
      case "system":
        return <SystemSettings />;
      case "reporting":
        return <AdminReporting />;
      case "documentation":
        return <DocumentationPortal />;
      case "systems-docs":
        return <SystemsDocumentation />;
      default:
        return (
          <div className="space-y-6">
            <StatsCards />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LookupTools />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Administration Portal for {userName}</h1>
        <p className="text-muted-foreground">
          Manage users, organizations, and system settings
        </p>
      </div>

      {activeView === "dashboard" && (
        <div className="mb-8">
          <NavigationCards activeView={activeView} onNavigate={handleViewChange} />
        </div>
      )}

      {activeView !== "dashboard" && (
        <div className="mb-8 flex items-center">
          <button
            onClick={() => handleViewChange("dashboard")}
            className="text-blue-500 hover:text-blue-700 flex items-center mr-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Admin Dashboard
          </button>
        </div>
      )}

      {renderViewContent()}
    </div>
  );
};

export default AdminPortal;
