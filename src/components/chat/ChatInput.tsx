
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PaperclipIcon, SendIcon, SmileIcon } from "lucide-react";

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
    <div className="bg-background p-4 border-t">
      <div className="flex gap-2">
        <Textarea
          placeholder="Type a message"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-10 flex-1 resize-none"
        />
        <div className="flex flex-col gap-2">
          <Button 
            type="submit" 
            size="icon" 
            onClick={onSendMessage} 
            disabled={!value.trim()}
          >
            <SendIcon className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
