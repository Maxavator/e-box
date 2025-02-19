
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Globe } from "lucide-react";

interface OrganizationDetails {
  name: string;
  domain?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

interface OrganizationDetailsCardProps {
  orgDetails: OrganizationDetails;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const OrganizationDetailsCard = ({ orgDetails }: OrganizationDetailsCardProps) => {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-responsive">
          <Building2 className="h-5 w-5 text-primary" />
          <span>Organization Details</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Organization Name</h3>
            <p className="text-lg">{orgDetails.name}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Domain</h3>
            <p className="text-lg flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              {orgDetails.domain || 'Not set'}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Created</h3>
            <p className="text-lg">{formatDate(orgDetails.created_at)}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Last Updated</h3>
            <p className="text-lg">{formatDate(orgDetails.updated_at)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
