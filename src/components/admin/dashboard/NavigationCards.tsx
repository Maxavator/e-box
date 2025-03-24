
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Settings, Shield, Server } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface NavigationCardsProps {
  activeView?: string;
  onViewChange?: (view: 'dashboard' | 'users' | 'organizations' | 'settings' | 'system') => void;
}

export const NavigationCards = ({ 
  activeView, 
  onViewChange
}: NavigationCardsProps) => {
  const navigate = useNavigate();

  const handleCardClick = (view: 'dashboard' | 'users' | 'organizations' | 'settings' | 'system') => {
    onViewChange?.(view);
    navigate('/admin', { state: { view } });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <NavCard
        title="User Management"
        description="Add, remove, and manage user access and permissions"
        icon={<Users className="w-5 h-5" />}
        isActive={activeView === 'users'}
        onClick={() => handleCardClick('users')}
        color="blue"
      />
      <NavCard
        title="Organizations Management"
        description="Manage organization settings and administrators"
        icon={<Building2 className="w-5 h-5" />}
        isActive={activeView === 'organizations'}
        onClick={() => handleCardClick('organizations')}
        color="purple"
      />
      <NavCard
        title="System Settings"
        description="Configure system-wide settings and preferences"
        icon={<Settings className="w-5 h-5" />}
        isActive={activeView === 'settings'}
        onClick={() => handleCardClick('settings')}
        color="amber"
      />
      <NavCard
        title="System Information"
        description="Monitor server status, database metrics, and system health"
        icon={<Server className="w-5 h-5" />}
        isActive={activeView === 'system'}
        onClick={() => handleCardClick('system')}
        color="green"
      />
    </div>
  );
};

interface NavCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  color: "blue" | "purple" | "amber" | "green";
}

const NavCard = ({ title, description, icon, isActive, onClick, color }: NavCardProps) => {
  const getColorClasses = () => {
    switch (color) {
      case "blue":
        return {
          bg: "bg-blue-50 hover:bg-blue-100",
          icon: "text-blue-600 bg-blue-100",
          border: isActive ? "border-blue-500" : ""
        };
      case "purple":
        return {
          bg: "bg-purple-50 hover:bg-purple-100",
          icon: "text-purple-600 bg-purple-100",
          border: isActive ? "border-purple-500" : ""
        };
      case "amber":
        return {
          bg: "bg-amber-50 hover:bg-amber-100",
          icon: "text-amber-600 bg-amber-100",
          border: isActive ? "border-amber-500" : ""
        };
      case "green":
        return {
          bg: "bg-green-50 hover:bg-green-100",
          icon: "text-green-600 bg-green-100",
          border: isActive ? "border-green-500" : ""
        };
      default:
        return {
          bg: "bg-gray-50 hover:bg-gray-100",
          icon: "text-gray-600 bg-gray-100",
          border: isActive ? "border-gray-500" : ""
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <Card 
      className={`hover:shadow-md transition-all cursor-pointer border ${
        isActive ? `border-2 ${colorClasses.border} ring-1 ring-primary/30` : 'border-border'
      } ${colorClasses.bg}`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colorClasses.icon}`}>
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};
