
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalContacts } from "./tabs/PersonalContacts";
import { RetailPartners } from "./tabs/RetailPartners";
import { ContactGroups } from "./tabs/ContactGroups";
import { ContactInvites } from "./tabs/ContactInvites";
import { SearchContactForm } from "./forms/SearchContactForm";
import { Users, Store, UsersRound, Mail } from "lucide-react";
import { toast } from "sonner";

export const ContactsMain = () => {
  const [activeTab, setActiveTab] = useState("personal");
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleInviteSuccess = () => {
    toast.success("Invitation sent successfully");
    setActiveTab("invites");
  };

  return (
    <div className="p-4 md:p-6">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Contacts Directory</CardTitle>
          <CardDescription>
            Manage your contacts, groups, and retail partners - compliant with POPIA regulations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <SearchContactForm onInviteSuccess={handleInviteSuccess} />
          </div>
          
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Personal</span>
              </TabsTrigger>
              <TabsTrigger value="retail" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                <span>Retail Partners</span>
              </TabsTrigger>
              <TabsTrigger value="groups" className="flex items-center gap-2">
                <UsersRound className="h-4 w-4" />
                <span>Groups</span>
              </TabsTrigger>
              <TabsTrigger value="invites" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Invites</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
              <PersonalContacts />
            </TabsContent>
            
            <TabsContent value="retail">
              <RetailPartners />
            </TabsContent>
            
            <TabsContent value="groups">
              <ContactGroups />
            </TabsContent>
            
            <TabsContent value="invites">
              <ContactInvites />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
