
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeaveBalances } from "./LeaveBalances";
import { Policies } from "./Policies";
import { PartnerMessages } from "./PartnerMessages";

export function LeaveManager() {
  return (
    <Tabs defaultValue="leave" className="w-full h-full">
      <TabsList>
        <TabsTrigger value="leave">Leave Balances</TabsTrigger>
        <TabsTrigger value="policies">Policies</TabsTrigger>
        <TabsTrigger value="messages">Partner Messages</TabsTrigger>
      </TabsList>
      <TabsContent value="leave">
        <LeaveBalances />
      </TabsContent>
      <TabsContent value="policies">
        <Policies />
      </TabsContent>
      <TabsContent value="messages">
        <PartnerMessages />
      </TabsContent>
    </Tabs>
  );
}
