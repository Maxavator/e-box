
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  MessageSquare, 
  BarChart, 
  Shield, 
  FileText, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Building2
} from "lucide-react";

interface OverviewCardsProps {
  isAdmin: boolean;
}

export const OverviewCards = ({ isAdmin }: OverviewCardsProps) => {
  return (
    <>
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-responsive">
            <Building2 className="h-5 w-5 text-primary" />
            <span>Quick Stats</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Users className="h-4 w-4" />
                <h3 className="font-medium">Team Size</h3>
              </div>
              <p className="text-2xl font-bold">24</p>
              <p className="text-sm text-muted-foreground">Active members</p>
            </div>
            
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
              <div className="flex items-center gap-2 text-primary mb-2">
                <CheckCircle className="h-4 w-4" />
                <h3 className="font-medium">Tasks</h3>
              </div>
              <p className="text-2xl font-bold">85%</p>
              <p className="text-sm text-muted-foreground">Completion rate</p>
            </div>

            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
              <div className="flex items-center gap-2 text-primary mb-2">
                <MessageSquare className="h-4 w-4" />
                <h3 className="font-medium">Messages</h3>
              </div>
              <p className="text-2xl font-bold">156</p>
              <p className="text-sm text-muted-foreground">This month</p>
            </div>

            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
              <div className="flex items-center gap-2 text-primary mb-2">
                <AlertCircle className="h-4 w-4" />
                <h3 className="font-medium">Open Issues</h3>
              </div>
              <p className="text-2xl font-bold">8</p>
              <p className="text-sm text-muted-foreground">Requiring attention</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-responsive">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Calendar Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Upcoming Events</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Next event: Team Meeting (Tomorrow, 10:00 AM)
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-responsive">
            <FileText className="h-5 w-5 text-primary" />
            <span>Documents</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Active Documents</p>
                <p className="text-2xl font-bold">45</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Last updated: 2 hours ago
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-responsive">
            <Clock className="h-5 w-5 text-primary" />
            <span>Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Active Users</p>
                <p className="text-2xl font-bold">18</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Peak hours: 10 AM - 2 PM
            </div>
          </div>
        </CardContent>
      </Card>

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-responsive">
              <BarChart className="h-5 w-5 text-primary" />
              <span>Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">System Health</p>
                  <p className="text-2xl font-bold">98%</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                All systems operational
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-responsive">
              <Shield className="h-5 w-5 text-primary" />
              <span>Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Security Score</p>
                  <p className="text-2xl font-bold">A+</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Last scan: 24 hours ago
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};
