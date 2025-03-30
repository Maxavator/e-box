
import React from "react";
import { Users, Building2, Settings, Shield } from "lucide-react";
import { AdminTile } from "./AdminTile";

interface AdminToolsSectionProps {
  navigate: (path: string, state?: any) => void;
}

export const AdminToolsSection = ({ navigate }: AdminToolsSectionProps) => {
  return (
    <div className="border-t pt-8">
      <h2 className="text-lg font-semibold mb-6">Admin Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminTile
          title="User Management"
          description="Manage users and permissions"
          icon={<Users className="w-5 h-5 text-blue-600" />}
          color="blue"
          onClick={() => navigate('/admin', { state: { view: 'users' } })}
        />
        <AdminTile
          title="Organizations"
          description="Manage organization settings"
          icon={<Building2 className="w-5 h-5 text-purple-600" />}
          color="purple"
          onClick={() => navigate('/admin', { state: { view: 'organizations' } })}
        />
        <AdminTile
          title="System Settings"
          description="Configure system settings"
          icon={<Settings className="w-5 h-5 text-amber-600" />}
          color="amber"
          onClick={() => navigate('/admin', { state: { view: 'settings' } })}
        />
        <AdminTile
          title="System Info"
          description="Monitor system health"
          icon={<Shield className="w-5 h-5 text-green-600" />}
          color="green"
          onClick={() => navigate('/admin', { state: { view: 'system' } })}
        />
      </div>
    </div>
  );
};
