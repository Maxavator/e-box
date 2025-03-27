
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Building, Shield, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { extractDateFromSAID } from "@/utils/saIdValidation";

interface UserSearchProps {
  onSelectUser: (user: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url?: string;
    organization_id?: string;
    job_title?: string;
    sa_id?: string;
    province?: string;
  }) => void;
  selectedUserId?: string;
}

export function UserSearch({ onSelectUser, selectedUserId }: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: allUsers = [], isLoading } = useQuery({
    queryKey: ['all-e-box-users'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get all users that have a profile and are not set to private
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, organization_id, job_title, sa_id, province, is_private')
        .neq('id', user.id) // Exclude current user
        .eq('is_private', false); // Only include users who are not private

      if (error) throw error;
      return data || [];
    }
  });

  const filteredUsers = allUsers.filter(user => {
    if (!searchQuery.trim()) return true;
    
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
    const jobTitle = (user.job_title || '').toLowerCase();
    const province = (user.province || '').toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    
    return fullName.includes(searchLower) || 
           jobTitle.includes(searchLower) || 
           province?.includes(searchLower);
  });

  // Function to extract and format the birth date from SA ID
  const formatBirthDate = (saId?: string) => {
    if (!saId) return 'N/A';
    try {
      const birthDate = extractDateFromSAID(saId);
      return birthDate ? birthDate.toLocaleDateString() : 'N/A';
    } catch (error) {
      return 'N/A';
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search e-Box users..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <ScrollArea className="h-[300px] pr-4">
        {isLoading ? (
          <div className="text-center py-4 text-muted-foreground">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No users found</div>
        ) : (
          <div className="space-y-2">
            {filteredUsers.map((user) => (
              <Button
                key={user.id}
                variant="ghost"
                className={`w-full justify-start ${user.id === selectedUserId ? 'bg-accent' : ''}`}
                onClick={() => onSelectUser(user)}
              >
                <div className="flex items-center w-full">
                  <Avatar className="h-9 w-9 mr-2">
                    <AvatarImage src={user.avatar_url || ''} />
                    <AvatarFallback>
                      {user.first_name?.[0]}{user.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">
                      {user.first_name} {user.last_name}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {user.province && (
                        <span className="flex items-center">
                          <Shield className="h-3 w-3 mr-1" />
                          {user.province}
                        </span>
                      )}
                      {user.sa_id && (
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Born: {formatBirthDate(user.sa_id)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-auto flex flex-col items-end gap-1">
                    <Badge variant="outline" className="bg-blue-50 text-blue-600">
                      <Building className="h-3 w-3 mr-1" />
                      {user.organization_id ? 'Organization Member' : 'e-Box User'}
                    </Badge>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
