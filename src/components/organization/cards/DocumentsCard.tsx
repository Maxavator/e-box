
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export const DocumentsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-responsive">
          <FileText className="h-5 w-5 text-primary" />
          <span>Documents</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Active Documents</p>
              <p className="text-2xl font-bold">45</p>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Last updated: 2 hours ago
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
