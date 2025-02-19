
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  increase: string;
  subtitle: string;
  icon: LucideIcon;
}

export const StatsCard = ({
  title,
  value,
  increase,
  subtitle,
  icon: Icon
}: StatsCardProps) => {
  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
        <Icon className="w-4 h-4 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">{value}</div>
          <div className="flex items-center text-green-500 text-sm">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            {increase}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
};
