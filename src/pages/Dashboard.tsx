
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, Building2, MessageSquare, ArrowUpRight, 
  Activity, LineChart, Clock, CheckCircle2,
  FileText, Calendar, User, Settings,
  MessageCircle
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NavigationCards } from "@/components/admin/dashboard/NavigationCards";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, userRole, isLoading } = useUserRole();
  const [userName, setUserName] = useState("User");
  const [lastUpdate, setLastUpdate] = useState("5 mins ago");

  const refreshData = () => {
    setLastUpdate("Just now");
    toast.success("Dashboard data refreshed");
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'documents':
        navigate('/documents');
        break;
      case 'calendar':
        navigate('/calendar');
        break;
      case 'messages':
        navigate('/chat');
        break;
      case 'profile':
        navigate('/profile');
        break;
      default:
        navigate(`/${action}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-background">
      <header className="h-16 bg-card border-b px-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {userName}
            {isAdmin && " (Admin)"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Last updated: {lastUpdate}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={refreshData}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Refresh Data
          </Button>
        </div>
      </header>

      <div className="p-8 space-y-8">
        {/* Stats Section */}
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

        {/* Admin Navigation Cards */}
        {isAdmin && (
          <div className="border-t pt-8">
            <h2 className="text-lg font-semibold mb-6">Admin Tools</h2>
            <NavigationCards />
          </div>
        )}

        {/* Quick Actions */}
        {!isAdmin && (
          <div>
            <h2 className="text-lg font-semibold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <QuickActionCard
                title="Documents"
                description="Access your files"
                icon={<FileText className="w-5 h-5" />}
                onClick={() => handleQuickAction('documents')}
              />
              <QuickActionCard
                title="Calendar"
                description="View schedule"
                icon={<Calendar className="w-5 h-5" />}
                onClick={() => handleQuickAction('calendar')}
              />
              <QuickActionCard
                title="Messages"
                description="Chat with team"
                icon={<MessageCircle className="w-5 h-5" />}
                onClick={() => handleQuickAction('messages')}
              />
              <QuickActionCard
                title="Profile"
                description="Update settings"
                icon={<User className="w-5 h-5" />}
                onClick={() => handleQuickAction('profile')}
              />
            </div>
          </div>
        )}

        {/* Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Activity Overview</CardTitle>
              <LineChart className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[300px] flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm font-medium">Active Users</span>
                  </div>
                  <span className="text-2xl font-bold">1,245</span>
                </div>
                <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                  Activity chart will be displayed here
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Recent Tasks</CardTitle>
              <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-6">
              <ScrollArea className="h-[300px] pr-4">
                {recentTasks.map((task, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors mb-2 cursor-pointer"
                  >
                    <div className={`w-2 h-2 mt-2 rounded-full ${task.statusColor}`} />
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">{task.time}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {task.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  period: string;
  icon: React.ReactNode;
  trend: string;
}

const StatsCard = ({ title, value, change, period, icon, trend }: StatsCardProps) => (
  <Card className="border shadow-sm hover:shadow-md transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-emerald-500 text-sm">
          <ArrowUpRight className="w-4 h-4 mr-1" />
          {trend}%
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-1">{change} {period}</p>
    </CardContent>
  </Card>
);

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const QuickActionCard = ({ title, description, icon, onClick }: QuickActionCardProps) => (
  <Card 
    className="cursor-pointer hover:shadow-md transition-shadow"
    onClick={onClick}
  >
    <CardHeader className="flex flex-row items-start gap-4 pb-2">
      <div className="p-2 bg-primary/10 rounded-lg">
        {icon}
      </div>
      <div>
        <CardTitle className="text-base">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </CardHeader>
  </Card>
);

const recentTasks = [
  {
    title: "System Update",
    description: "Deployed new security patches across all servers",
    time: "2 hours ago",
    category: "Maintenance",
    statusColor: "bg-emerald-500"
  },
  {
    title: "User Onboarding",
    description: "Added 25 new users from Acme Corp",
    time: "4 hours ago",
    category: "Users",
    statusColor: "bg-blue-500"
  },
  {
    title: "Database Backup",
    description: "Completed weekly backup of all production databases",
    time: "6 hours ago",
    category: "Database",
    statusColor: "bg-purple-500"
  },
  {
    title: "Performance Monitoring",
    description: "Reviewed system performance metrics",
    time: "8 hours ago",
    category: "Monitoring",
    statusColor: "bg-amber-500"
  },
  {
    title: "API Integration",
    description: "Updated third-party API integrations",
    time: "12 hours ago",
    category: "Development",
    statusColor: "bg-rose-500"
  }
];

export default Dashboard;
