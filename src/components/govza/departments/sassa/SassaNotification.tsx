
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export const SassaNotification = () => {
  return (
    <Card className="bg-amber-50 border-amber-200 p-4 mb-6">
      <div className="flex items-center">
        <Calendar className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium">
            Social Relief of Distress (SRD) R350 Grant applications are open for the 2024/2025 financial year. Apply before 30 June 2024.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Check the official SASSA website for the latest updates on grant payment dates.
          </p>
        </div>
      </div>
    </Card>
  );
};
