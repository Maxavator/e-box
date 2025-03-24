
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock, FileWarning, Flag, MessageSquare, ShieldAlert, User } from "lucide-react";
import { UserRoleType } from "@/types/supabase-types";

interface ModerationDashboardProps {
  userRole: string | undefined;
}

export function ModerationDashboard({ userRole }: ModerationDashboardProps) {
  // Get the moderation scope based on role
  const getScope = () => {
    switch(userRole) {
      case 'hr_moderator': return 'HR';
      case 'comm_moderator': return 'Communications';
      case 'stakeholder_moderator': return 'Stakeholder';
      default: return 'All';
    }
  };
  
  const scope = getScope();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title={`Pending ${scope === 'All' ? '' : scope} Items`} 
          value="12" 
          icon={<Clock className="h-5 w-5 text-amber-600" />} 
          description="Awaiting review"
          color="bg-amber-50" 
        />
        <StatCard 
          title={`Flagged ${scope === 'All' ? '' : scope} Content`} 
          value="5" 
          icon={<Flag className="h-5 w-5 text-red-600" />} 
          description="Requires attention"
          color="bg-red-50" 
        />
        <StatCard 
          title={`Approved ${scope === 'All' ? '' : scope} Items`} 
          value="83" 
          icon={<CheckCircle className="h-5 w-5 text-green-600" />} 
          description="This month"
          color="bg-green-50" 
        />
        <StatCard 
          title="Active Moderators" 
          value="3" 
          icon={<ShieldAlert className="h-5 w-5 text-blue-600" />} 
          description="Currently online"
          color="bg-blue-50" 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QueueSummaryCard scope={scope} />
        <RecentActivityCard scope={scope} />
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

function StatCard({ title, value, icon, description, color }: StatCardProps) {
  return (
    <Card className={`${color} border border-gray-200`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function QueueSummaryCard({ scope }: { scope: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{scope === 'All' ? 'Global' : scope} Queue Summary</CardTitle>
        <CardDescription>Content review status by type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2 text-blue-500" />
              <span>Chat Messages</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">3 pending</span>
              <span className="text-xs text-muted-foreground">(4 hours avg)</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileWarning className="h-4 w-4 mr-2 text-amber-500" />
              <span>Document Reports</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">5 pending</span>
              <span className="text-xs text-muted-foreground">(24 hours avg)</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-indigo-500" />
              <span>User Violations</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">2 pending</span>
              <span className="text-xs text-muted-foreground">(12 hours avg)</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
              <span>High Priority</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">2 pending</span>
              <span className="text-xs text-muted-foreground">(1 hour avg)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RecentActivityCard({ scope }: { scope: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Last 5 moderation actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            {
              action: "Approved document",
              user: "Thabo Nkosi",
              time: "10 minutes ago",
              detail: "Financial report April 2025"
            },
            {
              action: "Rejected message",
              user: "Sarah Johnson",
              time: "1 hour ago",
              detail: "Violation of communication policy"
            },
            {
              action: "Flagged content",
              user: "David Smith",
              time: "3 hours ago",
              detail: "Inappropriate language in chat"
            },
            {
              action: "Issued warning",
              user: "Lisa Wong",
              time: "Yesterday",
              detail: "Multiple policy violations"
            },
            {
              action: "Approved broadcast",
              user: "James Brown",
              time: "Yesterday",
              detail: "Company-wide announcement"
            }
          ].map((item, i) => (
            <div key={i} className="flex justify-between border-b pb-2 last:border-b-0 last:pb-0">
              <div>
                <p className="text-sm font-medium">{item.action}</p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium">{item.user}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
