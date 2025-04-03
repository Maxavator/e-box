
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Building, Users, Clock } from "lucide-react";
import { UserSearch } from "../UserSearch";
import { ColleaguesTab } from "./ColleaguesTab";
import { GroupsTab } from "./GroupsTab";
import { RecentContactsTab } from "./RecentContactsTab";

interface NewMessageTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectUser: (user: any) => void;
  onSelectColleague: (colleague: any) => void;
  onSelectGroup: (group: any) => void;
  onSelectRecent: (contact: any) => void;
  colleagues: any[];
  groups: any[];
  recentContacts: any[];
  isLoadingColleagues: boolean;
  isLoadingGroups: boolean;
  isLoadingRecents: boolean;
}

export function NewMessageTabs({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onSelectUser,
  onSelectColleague,
  onSelectGroup,
  onSelectRecent,
  colleagues,
  groups,
  recentContacts = [],
  isLoadingColleagues,
  isLoadingGroups,
  isLoadingRecents = false
}: NewMessageTabsProps) {
  return (
    <Tabs defaultValue="all-users" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="w-full">
        <TabsTrigger value="all-users" className="flex-1">
          <UserPlus className="h-4 w-4 mr-2" />
          All Users
        </TabsTrigger>
        <TabsTrigger value="colleagues" className="flex-1">
          <Building className="h-4 w-4 mr-2" />
          Colleagues
        </TabsTrigger>
        <TabsTrigger value="groups" className="flex-1">
          <Users className="h-4 w-4 mr-2" />
          Groups
        </TabsTrigger>
        <TabsTrigger value="recent" className="flex-1">
          <Clock className="h-4 w-4 mr-2" />
          Recent
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all-users">
        <UserSearch onSelectUser={onSelectUser} />
      </TabsContent>

      <TabsContent value="colleagues">
        <ColleaguesTab 
          colleagues={colleagues}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isLoadingColleagues={isLoadingColleagues}
          onSelectColleague={onSelectColleague}
        />
      </TabsContent>
      
      <TabsContent value="groups">
        <GroupsTab 
          groups={groups}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isLoadingGroups={isLoadingGroups}
          onSelectGroup={onSelectGroup}
        />
      </TabsContent>

      <TabsContent value="recent">
        <RecentContactsTab
          recentContacts={recentContacts}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isLoadingRecents={isLoadingRecents}
          onSelectRecent={onSelectRecent}
        />
      </TabsContent>
    </Tabs>
  );
}
