
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export const Settings = () => {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Settings content will be implemented later.</p>
        </CardContent>
      </Card>
    </div>
  );
};
