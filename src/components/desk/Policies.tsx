
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Policies() {
  return (
    <div className="p-6">
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">No policies available.</p>
        </Card>
      </ScrollArea>
    </div>
  );
}
