
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSendMessage: () => void;
}

export function ChatInput({ value, onChange, onSendMessage }: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="border-t p-4 bg-white">
      <div className="flex gap-2">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="min-h-[44px] max-h-[120px]"
        />
        <Button onClick={onSendMessage} className="shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
