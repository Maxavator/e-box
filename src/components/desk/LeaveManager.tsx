
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeaveBalances } from "./LeaveBalances";
import { Policies } from "./Policies";

interface LeaveManagerProps {
  defaultTab?: string;
}

export function LeaveManager({ defaultTab = 'leave' }: LeaveManagerProps) {
  return (
    <div className="w-full h-full">
      <TabsContent value="leave" forceMount hidden={defaultTab !== 'leave'}>
        <LeaveBalances />
      </TabsContent>
      <TabsContent value="policies" forceMount hidden={defaultTab !== 'policies'}>
        <Policies />
      </TabsContent>
    </div>
  );
}
