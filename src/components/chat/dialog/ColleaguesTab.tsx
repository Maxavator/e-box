
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Building } from "lucide-react";

interface ColleagueProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url?: string;
  organization_id: string | null;
  job_title?: string;
}

interface ColleaguesTabProps {
  colleagues: ColleagueProfile[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoadingColleagues: boolean;
  onSelectColleague: (colleague: ColleagueProfile) => void;
}

export function ColleaguesTab({
  colleagues,
  searchQuery,
  setSearchQuery,
  isLoadingColleagues,
  onSelectColleague
}: ColleaguesTabProps) {
  const filteredColleagues = colleagues.filter(colleague => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = `${colleague.first_name} ${colleague.last_name}`.toLowerCase();
    const jobTitle = colleague.job_title?.toLowerCase() || '';
    return fullName.includes(searchLower) || jobTitle.includes(searchLower);
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search colleagues..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-2">
          {isLoadingColleagues ? (
            <div className="text-center text-muted-foreground py-4">
              Loading colleagues...
            </div>
          ) : filteredColleagues.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No colleagues found
            </div>
          ) : (
            filteredColleagues.map((colleague) => (
              <Button
                key={colleague.id}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => onSelectColleague(colleague)}
              >
                <div className="flex items-center gap-3 w-full">
                  <Avatar>
                    {colleague.avatar_url ? (
                      <AvatarImage src={colleague.avatar_url} alt={`${colleague.first_name} ${colleague.last_name}`} />
                    ) : (
                      <AvatarFallback>
                        {`${colleague.first_name?.[0] || ''}${colleague.last_name?.[0] || ''}`}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">
                      {`${colleague.first_name} ${colleague.last_name}`}
                    </span>
                    {colleague.job_title && (
                      <span className="text-xs text-muted-foreground">
                        {colleague.job_title}
                      </span>
                    )}
                  </div>
                  <Badge variant="outline" className="ml-auto bg-blue-50 text-blue-600">
                    <Building className="h-3 w-3 mr-1" />
                    Colleague
                  </Badge>
                </div>
              </Button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
