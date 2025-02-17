
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeaveBalances } from "./LeaveBalances";
import { Policies } from "./Policies";
import { PostBox } from "./PostBox";

export function LeaveManager() {
  return (
    <Tabs defaultValue="leave" className="w-full h-full">
      <TabsList>
        <TabsTrigger value="leave">Leave Balances</TabsTrigger>
        <TabsTrigger value="policies">Policies</TabsTrigger>
        <TabsTrigger value="messages">Post Box</TabsTrigger>
      </TabsList>
      <TabsContent value="leave">
        <LeaveBalances />
      </TabsContent>
      <TabsContent value="policies">
        <Policies />
      </TabsContent>
      <TabsContent value="messages">
        <PostBox />
      </TabsContent>
    </Tabs>
  );
}
