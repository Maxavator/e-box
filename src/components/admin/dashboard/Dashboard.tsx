
import { Users, Building2, Settings, UserPlus, MessagesSquare } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { NavigationCard } from "./NavigationCard";

interface DashboardProps {
  onNavigate: (view: 'users' | 'organizations' | 'settings') => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Users"
          value="2,834"
          increase="12%"
          subtitle="+180 this month"
          icon={UserPlus}
        />
        <StatsCard
          title="Active Organizations"
          value="147"
          increase="8%"
          subtitle="+12 this month"
          icon={Building2}
        />
        <StatsCard
          title="Messages Sent"
          value="92.5k"
          increase="24%"
          subtitle="+15.2k this month"
          icon={MessagesSquare}
        />
        <StatsCard
          title="System Uptime"
          value="99.9%"
          increase="0.2%"
          subtitle="Last 30 days"
          icon={Settings}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NavigationCard
          title="User Management"
          description="Add, remove, and manage user access and permissions"
          icon={Users}
          onClick={() => onNavigate('users')}
        />
        <NavigationCard
          title="Organizations"
          description="Manage organization settings and administrators"
          icon={Building2}
          onClick={() => onNavigate('organizations')}
        />
        <NavigationCard
          title="System Settings"
          description="Configure system-wide settings and preferences"
          icon={Settings}
          onClick={() => onNavigate('settings')}
        />
      </div>
    </>
  );
};
