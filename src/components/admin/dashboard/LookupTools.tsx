
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { UserWithRole } from "@/components/admin/types";
import type { Organization } from "@/types/database";

export const LookupTools = () => {
  const [userQuery, setUserQuery] = useState("");
  const [orgQuery, setOrgQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUserLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles (role),
          organizations (name)
        `)
        .or(`first_name.ilike.%${userQuery}%,last_name.ilike.%${userQuery}%,id.ilike.%${userQuery}%`)
        .limit(5);

      if (error) throw error;

      if (data.length === 0) {
        toast.info("No users found matching your search");
      } else {
        // Using a safer type approach
        const formattedResults = data.map(user => ({
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
          email: user.id,
          role: Array.isArray(user.user_roles) && user.user_roles[0]?.role 
            ? user.user_roles[0].role 
            : 'N/A',
          organization: Array.isArray(user.organizations) && user.organizations[0]?.name 
            ? user.organizations[0].name 
            : 'N/A'
        }));
        
        toast.success(`Found ${data.length} user(s)`, {
          description: (
            <div className="mt-2 space-y-2">
              {formattedResults.map((result, i) => (
                <div key={i} className="text-sm border-b pb-2">
                  <div className="font-semibold">{result.name}</div>
                  <div className="text-xs text-gray-500">
                    {result.email} | {result.role} | {result.organization}
                  </div>
                </div>
              ))}
            </div>
          )
        });
      }
    } catch (error: any) {
      toast.error("Error looking up user: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrgLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgQuery.trim()) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select(`
          id,
          name,
          domain,
          profiles (id)
        `)
        .ilike('name', `%${orgQuery}%`)
        .limit(5);

      if (error) throw error;

      if (data.length === 0) {
        toast.info("No organizations found matching your search");
      } else {
        const formattedResults = data.map(org => ({
          name: org.name || 'N/A',
          domain: org.domain || 'N/A',
          memberCount: Array.isArray(org.profiles) ? org.profiles.length : 0
        }));

        toast.success(`Found ${data.length} organization(s)`, {
          description: (
            <div className="mt-2 space-y-2">
              {formattedResults.map((result, i) => (
                <div key={i} className="text-sm border-b pb-2">
                  <div className="font-semibold">{result.name}</div>
                  <div className="text-xs text-gray-500">
                    Domain: {result.domain} | Members: {result.memberCount}
                  </div>
                </div>
              ))}
            </div>
          )
        });
      }
    } catch (error: any) {
      toast.error("Error looking up organization: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick User Lookup</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUserLookup} className="flex gap-2">
            <Input
              placeholder="Search by name or email..."
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Organization Lookup</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleOrgLookup} className="flex gap-2">
            <Input
              placeholder="Search by organization name..."
              value={orgQuery}
              onChange={(e) => setOrgQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
