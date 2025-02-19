
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface NavigationCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

export const NavigationCard = ({
  title,
  description,
  icon: Icon,
  onClick
}: NavigationCardProps) => {
  return (
    <Card 
      className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Icon className="w-5 h-5 text-primary" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">{description}</p>
      </CardContent>
    </Card>
  );
};
