
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AdminButtonProps {
  isAdmin: boolean;
}

export function AdminButton({ isAdmin }: AdminButtonProps) {
  const navigate = useNavigate();
  
  if (!isAdmin) return null;
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => navigate("/admin")}
      className="flex items-center gap-1 text-xs flex-1 h-8"
    >
      <Mail className="h-3 w-3" />
      <span>Admin</span>
    </Button>
  );
}
