
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, CheckCircle, AlertCircle, Building2 } from "lucide-react";

export const QuickStatsCard = () => {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-responsive">
          <Building2 className="h-5 w-5 text-primary" />
          <span>Quick Stats</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox icon={<Users className="h-4 w-4" />} title="Team Size" value="24" subtitle="Active members" />
          <StatBox icon={<CheckCircle className="h-4 w-4" />} title="Tasks" value="85%" subtitle="Completion rate" />
          <StatBox icon={<MessageSquare className="h-4 w-4" />} title="Messages" value="156" subtitle="This month" />
          <StatBox icon={<AlertCircle className="h-4 w-4" />} title="Open Issues" value="8" subtitle="Requiring attention" />
        </div>
      </CardContent>
    </Card>
  );
};

interface StatBoxProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
}

const StatBox = ({ icon, title, value, subtitle }: StatBoxProps) => (
  <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
    <div className="flex items-center gap-2 text-primary mb-2">
      {icon}
      <h3 className="font-medium">{title}</h3>
    </div>
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-sm text-muted-foreground">{subtitle}</p>
  </div>
);
