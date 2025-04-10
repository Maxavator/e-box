
import { Globe, User, FileText, Car, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface DepartmentSelectorProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  className?: string;
}

export const DepartmentSelector = ({ activeTab, setActiveTab, className }: DepartmentSelectorProps) => {
  const departments = [
    { id: "", label: "All Services", icon: <Globe className="h-4 w-4" /> },
    { id: "home-affairs", label: "Home Affairs", icon: <User className="h-4 w-4" /> },
    { id: "sars", label: "SARS", icon: <FileText className="h-4 w-4" /> },
    { id: "transport", label: "Transport", icon: <Car className="h-4 w-4" /> },
    { id: "sassa", label: "SASSA", icon: <Award className="h-4 w-4" /> },
  ];

  return (
    <div className={cn("flex overflow-x-auto bg-muted rounded-lg mb-8", className)}>
      {departments.map((dept) => (
        <button
          key={dept.id}
          onClick={() => setActiveTab(dept.id)}
          className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap transition-colors ${
            activeTab === dept.id
              ? "bg-background rounded-md shadow-sm font-medium"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {dept.icon}
          <span>{dept.label}</span>
        </button>
      ))}
    </div>
  );
};
