
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Users } from "lucide-react";

interface Group {
  id: string;
  name: string;
  is_public: boolean;
  avatar_url?: string;
}

interface GroupsTabProps {
  groups: Group[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoadingGroups: boolean;
  onSelectGroup: (group: Group) => void;
}

export function GroupsTab({
  groups,
  searchQuery,
  setSearchQuery,
  isLoadingGroups,
  onSelectGroup
}: GroupsTabProps) {
  const filteredGroups = groups.filter(group => {
    return group.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search groups..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-2">
          {isLoadingGroups ? (
            <div className="text-center text-muted-foreground py-4">
              Loading groups...
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No groups found
            </div>
          ) : (
            filteredGroups.map((group) => (
              <Button
                key={group.id}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => onSelectGroup(group)}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    {group.avatar_url ? (
                      <AvatarImage src={group.avatar_url} alt={group.name} />
                    ) : (
                      <AvatarFallback>
                        <Users className="h-4 w-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">
                      {group.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {group.is_public ? 'Public Group' : 'Private Group'}
                    </span>
                  </div>
                </div>
              </Button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
