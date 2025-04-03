
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RecentContact {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  avatar_url?: string;
  last_contact?: string;
}

interface RecentContactsTabProps {
  recentContacts: RecentContact[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoadingRecents: boolean;
  onSelectRecent: (contact: RecentContact) => void;
}

export function RecentContactsTab({
  recentContacts,
  searchQuery,
  setSearchQuery,
  isLoadingRecents,
  onSelectRecent
}: RecentContactsTabProps) {
  const filteredContacts = recentContacts.filter(contact => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = `${contact.first_name || ''} ${contact.last_name || ''}`.toLowerCase();
    return fullName.includes(searchLower);
  });

  const formatContactTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search recent contacts..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-2">
          {isLoadingRecents ? (
            <div className="text-center text-muted-foreground py-4">
              Loading recent contacts...
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No recent contacts found
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <Button
                key={contact.id}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => onSelectRecent(contact)}
              >
                <div className="flex items-center gap-3 w-full">
                  <Avatar>
                    {contact.avatar_url ? (
                      <AvatarImage src={contact.avatar_url} alt={`${contact.first_name} ${contact.last_name}`} />
                    ) : (
                      <AvatarFallback>
                        {`${contact.first_name?.[0] || ''}${contact.last_name?.[0] || ''}`}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">
                      {`${contact.first_name || ''} ${contact.last_name || ''}`}
                    </span>
                    {contact.last_contact && (
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatContactTime(contact.last_contact)}
                      </span>
                    )}
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
