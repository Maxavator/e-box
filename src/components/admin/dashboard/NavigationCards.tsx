
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Settings } from "lucide-react";

interface NavigationCardsProps {
  activeView: 'dashboard' | 'users' | 'organizations' | 'settings';
  onViewChange: (view: 'dashboard' | 'users' | 'organizations' | 'settings') => void;
}

export const NavigationCards = ({ activeView, onViewChange }: NavigationCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card 
        className={`hover:shadow-lg transition-shadow cursor-pointer ${
          activeView === 'users' ? 'border-primary' : ''
        }`}
        onClick={() => onViewChange('users')}
      >
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-primary" />
            <span>User Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 mb-4">Add, remove, and manage user access and permissions</p>
        </CardContent>
      </Card>

      <Card 
        className={`hover:shadow-lg transition-shadow cursor-pointer ${
          activeView === 'organizations' ? 'border-primary' : ''
        }`}
        onClick={() => onViewChange('organizations')}
      >
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-primary" />
            <span>Organizations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 mb-4">Manage organization settings and administrators</p>
        </CardContent>
      </Card>

      <Card 
        className={`hover:shadow-lg transition-shadow cursor-pointer ${
          activeView === 'settings' ? 'border-primary' : ''
        }`}
        onClick={() => onViewChange('settings')}
      >
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-primary" />
            <span>System Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 mb-4">Configure system-wide settings and preferences</p>
        </CardContent>
      </Card>
    </div>
  );
};
