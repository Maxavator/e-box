import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building2, Settings, Shield } from "lucide-react";

interface NavigationCardsProps {
  activeView: string;
  onViewChange: (view: any) => void;
}

export const NavigationCards = ({ activeView, onViewChange }: NavigationCardsProps) => {
  const cards = [
    {
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: <Users className="h-6 w-6 text-primary" />,
      view: "users",
    },
    {
      title: "Organizations",
      description: "Manage organizations and departments",
      icon: <Building2 className="h-6 w-6 text-primary" />,
      view: "organizations",
    },
    {
      title: "System Settings",
      description: "Configure system-wide settings",
      icon: <Settings className="h-6 w-6 text-primary" />,
      view: "settings",
    },
  ];

  return (
    <>
      {cards.map((card) => (
        <Card
          key={card.title}
          className={`p-6 hover:shadow-md transition-all cursor-pointer ${
            activeView === card.view
              ? "border-2 border-primary"
              : "border-2 border-transparent"
          }`}
          onClick={() => onViewChange(card.view)}
        >
          <div className="flex flex-col h-full">
            <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
              {card.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
            <p className="text-sm text-muted-foreground flex-grow">
              {card.description}
            </p>
            <Button variant="ghost" size="sm" className="mt-4 justify-start pl-0">
              {activeView === card.view ? "Currently Viewing" : "Open"}
            </Button>
          </div>
        </Card>
      ))}
    </>
  );
};
