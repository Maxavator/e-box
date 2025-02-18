
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/components/user/UserProfile";

interface ChatHeaderProps {
  onLogout: () => void;
  onLogoClick: () => void;
}

export function ChatHeader({ onLogout, onLogoClick }: ChatHeaderProps) {
  return (
    <header className="border-b bg-white p-4 flex items-center justify-between">
      <button 
        onClick={onLogoClick}
        className="flex items-center gap-2 hover:opacity-90 transition-opacity"
      >
        <img 
          src="/lovable-uploads/81af9ad8-b07d-41cb-b800-92cebc70e699.png" 
          alt="Afrovation" 
          className="h-8"
        />
      </button>
      <UserProfile onLogout={onLogout} />
    </header>
  );
}
