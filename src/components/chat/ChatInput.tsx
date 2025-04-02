
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PaperclipIcon, SendIcon, X } from "lucide-react";
import { Attachment } from "@/types/chat";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSendMessage: () => void;
  onAttach?: () => void;
  isDisabled?: boolean;
  attachments?: Attachment[];
  onRemoveAttachment?: (id: string) => void;
}

export function ChatInput({ 
  value, 
  onChange, 
  onSendMessage, 
  onAttach,
  isDisabled = false,
  attachments = [],
  onRemoveAttachment
}: ChatInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if ((value.trim() || attachments.length > 0) && !isDisabled) {
        onSendMessage();
      }
    }
  };

  return (
    <div className={`bg-background p-3 border-t transition-shadow ${isFocused ? 'shadow-md' : ''}`}>
      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachments.map(attachment => (
            <div key={attachment.id} className="flex items-center bg-muted rounded-md p-1 pr-2">
              <span className="text-xs truncate max-w-[150px]">{attachment.name}</span>
              {onRemoveAttachment && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 ml-1 rounded-full p-0" 
                  onClick={() => onRemoveAttachment(attachment.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
      
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
            disabled={(!value.trim() && attachments.length === 0) || isDisabled}
            className={`h-8 w-8 rounded-full ${(value.trim() || attachments.length > 0) && !isDisabled ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted/50'} transition-colors`}
          >
            <SendIcon className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
