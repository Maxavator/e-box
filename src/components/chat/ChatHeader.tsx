
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  onLogout: () => void;
  onLogoClick: () => void;
}

export function ChatHeader({ onLogout, onLogoClick }: ChatHeaderProps) {
  return (
    <header className="h-16 border-b flex items-center justify-between px-6 bg-white">
      <div className="flex items-center gap-2">
        <img 
          src="/lovable-uploads/cea5cf65-708e-42c4-9a6c-6073f42a3471.png" 
          alt="e-Box Logo" 
          className="h-8 cursor-pointer"
          onClick={onLogoClick}
        />
        <h1 className="text-xl font-semibold">Enterprise Chat</h1>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onLogout}
        className="text-gray-500 hover:text-gray-700"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </header>
  );
}
