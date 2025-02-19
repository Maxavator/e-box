
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, BarChart, Shield } from "lucide-react";

interface OverviewCardsProps {
  isAdmin: boolean;
}

export const OverviewCards = ({ isAdmin }: OverviewCardsProps) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-responsive">
            <Users className="h-5 w-5 text-primary" />
            <span>Team Members</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4 text-responsive">
            Manage your organization's members
          </p>
          <Button variant="outline" className="w-full">
            Manage Team
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-responsive">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span>Chat Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4 text-responsive">
            Monitor chat activity and usage
          </p>
          <Button variant="outline" className="w-full">
            View Activity
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-responsive">
            <BarChart className="h-5 w-5 text-primary" />
            <span>Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4 text-responsive">
            View organization analytics
          </p>
          <Button variant="outline" className="w-full">
            View Analytics
          </Button>
        </CardContent>
      </Card>

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-responsive">
              <Shield className="h-5 w-5 text-primary" />
              <span>Role Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-responsive">
              Manage user roles and permissions
            </p>
            <Button variant="outline" className="w-full">
              Manage Roles
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
};
