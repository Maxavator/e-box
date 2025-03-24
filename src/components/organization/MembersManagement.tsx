
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Search, UserPlus, Users } from "lucide-react";
import { OrganizationMembersTable } from "./OrganizationMembersTable";
import { useOrganizationMembers } from "@/hooks/useOrganizationMembers";
import { Badge } from "@/components/ui/badge";
import { useUserRole } from "@/components/admin/hooks/useUserRole";

export function MembersManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const { members, loading, error, refreshMembers } = useOrganizationMembers();
  const { userRole } = useUserRole();
  const isAdminOrModerator = 
    userRole === 'global_admin' || 
    userRole === 'org_admin' || 
    userRole === 'hr_moderator';

  // Filter members based on search query
  const filteredMembers = members.filter(member => {
    const fullName = `${member.first_name || ''} ${member.last_name || ''}`.toLowerCase();
    const email = member.email.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return fullName.includes(query) || email.includes(query);
  });

  const activeMembersCount = members.filter(member => member.last_activity).length;
  
  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-2xl font-bold">Organization Members</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage members of your organization
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={refreshMembers} title="Refresh member list">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            {isAdminOrModerator && (
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Member
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 items-center ml-4">
              <Badge variant="outline" className="flex gap-1.5 text-sm py-1">
                <Users className="h-3.5 w-3.5 text-primary" />
                Total: {members.length}
              </Badge>
              <Badge variant="outline" className="flex gap-1.5 text-sm py-1">
                <Users className="h-3.5 w-3.5 text-green-500" />
                Active: {activeMembersCount}
              </Badge>
            </div>
          </div>
          
          <OrganizationMembersTable 
            members={filteredMembers} 
            isLoading={loading} 
            isAdmin={isAdminOrModerator}
          />
        </CardContent>
      </Card>
    </div>
  );
}
