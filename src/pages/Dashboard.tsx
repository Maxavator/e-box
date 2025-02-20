
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, Building2, MessageSquare, ArrowUpRight, 
  Activity, LineChart, Clock, CheckCircle2 
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const Dashboard = () => {
  return (
    <div className="flex-1 min-h-screen bg-background">
      <header className="h-16 bg-card border-b px-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, John</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Last updated: 5 mins ago</span>
          </div>
          <button className="text-sm text-primary hover:text-primary/80 transition-colors">
            Refresh Data
          </button>
        </div>
      </header>

      <div className="p-8">
        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Users"
            value="2,834"
            change="+180"
            period="this month"
            icon={<Users className="w-4 h-4" />}
            trend="12"
          />
          <StatsCard
            title="Active Organizations"
            value="147"
            change="+12"
            period="this month"
            icon={<Building2 className="w-4 h-4" />}
            trend="8"
          />
          <StatsCard
            title="Messages Sent"
            value="92.5k"
            change="+15.2k"
            period="this month"
            icon={<MessageSquare className="w-4 h-4" />}
            trend="24"
          />
          <StatsCard
            title="System Uptime"
            value="99.9%"
            change="+0.2"
            period="Last 30 days"
            icon={<Activity className="w-4 h-4" />}
            trend="0.2"
          />
        </div>

        {/* Activity Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">User Activity</CardTitle>
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
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors mb-2"
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
