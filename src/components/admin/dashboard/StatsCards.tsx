
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  UserPlus, Building2, MessagesSquare, 
  Settings, ArrowUpRight 
} from "lucide-react";

export const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        title="Total Users"
        value="2,834"
        change="+180"
        percentage="12"
        period="this month"
        icon={<UserPlus className="w-4 h-4 text-gray-500" />}
      />
      <StatCard
        title="Active Organizations"
        value="147"
        change="+12"
        percentage="8"
        period="this month"
        icon={<Building2 className="w-4 h-4 text-gray-500" />}
      />
      <StatCard
        title="Messages Sent"
        value="92.5k"
        change="+15.2k"
        percentage="24"
        period="this month"
        icon={<MessagesSquare className="w-4 h-4 text-gray-500" />}
      />
      <StatCard
        title="System Uptime"
        value="99.9%"
        change="+0.2"
        percentage="0.2"
        period="Last 30 days"
        icon={<Settings className="w-4 h-4 text-gray-500" />}
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  percentage: string;
  period: string;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, change, percentage, period, icon }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-green-500 text-sm">
          <ArrowUpRight className="w-4 h-4 mr-1" />
          {percentage}%
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1">{change} {period}</p>
    </CardContent>
  </Card>
);
