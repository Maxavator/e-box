
import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Smile, Paperclip, Send, X, Image, Loader } from "lucide-react";
import { Attachment } from "@/types/chat";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSendMessage: () => void;
  onAttach?: () => void;
  attachments?: Attachment[];
  onRemoveAttachment?: (id: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSendMessage,
  onAttach,
  attachments = [],
  onRemoveAttachment,
  placeholder = "Type a message...",
  disabled = false,
  isLoading = false
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [value]);
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() || attachments.length > 0) {
        onSendMessage();
      }
    }
  };

  return (
    <div className="p-4 border-t">
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attachments.map((attachment) => (
            <div 
              key={attachment.id} 
              className="relative rounded-md bg-muted p-2 flex items-center gap-2 group"
            >
              {attachment.type === 'image' ? (
                <div className="relative w-10 h-10 rounded overflow-hidden">
                  <img 
                    src={attachment.url} 
                    alt={attachment.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                  <Paperclip className="h-4 w-4 text-primary" />
                </div>
              )}
              <span className="text-xs truncate max-w-[100px]">
                {attachment.name}
              </span>
              {onRemoveAttachment && (
                <Button 
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-1 -right-1 bg-background border shadow-sm"
                  onClick={() => onRemoveAttachment(attachment.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
      <div className={`flex items-end gap-2 rounded-lg border ${isFocused ? 'ring-2 ring-ring ring-offset-2' : ''}`}>
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 border-0 outline-none focus-visible:ring-0 resize-none py-3 min-h-[40px] max-h-[120px] overflow-y-auto"
          onKeyDown={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
        />
        <div className="flex items-center gap-1 p-2">
          {onAttach && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={onAttach}
              disabled={disabled}
              type="button"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          )}
          <Button
            className={`h-8 w-8 rounded-full p-0 ${!value.trim() && attachments.length === 0 ? 'text-muted-foreground' : ''}`}
            onClick={onSendMessage}
            disabled={(!value.trim() && attachments.length === 0) || disabled || isLoading}
            type="button"
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
