
import React from "react";
import { Users, Building2, MessageSquare, Activity } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { AdminToolsSection } from "./AdminToolsSection";
import { QuickActionsSection } from "./QuickActionsSection";
import { ActivityOverview } from "./ActivityOverview";
import { RecentTasksList } from "./RecentTasksList";

interface DashboardContentProps {
  isAdmin: boolean;
  navigate: (path: string, state?: any) => void;
  handleQuickAction: (action: string) => void;
  recentTasks: any[];
}

export const DashboardContent = ({ 
  isAdmin, 
  navigate, 
  handleQuickAction,
  recentTasks
}: DashboardContentProps) => {
  return (
    <div className="p-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value="2,834"
          change="+180"
          period="this month"
          icon={<Users className="w-4 h-4" />}
          trend="12"
        />
        <StatsCard
          title={isAdmin ? "Active Organizations" : "Team Members"}
          value={isAdmin ? "147" : "24"}
          change={isAdmin ? "+12" : "+3"}
          period="this month"
          icon={<Building2 className="w-4 h-4" />}
          trend="8"
        />
        <StatsCard
          title="Messages"
          value="92.5k"
          change="+15.2k"
          period="this month"
          icon={<MessageSquare className="w-4 h-4" />}
          trend="24"
        />
        <StatsCard
          title={isAdmin ? "System Uptime" : "Tasks Completed"}
          value={isAdmin ? "99.9%" : "85%"}
          change={isAdmin ? "+0.2" : "+15"}
          period="Last 30 days"
          icon={<Activity className="w-4 h-4" />}
          trend="0.2"
        />
      </div>

      {isAdmin && <AdminToolsSection navigate={navigate} />}
      {!isAdmin && <QuickActionsSection handleQuickAction={handleQuickAction} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityOverview />
        <RecentTasksList tasks={recentTasks} />
      </div>
    </div>
  );
};
