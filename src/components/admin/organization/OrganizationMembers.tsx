
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, Mail } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { UserRole } from "@/types/database";

interface OrganizationMembersProps {
  organizationId: string;
}

interface Member {
  id: string;
  first_name: string | null;
  last_name: string | null;
  user_roles: UserRole[];
}

export const OrganizationMembers = ({ organizationId }: OrganizationMembersProps) => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  
  const queryClient = useQueryClient();

  const { data: members, isLoading } = useQuery({
    queryKey: ['organization-members', organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          user_roles!inner (
            role
          )
        `)
        .eq('organization_id', organizationId);

      if (error) throw error;
      return data as Member[];
    },
  });

  const inviteMutation = useMutation({
    mutationFn: async (email: string) => {
      // In a real app, you would send an invitation email here
      toast.success(`Invitation sent to ${email}`);
      setIsInviteOpen(false);
      setInviteEmail("");
    },
    onError: (error) => {
      toast.error(`Failed to send invitation: ${error.message}`);
    },
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    inviteMutation.mutate(inviteEmail);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Organization Members</CardTitle>
          <Button onClick={() => setIsInviteOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    Loading members...
                  </TableCell>
                </TableRow>
              ) : members?.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    {member.first_name} {member.last_name}
                  </TableCell>
                  <TableCell>
                    {member.user_roles[0]?.role || 'Staff'}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Mail className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@example.com"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Send Invitation
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
