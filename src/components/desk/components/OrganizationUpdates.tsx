
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const announcements = [
  {
    id: "1",
    title: "Company Outing Next Month",
    description: "Join us for a team building event on May 20. RSVP by April 30.",
    date: "2 days ago",
    priority: "medium"
  },
  {
    id: "2",
    title: "New Expense System Rollout",
    description: "Training sessions will be held next week for the new expense management system.",
    date: "1 week ago",
    priority: "high"
  }
];

interface OrganizationUpdatesProps {
  organizationName: string | null;
}

export function OrganizationUpdates({ organizationName }: OrganizationUpdatesProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Organization Updates</CardTitle>
        <CardDescription>Latest updates from {organizationName || 'your organization'}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {organizationName ? (
            <>
              {announcements.map((announcement) => (
                <div key={announcement.id} className={`p-4 rounded-lg border ${
                  announcement.priority === 'high' ? 'bg-red-50 border-red-200' : 
                  announcement.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' : 
                  'bg-primary/5'
                }`}>
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium">{announcement.title}</h3>
                    <Badge variant={
                      announcement.priority === 'high' ? 'destructive' : 
                      announcement.priority === 'medium' ? 'default' : 
                      'outline'
                    }>
                      {announcement.priority === 'high' ? 'Important' : 
                       announcement.priority === 'medium' ? 'Announcement' : 
                       'Information'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {announcement.description}
                  </p>
                  <div className="text-xs text-muted-foreground mt-2">
                    Posted: {announcement.date}
                  </div>
                </div>
              ))}
              <div className="p-4 rounded-lg border bg-green-50">
                <h3 className="font-medium text-green-700">New Document Verification System</h3>
                <p className="text-sm text-green-600/80 mt-1">
                  All documents are now digitally signed and verified for authenticity.
                </p>
              </div>
            </>
          ) : (
            <div className="p-4 rounded-lg border bg-muted">
              <h3 className="font-medium">Connect to an organization</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Join an organization to see updates and access shared resources.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
