import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface NavigationCardsProps {
  activeView?: string;
  onViewChange?: (view: 'dashboard' | 'users' | 'organizations' | 'settings') => void;
}

export const NavigationCards = ({ 
  activeView, 
  onViewChange
}: NavigationCardsProps) => {
  const navigate = useNavigate();

  const handleCardClick = (view: 'dashboard' | 'users' | 'organizations' | 'settings') => {
    onViewChange?.(view);
    navigate('/admin', { state: { view } });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NavCard
        title="User Management"
        description="Add, remove, and manage user access and permissions"
        icon={<Users className="w-5 h-5 text-brand-600" />}
        isActive={activeView === 'users'}
        onClick={() => handleCardClick('users')}
      />
      <NavCard
        title="Organizations Management"
        description="Manage organization settings and administrators"
        icon={<Building2 className="w-5 h-5 text-brand-600" />}
        isActive={activeView === 'organizations'}
        onClick={() => handleCardClick('organizations')}
      />
      <NavCard
        title="System Settings"
        description="Configure system-wide settings and preferences"
        icon={<Settings className="w-5 h-5 text-brand-600" />}
        isActive={activeView === 'settings'}
        onClick={() => handleCardClick('settings')}
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
}

const NavCard = ({ title, description, icon, isActive, onClick }: NavCardProps) => (
  <Card 
    className={`hover:shadow-lg transition-shadow cursor-pointer ${
      isActive ? 'border-primary' : ''
    }`}
    onClick={onClick}
  >
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        {icon}
        <span>{title}</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-500 mb-4">{description}</p>
    </CardContent>
  </Card>
);
