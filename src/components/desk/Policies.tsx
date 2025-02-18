
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Policies = () => {
  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization Policies</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            No policies have been set up yet. Policies will help you manage access and permissions across your organization.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
