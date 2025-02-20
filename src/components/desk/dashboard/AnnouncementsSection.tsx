
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone } from "lucide-react";

export const AnnouncementsSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-primary" />
          Announcements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
            <h3 className="font-semibold text-primary mb-1">New Office Location</h3>
            <p className="text-sm text-gray-600">We're excited to announce our new office location opening next month! Stay tuned for more details.</p>
            <p className="text-xs text-gray-500 mt-2">Posted 2 days ago</p>
          </div>
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
            <h3 className="font-semibold text-primary mb-1">Company Anniversary</h3>
            <p className="text-sm text-gray-600">Join us in celebrating our 5th year anniversary! Special events planned for next week.</p>
            <p className="text-xs text-gray-500 mt-2">Posted 5 days ago</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
