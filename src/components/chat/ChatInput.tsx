
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PaperclipIcon, SendIcon, SmileIcon } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSendMessage: () => void;
  onAttach?: () => void;
  isDisabled?: boolean;
}

export function ChatInput({ 
  value, 
  onChange, 
  onSendMessage, 
  onAttach,
  isDisabled = false 
}: ChatInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isDisabled) {
        onSendMessage();
      }
    }
  };

  return (
    <div className={`bg-background p-3 border-t transition-shadow ${isFocused ? 'shadow-md' : ''}`}>
      <div className={`flex gap-2 rounded-lg border ${isFocused ? 'border-primary/50 ring-1 ring-primary/20' : 'border-input'} bg-background overflow-hidden`}>
        <Textarea
          placeholder="Type a message"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="min-h-10 max-h-40 flex-1 resize-none border-0 focus-visible:ring-0 p-3"
          disabled={isDisabled}
        />
        <div className="flex flex-col justify-end p-2 gap-2">
          {onAttach && (
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={onAttach}
              className="h-8 w-8 rounded-full hover:bg-muted"
              disabled={isDisabled}
            >
              <PaperclipIcon className="h-4 w-4" />
              <span className="sr-only">Attach file</span>
            </Button>
          )}
          <Button 
            type="submit" 
            size="icon" 
            onClick={onSendMessage} 
            disabled={!value.trim() || isDisabled}
            className={`h-8 w-8 rounded-full ${value.trim() && !isDisabled ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted/50'} transition-colors`}
          >
            <SendIcon className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
