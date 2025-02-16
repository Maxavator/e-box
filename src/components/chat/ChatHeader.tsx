
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  onLogout: () => void;
  onLogoClick: () => void;
}

export function ChatHeader({ onLogout, onLogoClick }: ChatHeaderProps) {
  return (
    <header className="border-b bg-white p-4 flex items-center justify-between">
      <button 
        onClick={onLogoClick}
        className="text-lg font-semibold hover:text-primary transition-colors"
      >
        Chat App
      </button>
      <Button variant="ghost" size="icon" onClick={onLogout}>
        <LogOut className="h-5 w-5" />
      </Button>
    </header>
  );
}
