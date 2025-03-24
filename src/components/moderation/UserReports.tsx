
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserRoleType } from "@/types/supabase-types";
import { 
  AlertTriangle, 
  Ban, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Search,
  Flag,
  MessageSquare,
  Shield,
  UserX
} from "lucide-react";

interface UserReportsProps {
  userRole: string | undefined;
}

export function UserReports({ userRole }: UserReportsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<Record<string, string>>({});
  
  // Filter reports based on moderation role
  const filteredReports = userReports.filter(report => {
    // Apply search filter
    if (searchTerm && !report.reportedUser.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !report.reason.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply role filter
    if (userRole === 'hr_moderator' && report.category !== 'HR') {
      return false;
    }
    if (userRole === 'comm_moderator' && report.category !== 'Communication') {
      return false;
    }
    if (userRole === 'stakeholder_moderator' && report.category !== 'Stakeholder') {
      return false;
    }
    
    return true;
  });
  
  const handleAction = (id: string, action: 'dismiss' | 'warn' | 'suspend' | 'review') => {
    setStatus({
      ...status,
      [id]: action === 'dismiss' ? 'Dismissed' : 
            action === 'warn' ? 'Warning Issued' :
            action === 'suspend' ? 'User Suspended' : 'Under Review'
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>User Reports</CardTitle>
            <CardDescription>Manage reported users and content</CardDescription>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              className="pl-8 w-full md:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Reported User</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Reported By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "No reports match your search" : "No reports found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    {status[report.id] ? (
                      <Badge className={
                        status[report.id] === 'Dismissed' ? 'bg-gray-500' :
                        status[report.id] === 'Warning Issued' ? 'bg-amber-500' :
                        status[report.id] === 'User Suspended' ? 'bg-red-500' :
                        'bg-blue-500'
                      }>
                        {status[report.id]}
                      </Badge>
                    ) : (
                      <Badge className={
                        report.severity === 'Low' ? 'bg-green-500' :
                        report.severity === 'Medium' ? 'bg-amber-500' :
                        'bg-red-500'
                      }>
                        {report.severity}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{report.reportedUser}</TableCell>
                  <TableCell>{report.reason}</TableCell>
                  <TableCell>{report.category}</TableCell>
                  <TableCell>{report.reportedBy}</TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>
                    {!status[report.id] ? (
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Dismiss"
                          onClick={() => handleAction(report.id, 'dismiss')}
                        >
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Warn User"
                          onClick={() => handleAction(report.id, 'warn')}
                        >
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Suspend User"
                          onClick={() => handleAction(report.id, 'suspend')}
                        >
                          <Ban className="h-4 w-4 text-red-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Review Details"
                          onClick={() => handleAction(report.id, 'review')}
                        >
                          <Eye className="h-4 w-4 text-blue-500" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Action taken</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Sample data
const userReports = [
  {
    id: "1",
    reportedUser: "John Smith",
    reason: "Inappropriate comments in team chat",
    severity: "Medium",
    category: "Communication",
    reportedBy: "Sarah Johnson",
    date: "2 hours ago"
  },
  {
    id: "2",
    reportedUser: "Mike Williams",
    reason: "Sharing confidential information",
    severity: "High",
    category: "HR",
    reportedBy: "David Chen",
    date: "Yesterday"
  },
  {
    id: "3",
    reportedUser: "Lisa Wong",
    reason: "Unprofessional conduct in client meeting",
    severity: "Medium",
    category: "Stakeholder",
    reportedBy: "James Peterson",
    date: "2 days ago"
  },
  {
    id: "4",
    reportedUser: "Robert Johnson",
    reason: "Misuse of company resources",
    severity: "Low",
    category: "HR",
    reportedBy: "Emily Davis",
    date: "1 week ago"
  },
  {
    id: "5",
    reportedUser: "Amanda Miller",
    reason: "Disrespectful messages in public channel",
    severity: "Medium",
    category: "Communication",
    reportedBy: "Thomas Wilson",
    date: "1 week ago"
  }
];
