
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  BarChart as BarChartIcon,
  FileText,
  ChartBar,
  ChartLine,
  User,
  Settings,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminReporting() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <BarChartIcon className="h-5 w-5 text-primary" />
          Reporting & Analytics
        </CardTitle>
        <CardDescription>
          View detailed reports and analytics about your organization
        </CardDescription>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="users">
            <User className="h-4 w-4 mr-2" />
            User Analytics
          </TabsTrigger>
          <TabsTrigger value="activity">
            <ChartLine className="h-4 w-4 mr-2" />
            Activity Trends
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            Document Usage
          </TabsTrigger>
          <TabsTrigger value="system">
            <Settings className="h-4 w-4 mr-2" />
            System Report
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <UserReportContent />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <ActivityReportContent />
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <DocumentReportContent />
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <SystemReportContent />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

function UserReportContent() {
  const { data: userStats, isLoading } = useQuery({
    queryKey: ['user-report-stats'],
    queryFn: async () => {
      // Normally would fetch real data from Supabase
      // This is mock data for demonstration
      return {
        totalUsers: 2834,
        activeUsers: 1952,
        newUsersThisMonth: 180,
        usersPerOrg: [
          { name: "Golder (Pty) Ltd.", count: 742 },
          { name: "Department of Energy", count: 528 },
          { name: "Sasol", count: 412 },
          { name: "Eskom Holdings", count: 389 },
          { name: "South African Reserve Bank", count: 324 },
        ],
      };
    },
  });

  if (isLoading) {
    return <ReportSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard 
          title="Total Users" 
          value={userStats?.totalUsers.toLocaleString() || "0"} 
          change="+6.8%" 
          status="increase"
        />
        <MetricCard 
          title="Active Users" 
          value={userStats?.activeUsers.toLocaleString() || "0"} 
          change="+12.4%" 
          status="increase"
        />
        <MetricCard 
          title="New Users This Month" 
          value={userStats?.newUsersThisMonth.toLocaleString() || "0"} 
          change="+8.2%" 
          status="increase"
        />
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-4">Users Per Organization</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization Name</TableHead>
              <TableHead className="text-right">User Count</TableHead>
              <TableHead className="text-right">% of Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userStats?.usersPerOrg.map((org) => (
              <TableRow key={org.name}>
                <TableCell className="font-medium">{org.name}</TableCell>
                <TableCell className="text-right">{org.count}</TableCell>
                <TableCell className="text-right">
                  {((org.count / userStats.totalUsers) * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
}

function ActivityReportContent() {
  const { data: activityStats, isLoading } = useQuery({
    queryKey: ['activity-report-stats'],
    queryFn: async () => {
      // Mock data for demonstration
      return {
        totalMessages: 92500,
        messagesSentToday: 4256,
        activeConversations: 1872,
        topActiveUsers: [
          { name: "Thabo Nkosi", count: 256 },
          { name: "Sarah van der Merwe", count: 215 },
          { name: "Johan Pretorius", count: 189 },
          { name: "Lerato Molefe", count: 176 },
          { name: "Ahmed Khan", count: 152 },
        ],
      };
    },
  });

  if (isLoading) {
    return <ReportSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard 
          title="Total Messages" 
          value={activityStats?.totalMessages.toLocaleString() || "0"} 
          change="+24.3%" 
          status="increase"
        />
        <MetricCard 
          title="Messages Today" 
          value={activityStats?.messagesSentToday.toLocaleString() || "0"} 
          change="+18.7%" 
          status="increase"
        />
        <MetricCard 
          title="Active Conversations" 
          value={activityStats?.activeConversations.toLocaleString() || "0"} 
          change="+15.2%" 
          status="increase"
        />
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-4">Most Active Users</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead className="text-right">Message Count</TableHead>
              <TableHead className="text-right">Activity Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activityStats?.topActiveUsers.map((user) => (
              <TableRow key={user.name}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-right">{user.count}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end">
                    <div className="h-2 w-24 bg-gray-200 rounded-full mr-2">
                      <div 
                        className="h-2 bg-green-500 rounded-full" 
                        style={{ width: `${(user.count / 256) * 100}%` }}
                      />
                    </div>
                    {((user.count / 256) * 100).toFixed(0)}%
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
}

function DocumentReportContent() {
  const { data: documentStats, isLoading } = useQuery({
    queryKey: ['document-report-stats'],
    queryFn: async () => {
      // Mock data for demonstration
      return {
        totalDocuments: 12458,
        documentsUploaded: 875,
        storageUsed: "128.4 GB",
        documentsByCategory: [
          { category: "Reports", count: 4258 },
          { category: "Policies", count: 2431 },
          { category: "Templates", count: 1876 },
          { category: "Forms", count: 1654 },
          { category: "Contracts", count: 1329 },
        ],
      };
    },
  });

  if (isLoading) {
    return <ReportSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard 
          title="Total Documents" 
          value={documentStats?.totalDocuments.toLocaleString() || "0"} 
          change="+14.2%" 
          status="increase"
        />
        <MetricCard 
          title="Documents This Month" 
          value={documentStats?.documentsUploaded.toLocaleString() || "0"} 
          change="+9.5%" 
          status="increase"
        />
        <MetricCard 
          title="Storage Used" 
          value={documentStats?.storageUsed || "0"} 
          change="+7.8%" 
          status="increase"
        />
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-4">Documents By Category</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Document Count</TableHead>
              <TableHead className="text-right">% of Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documentStats?.documentsByCategory.map((category) => (
              <TableRow key={category.category}>
                <TableCell className="font-medium">{category.category}</TableCell>
                <TableCell className="text-right">{category.count}</TableCell>
                <TableCell className="text-right">
                  {((category.count / documentStats.totalDocuments) * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
}

function SystemReportContent() {
  const { data: systemStats, isLoading } = useQuery({
    queryKey: ['system-report-stats'],
    queryFn: async () => {
      // Mock data for demonstration
      return {
        uptime: "99.98%",
        responseTime: "238ms",
        errorRate: "0.02%",
        systemAlerts: [
          { type: "Performance", message: "API response time improved by 12%", severity: "success" },
          { type: "Security", message: "34 failed login attempts detected", severity: "warning" },
          { type: "Storage", message: "Backup completed successfully", severity: "success" },
          { type: "Database", message: "Query performance optimization completed", severity: "success" },
          { type: "Network", message: "CDN traffic increased by 25%", severity: "info" },
        ],
      };
    },
  });

  if (isLoading) {
    return <ReportSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard 
          title="System Uptime" 
          value={systemStats?.uptime || "0"} 
          change="+0.2%" 
          status="increase"
        />
        <MetricCard 
          title="Response Time" 
          value={systemStats?.responseTime || "0"} 
          change="-12%" 
          status="decrease"
          decreaseIsGood
        />
        <MetricCard 
          title="Error Rate" 
          value={systemStats?.errorRate || "0"} 
          change="-0.01%" 
          status="decrease"
          decreaseIsGood
        />
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-4">System Alerts</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {systemStats?.systemAlerts.map((alert, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{alert.type}</TableCell>
                <TableCell>{alert.message}</TableCell>
                <TableCell className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs 
                    ${alert.severity === 'success' ? 'bg-green-100 text-green-800' : 
                      alert.severity === 'warning' ? 'bg-amber-100 text-amber-800' : 
                      'bg-blue-100 text-blue-800'}`}>
                    {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  status: 'increase' | 'decrease';
  decreaseIsGood?: boolean;
}

function MetricCard({ title, value, change, status, decreaseIsGood = false }: MetricCardProps) {
  const isPositive = (status === 'increase' && !decreaseIsGood) || (status === 'decrease' && decreaseIsGood);
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold">{value}</h3>
            <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {change}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ReportSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Separator />
      
      <Skeleton className="h-6 w-48 mb-6" />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center space-x-4 mb-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-16 ml-auto" />
        </div>
      ))}
    </div>
  );
}
