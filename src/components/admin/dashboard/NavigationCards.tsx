
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building2, Settings, Shield, FileText, Server, Database } from "lucide-react";

// Define the possible views type to match AdminPortal.tsx
export type AdminView = 'dashboard' | 'users' | 'organizations' | 'reporting' | 'system' | 'documentation' | 'sassa' | 'systems-docs';

export interface NavigationCardsProps {
  activeView: AdminView;
  onNavigate: (view: AdminView) => void;
}

export const NavigationCards = ({ activeView, onNavigate }: NavigationCardsProps) => {
  const cards = [
    {
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: <Users className="h-6 w-6 text-primary" />,
      view: "users" as AdminView,
    },
    {
      title: "Organizations",
      description: "Manage organizations and departments",
      icon: <Building2 className="h-6 w-6 text-primary" />,
      view: "organizations" as AdminView,
    },
    {
      title: "System Settings",
      description: "Configure system-wide settings",
      icon: <Settings className="h-6 w-6 text-primary" />,
      view: "system" as AdminView,
    },
    {
      title: "Reporting",
      description: "View system reports and analytics",
      icon: <FileText className="h-6 w-6 text-primary" />,
      view: "reporting" as AdminView,
    },
    {
      title: "Documentation",
      description: "Access system documentation",
      icon: <Server className="h-6 w-6 text-primary" />,
      view: "documentation" as AdminView,
    },
    {
      title: "Systems Documentation",
      description: "SLA, Architecture, and Technical Specifications",
      icon: <Database className="h-6 w-6 text-primary" />,
      view: "systems-docs" as AdminView,
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => (
        <Card
          key={card.title}
          className={`p-6 hover:shadow-md transition-all cursor-pointer ${
            activeView === card.view
              ? "border-2 border-primary"
              : "border-2 border-transparent"
          }`}
          onClick={() => onNavigate(card.view)}
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
    </div>
  );
};
