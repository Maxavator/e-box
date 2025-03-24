
import { Settings, Users, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { AdminView } from "../admin/dashboard/NavigationCards";

interface AdminMenuProps {
  activeView: string;
  setActiveView: (view: AdminView) => void;
}

export function AdminMenu({ activeView, setActiveView }: AdminMenuProps) {
  const navigate = useNavigate();

  const handleAdminNav = (path: string) => {
    navigate(path);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Admin Tools
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleAdminNav('/admin')}>
          <Settings className="h-4 w-4 mr-2" />
          Admin Portal
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAdminNav('/organization')}>
          <Building2 className="h-4 w-4 mr-2" />
          Organization Management
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAdminNav('/admin/users')}>
          <Users className="h-4 w-4 mr-2" />
          User Management
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
