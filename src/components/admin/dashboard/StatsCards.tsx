
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  UserPlus, Building2, MessagesSquare, 
  Settings, ArrowUpRight 
} from "lucide-react";

export const StatsCards = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value="2,834"
          change="+180"
          percentage="12"
          period="this month"
          icon={<UserPlus className="w-5 h-5 text-blue-600" />}
          color="blue"
        />
        <StatCard
          title="Active Organizations"
          value="147"
          change="+12"
          percentage="8"
          period="this month"
          icon={<Building2 className="w-5 h-5 text-purple-600" />}
          color="purple"
        />
        <StatCard
          title="Messages Sent"
          value="92.5k"
          change="+15.2k"
          percentage="24"
          period="this month"
          icon={<MessagesSquare className="w-5 h-5 text-amber-600" />}
          color="amber"
        />
        <StatCard
          title="System Uptime"
          value="99.9%"
          change="+0.2"
          percentage="0.2"
          period="Last 30 days"
          icon={<Settings className="w-5 h-5 text-green-600" />}
          color="green"
        />
      </div>
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
  color: "blue" | "purple" | "amber" | "green";
}

const StatCard = ({ title, value, change, percentage, period, icon, color }: StatCardProps) => {
  const getColorClasses = () => {
    switch (color) {
      case "blue":
        return {
          bg: "bg-blue-50",
          text: "text-blue-600",
          percentBg: "bg-blue-100"
        };
      case "purple":
        return {
          bg: "bg-purple-50",
          text: "text-purple-600",
          percentBg: "bg-purple-100"
        };
      case "amber":
        return {
          bg: "bg-amber-50",
          text: "text-amber-600",
          percentBg: "bg-amber-100"
        };
      case "green":
        return {
          bg: "bg-green-50",
          text: "text-green-600",
          percentBg: "bg-green-100"
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-600",
          percentBg: "bg-gray-100"
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <Card className={`${colorClasses.bg} border hover:shadow-sm transition-all`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${colorClasses.bg}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">{value}</div>
          <div className={`flex items-center text-green-500 text-sm ${colorClasses.percentBg} px-2 py-1 rounded-full`}>
            <ArrowUpRight className="w-3 h-3 mr-1" />
            {percentage}%
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{change} {period}</p>
      </CardContent>
    </Card>
  );
};
