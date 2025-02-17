
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeaveBalances } from "./LeaveBalances";
import { Policies } from "./Policies";

export function LeaveManager() {
  return (
    <Tabs defaultValue="leave" className="w-full h-full">
      <TabsList>
        <TabsTrigger value="leave">Leave Balances</TabsTrigger>
        <TabsTrigger value="policies">Policies</TabsTrigger>
      </TabsList>
      <TabsContent value="leave">
        <LeaveBalances />
      </TabsContent>
      <TabsContent value="policies">
        <Policies />
      </TabsContent>
    </Tabs>
  );
}
