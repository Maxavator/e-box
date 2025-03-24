
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, Users, Building2, FileText, 
  Calendar, MessageSquare, Clock, Link2
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const LookupTools = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <LookupCard 
        title="Find User"
        description="Search for users by name, email, or ID"
        icon={<Users className="w-5 h-5" />}
        color="blue"
      >
        <div className="flex gap-2">
          <Input 
            placeholder="Enter user email or name" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </LookupCard>
      
      <LookupCard 
        title="Organization Lookup"
        description="Find organization details and members"
        icon={<Building2 className="w-5 h-5" />}
        color="purple"
      >
        <div className="flex gap-2">
          <Input placeholder="Enter organization name or ID" className="flex-1" />
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </LookupCard>
      
      <LookupCard 
        title="Document Search"
        description="Find documents by title or content"
        icon={<FileText className="w-5 h-5" />}
        color="amber"
      >
        <div className="flex gap-2">
          <Input placeholder="Enter document title or keyword" className="flex-1" />
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </LookupCard>
    </>
  );
};

interface LookupCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: "blue" | "purple" | "amber" | "green";
  children: React.ReactNode;
}

const LookupCard = ({ title, description, icon, color, children }: LookupCardProps) => {
  const getColorClasses = () => {
    switch (color) {
      case "blue":
        return {
          bg: "bg-blue-50",
          icon: "text-blue-600 bg-blue-100",
        };
      case "purple":
        return {
          bg: "bg-purple-50",
          icon: "text-purple-600 bg-purple-100",
        };
      case "amber":
        return {
          bg: "bg-amber-50",
          icon: "text-amber-600 bg-amber-100",
        };
      case "green":
        return {
          bg: "bg-green-50",
          icon: "text-green-600 bg-green-100",
        };
      default:
        return {
          bg: "bg-gray-50",
          icon: "text-gray-600 bg-gray-100",
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <Card className={`hover:shadow-sm transition-all border ${colorClasses.bg}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colorClasses.icon}`}>
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <p className="text-muted-foreground text-sm mt-1">{description}</p>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
