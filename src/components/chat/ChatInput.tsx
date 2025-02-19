
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export function ChatInput({ value, onChange, onSend }: ChatInputProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isAuthenticated) {
        toast.error("You must be logged in to send messages");
        return;
      }
      onSend();
    }
  };

  return (
    <div className="border-t p-4 bg-white">
      <div className="flex gap-2">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isAuthenticated ? "Type a message..." : "Please log in to send messages"}
          className="min-h-[44px] max-h-[120px]"
          disabled={!isAuthenticated}
        />
        <Button 
          onClick={() => {
            if (!isAuthenticated) {
              toast.error("You must be logged in to send messages");
              return;
            }
            onSend();
          }} 
          className="shrink-0"
          disabled={!isAuthenticated}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
