
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, Building2, BarChart3, Cog, FileText, Award,
  Database
} from 'lucide-react';

export type AdminView = 
  | 'dashboard' 
  | 'users' 
  | 'organizations' 
  | 'reporting' 
  | 'system' 
  | 'documentation'
  | 'sassa'
  | 'systems-documentation';

interface NavigationCardsProps {
  activeView: AdminView;
  onNavigate: (view: AdminView) => void;
}

export function NavigationCards({ activeView, onNavigate }: NavigationCardsProps) {
  const cards = [
    {
      title: 'User Management',
      description: 'Manage users, permissions, and access control',
      icon: <Users className="h-8 w-8 text-primary" />,
      view: 'users' as AdminView,
    },
    {
      title: 'Organization Management',
      description: 'Manage organizations, departments, and teams',
      icon: <Building2 className="h-8 w-8 text-primary" />,
      view: 'organizations' as AdminView,
    },
    {
      title: 'Reports & Analytics',
      description: 'View reports, analytics, and usage statistics',
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      view: 'reporting' as AdminView,
    },
    {
      title: 'System Settings',
      description: 'Configure system-wide settings and parameters',
      icon: <Cog className="h-8 w-8 text-primary" />,
      view: 'system' as AdminView,
    },
    {
      title: 'Documentation Portal',
      description: 'Access system documentation and guides',
      icon: <FileText className="h-8 w-8 text-primary" />,
      view: 'documentation' as AdminView,
    },
    {
      title: 'SASSA Management',
      description: 'Manage social grants and applications',
      icon: <Award className="h-8 w-8 text-primary" />,
      view: 'sassa' as AdminView,
    },
    {
      title: 'Systems Documentation',
      description: 'SLA, architecture, and technical specifications',
      icon: <Database className="h-8 w-8 text-primary" />,
      view: 'systems-documentation' as AdminView,
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => (
        <Card 
          key={card.view}
          className={`cursor-pointer transition-all hover:shadow-md ${
            activeView === card.view ? 'border-primary bg-primary/5' : ''
          }`}
          onClick={() => onNavigate(card.view)}
        >
          <CardHeader className="p-4 md:p-6 pb-2 md:pb-3">
            <CardTitle className="flex items-center gap-3">
              {card.icon}
              <span>{card.title}</span>
            </CardTitle>
            <CardDescription>{card.description}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
            <div className="flex justify-end">
              <div className={`text-xs px-2 py-1 rounded-full ${
                activeView === card.view ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
              }`}>
                {activeView === card.view ? 'Active' : 'Click to view'}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
