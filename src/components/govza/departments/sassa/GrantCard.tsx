
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export interface GrantCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  link: string;
}

export const GrantCard = ({ icon, title, description, action, link }: GrantCardProps) => {
  return (
    <Card className="h-full flex flex-col p-6 hover:shadow-md transition-shadow">
      <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 flex-grow">{description}</p>
      <Button 
        variant="default" 
        className="w-full gap-2" 
        onClick={() => window.open(link, "_blank")}
      >
        {action} <ExternalLink className="h-4 w-4" />
      </Button>
    </Card>
  );
};
