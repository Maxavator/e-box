
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface OrganizationPoliciesProps {
  organizationId: string;
}

export const OrganizationPolicies = ({ organizationId }: OrganizationPoliciesProps) => {
  const [allowGuests, setAllowGuests] = useState(false);
  const [requireApproval, setRequireApproval] = useState(true);
  const [policy, setPolicy] = useState("");

  const updatePoliciesMutation = useMutation({
    mutationFn: async () => {
      // In a real app, you would save these policies to the database
      toast.success("Policies updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update policies: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePoliciesMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Organization Policies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-guests">Allow Guest Access</Label>
              <p className="text-sm text-muted-foreground">
                Allow members to invite guests to specific resources
              </p>
            </div>
            <Switch
              id="allow-guests"
              checked={allowGuests}
              onCheckedChange={setAllowGuests}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="require-approval">Require Approval</Label>
              <p className="text-sm text-muted-foreground">
                Require admin approval for new member invitations
              </p>
            </div>
            <Switch
              id="require-approval"
              checked={requireApproval}
              onCheckedChange={setRequireApproval}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="policy">Organization Policy</Label>
            <Textarea
              id="policy"
              value={policy}
              onChange={(e) => setPolicy(e.target.value)}
              placeholder="Enter your organization's policy here..."
              rows={6}
            />
          </div>

          <Button type="submit" className="w-full">
            Save Policies
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};
