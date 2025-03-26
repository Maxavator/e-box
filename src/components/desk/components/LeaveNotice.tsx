
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface LeaveNoticeProps {
  onDismiss: () => void;
}

export function LeaveNotice({ onDismiss }: LeaveNoticeProps) {
  const navigate = useNavigate();
  
  return (
    <Card className="mb-6 border-green-200 bg-green-50">
      <CardContent className="p-4 flex justify-between items-center">
        <div className="flex items-start gap-2">
          <Clock className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-green-800">Leave Request Approved</h3>
            <p className="text-sm text-green-700">Your request for April 15-18 has been approved by management.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/desk/leave")}>
            View
          </Button>
          <Button variant="outline" size="sm" onClick={onDismiss}>
            Dismiss
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
