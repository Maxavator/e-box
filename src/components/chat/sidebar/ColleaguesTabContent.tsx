
import { Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ColleagueItem } from "./ColleagueItem";

interface ColleagueData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url?: string;
  job_title?: string;
}

interface ColleaguesTabContentProps {
  searchQuery: string;
  colleagues: ColleagueData[];
  golderColleagues: ColleagueData[];
  isLoadingColleagues: boolean;
  isLoadingGolderColleagues: boolean;
  onStartConversation: (colleagueId: string) => void;
}

export function ColleaguesTabContent({
  searchQuery,
  colleagues,
  golderColleagues,
  isLoadingColleagues,
  isLoadingGolderColleagues,
  onStartConversation,
}: ColleaguesTabContentProps) {
  const filteredColleagues = colleagues.filter(colleague => {
    if (!searchQuery) return true;
    const name = `${colleague.first_name || ''} ${colleague.last_name || ''}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  const filteredGolderColleagues = golderColleagues.filter(colleague => {
    if (!searchQuery) return true;
    const name = `${colleague.first_name || ''} ${colleague.last_name || ''}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  if (isLoadingColleagues && isLoadingGolderColleagues) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Loading colleagues...
      </div>
    );
  }

  if (colleagues.length === 0 && golderColleagues.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No colleagues found in your organization
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4">
        {/* Organization Colleagues */}
        {filteredColleagues.length > 0 && (
          <div>
            <h3 className="font-medium text-sm mb-2 flex items-center">
              <Building className="h-4 w-4 mr-1" />
              Your Organization
            </h3>
            <div className="space-y-2">
              {filteredColleagues.map((colleague) => (
                <ColleagueItem 
                  key={colleague.id}
                  id={colleague.id}
                  firstName={colleague.first_name}
                  lastName={colleague.last_name}
                  avatarUrl={colleague.avatar_url}
                  jobTitle={colleague.job_title}
                  onClick={onStartConversation}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Golder Colleagues */}
        {filteredGolderColleagues.length > 0 && (
          <div>
            <h3 className="font-medium text-sm mb-2 flex items-center">
              <Building className="h-4 w-4 mr-1" />
              Golder (Pty) Ltd.
              <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
                Partner
              </Badge>
            </h3>
            <div className="space-y-2">
              {filteredGolderColleagues.map((colleague) => (
                <ColleagueItem 
                  key={colleague.id}
                  id={colleague.id}
                  firstName={colleague.first_name}
                  lastName={colleague.last_name}
                  avatarUrl={colleague.avatar_url}
                  jobTitle={colleague.job_title}
                  isPartner={true}
                  onClick={onStartConversation}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
