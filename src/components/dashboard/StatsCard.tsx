
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  period: string;
  icon: React.ReactNode;
  trend: string;
}

export const StatsCard = ({ title, value, change, period, icon, trend }: StatsCardProps) => (
  <Card className="border shadow-sm hover:shadow-md transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-emerald-500 text-sm">
          <ArrowUpRight className="w-4 h-4 mr-1" />
          {trend}%
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-1">{change} {period}</p>
    </CardContent>
  </Card>
);
