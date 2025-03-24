
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Check, Flag, X, Clock, AlertTriangle, Filter } from "lucide-react";
import { UserRoleType } from "@/types/supabase-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContentQueueProps {
  userRole: string | undefined;
}

export function ContentQueue({ userRole }: ContentQueueProps) {
  const [filter, setFilter] = useState("all");
  const moderation = getModerationScope(userRole);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
            <div>
              <CardTitle>Content Moderation Queue</CardTitle>
              <CardDescription>Review and approve content</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Content</SelectItem>
                  <SelectItem value="flagged">Flagged Only</SelectItem>
                  <SelectItem value="reported">User Reported</SelectItem>
                  <SelectItem value="messages">Messages</SelectItem>
                  <SelectItem value="documents">Documents</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending" className="relative">
                Pending
                <Badge className="ml-2 bg-amber-500 text-white text-[10px] h-4 min-w-4 flex items-center justify-center rounded-full">12</Badge>
              </TabsTrigger>
              <TabsTrigger value="flagged" className="relative">
                Flagged
                <Badge className="ml-2 bg-red-500 text-white text-[10px] h-4 min-w-4 flex items-center justify-center rounded-full">5</Badge>
              </TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending" className="p-0">
              <div className="space-y-4">
                {pendingItems
                  .filter(item => filterContentItem(item, filter, moderation))
                  .map((item, index) => (
                    <ContentItem 
                      key={index} 
                      item={item} 
                      showApproveReject={true} 
                    />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="flagged" className="p-0">
              <div className="space-y-4">
                {flaggedItems
                  .filter(item => filterContentItem(item, filter, moderation))
                  .map((item, index) => (
                    <ContentItem 
                      key={index} 
                      item={item} 
                      showApproveReject={true} 
                    />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="approved" className="p-0">
              <div className="space-y-4">
                {approvedItems
                  .filter(item => filterContentItem(item, filter, moderation))
                  .map((item, index) => (
                    <ContentItem 
                      key={index} 
                      item={item} 
                      showApproveReject={false} 
                    />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="rejected" className="p-0">
              <div className="space-y-4">
                {rejectedItems
                  .filter(item => filterContentItem(item, filter, moderation))
                  .map((item, index) => (
                    <ContentItem 
                      key={index} 
                      item={item} 
                      showApproveReject={false} 
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

interface ContentItem {
  id: string;
  type: 'message' | 'document' | 'report' | 'broadcast';
  title: string;
  content: string;
  submittedBy: string;
  timestamp: string;
  status: 'pending' | 'flagged' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  category: 'hr' | 'communication' | 'stakeholder' | 'general';
}

function ContentItem({ item, showApproveReject }: { item: ContentItem, showApproveReject: boolean }) {
  const [status, setStatus] = useState(item.status);
  
  const handleApprove = () => {
    setStatus('approved');
    // Here you would typically call an API to update the status
  };
  
  const handleReject = () => {
    setStatus('rejected');
    // Here you would typically call an API to update the status
  };
  
  return (
    <div className="border rounded-md p-4 space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-medium">{item.title}</h3>
            {item.status === 'flagged' && (
              <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Flagged</Badge>
            )}
            {item.priority === 'high' && (
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">High Priority</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {getItemTypeIcon(item.type)} {item.type.charAt(0).toUpperCase() + item.type.slice(1)} · {item.category.charAt(0).toUpperCase() + item.category.slice(1)} · Submitted by {item.submittedBy} · {item.timestamp}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {status === 'pending' && <Clock className="h-4 w-4 text-amber-500" />}
          {status === 'flagged' && <Flag className="h-4 w-4 text-red-500" />}
          {status === 'approved' && <Check className="h-4 w-4 text-green-500" />}
          {status === 'rejected' && <X className="h-4 w-4 text-gray-500" />}
          <span className="text-sm">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
        </div>
      </div>
      
      <p className="text-sm whitespace-pre-line">{item.content}</p>
      
      {showApproveReject && status !== 'approved' && status !== 'rejected' && (
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={handleReject}>
            <X className="h-4 w-4 mr-2" />
            Reject
          </Button>
          <Button size="sm" onClick={handleApprove}>
            <Check className="h-4 w-4 mr-2" />
            Approve
          </Button>
        </div>
      )}
    </div>
  );
}

function getItemTypeIcon(type: string) {
  switch(type) {
    case 'message': return '💬';
    case 'document': return '📄';
    case 'report': return '🚩';
    case 'broadcast': return '📢';
    default: return '📝';
  }
}

function getModerationScope(userRole: string | undefined) {
  switch(userRole) {
    case 'hr_moderator': return 'hr';
    case 'comm_moderator': return 'communication';
    case 'stakeholder_moderator': return 'stakeholder';
    default: return 'all';
  }
}

function filterContentItem(item: ContentItem, filter: string, moderation: string) {
  // First filter by moderation scope
  if (moderation !== 'all' && item.category !== moderation) {
    return false;
  }
  
  // Then filter by content type/status
  switch(filter) {
    case 'flagged': return item.status === 'flagged';
    case 'reported': return item.type === 'report';
    case 'messages': return item.type === 'message';
    case 'documents': return item.type === 'document';
    default: return true;
  }
}

// Sample data
const pendingItems: ContentItem[] = [
  {
    id: "1",
    type: 'message',
    title: 'Chat message in #general',
    content: 'I think we should consider alternative approaches to this problem. The current solution isn\'t optimal.',
    submittedBy: 'Jane Doe',
    timestamp: '20 minutes ago',
    status: 'pending',
    priority: 'low',
    category: 'communication'
  },
  {
    id: "2",
    type: 'document',
    title: 'Financial report Q1 2025',
    content: 'Quarterly financial report for shareholders review',
    submittedBy: 'John Smith',
    timestamp: '1 hour ago',
    status: 'pending',
    priority: 'medium',
    category: 'stakeholder'
  },
  {
    id: "3",
    type: 'broadcast',
    title: 'Company restructuring announcement',
    content: 'We are pleased to announce the following changes to our organizational structure...',
    submittedBy: 'HR Department',
    timestamp: '2 hours ago',
    status: 'pending',
    priority: 'high',
    category: 'hr'
  }
];

const flaggedItems: ContentItem[] = [
  {
    id: "4",
    type: 'message',
    title: 'Message in #project-alpha',
    content: 'This message was flagged for potentially inappropriate content.',
    submittedBy: 'Alex Johnson',
    timestamp: '30 minutes ago',
    status: 'flagged',
    priority: 'high',
    category: 'communication'
  },
  {
    id: "5",
    type: 'report',
    title: 'User behavior report',
    content: 'Multiple users have reported concerning behavior from this account.',
    submittedBy: 'System',
    timestamp: '3 hours ago',
    status: 'flagged',
    priority: 'high',
    category: 'hr'
  }
];

const approvedItems: ContentItem[] = [
  {
    id: "6",
    type: 'document',
    title: 'Updated company policy',
    content: 'The new employee handbook with updated policies for remote work.',
    submittedBy: 'Policy Team',
    timestamp: 'Yesterday',
    status: 'approved',
    priority: 'medium',
    category: 'hr'
  },
  {
    id: "7",
    type: 'broadcast',
    title: 'New client announcement',
    content: 'We are excited to announce our new partnership with XYZ Corporation.',
    submittedBy: 'Marketing',
    timestamp: '2 days ago',
    status: 'approved',
    priority: 'low',
    category: 'stakeholder'
  }
];

const rejectedItems: ContentItem[] = [
  {
    id: "8",
    type: 'message',
    title: 'Chat message in #support',
    content: 'This message was rejected for violating community guidelines.',
    submittedBy: 'User123',
    timestamp: 'Yesterday',
    status: 'rejected',
    priority: 'medium',
    category: 'communication'
  },
  {
    id: "9",
    type: 'document',
    title: 'Draft press release',
    content: 'The draft was rejected due to inaccurate information.',
    submittedBy: 'PR Team',
    timestamp: '3 days ago',
    status: 'rejected',
    priority: 'low',
    category: 'stakeholder'
  }
];
