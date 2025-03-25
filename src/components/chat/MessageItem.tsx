
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  CheckCheck, 
  Clock, 
  File, 
  Image, 
  MoreVertical, 
  Pen, 
  Trash2, 
  X 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Message, Attachment } from "@/types/chat";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface MessageItemProps {
  message: Message;
  onEditMessage: (messageId: string, newContent: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReactToMessage: (messageId: string, emoji: string) => void;
  isAdminChat?: boolean;
}

export function MessageItem({
  message,
  onEditMessage,
  onDeleteMessage,
  onReactToMessage,
  isAdminChat = false,
}: MessageItemProps) {
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState(message.text || message.content);
  
  // If this is admin chat, get the sender's profile
  const { data: senderProfile } = useQuery({
    queryKey: ['admin-sender', message.senderId, isAdminChat],
    queryFn: async () => {
      if (!isAdminChat) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', message.senderId)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: isAdminChat && message.sender === 'them',
  });

  const isSentByMe = message.sender === 'me';
  const isSystemMessage = message.sender === 'system';
  
  // Format the timestamp to remove seconds
  const formattedTimestamp = formatMessageTimestamp(message.timestamp);
  
  // Convert reactions object to array for rendering
  const reactionArray = message.reactions ? 
    Object.entries(message.reactions).map(([emoji, users]) => ({
      emoji,
      users: Array.isArray(users) ? users : []
    })) : [];

  // Render message status indicator
  const renderStatusIndicator = () => {
    if (!isSentByMe || isSystemMessage) return null;
    
    switch (message.status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-muted-foreground" />;
      case 'sent':
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-primary" />;
      case 'failed':
        return <X className="h-3 w-3 text-destructive" />;
      default:
        return null;
    }
  };

  // Render attachments
  const renderAttachments = () => {
    if (!message.attachments || message.attachments.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {message.attachments.map(attachment => (
          <div 
            key={attachment.id}
            className={`flex items-center p-2 rounded-md ${
              isSentByMe ? 'bg-primary/10' : 'bg-muted/80'
            }`}
          >
            {attachment.type.startsWith('image/')
              ? <Image className="h-4 w-4 mr-2" />
              : <File className="h-4 w-4 mr-2" />
            }
            <span className="text-xs truncate max-w-[120px]">{attachment.name}</span>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div
      className={`flex flex-col ${
        isSentByMe ? 'items-end' : isSystemMessage ? 'items-center' : 'items-start'
      }`}
    >
      {isAdminChat && !isSentByMe && !isSystemMessage && (
        <div className="text-xs text-muted-foreground mb-1">
          {senderProfile ? `${senderProfile.first_name} ${senderProfile.last_name}` : 'Admin'}
        </div>
      )}
      
      {isSystemMessage && (
        <div className="text-xs text-muted-foreground mb-1">
          e-Box by Afrovation
        </div>
      )}
      
      <div className="flex items-start gap-2 group">
        {!isSentByMe && !isSystemMessage && (
          <Avatar className="h-8 w-8">
            {isAdminChat && senderProfile ? (
              <AvatarImage src={senderProfile.avatar_url || ''} />
            ) : (
              <AvatarImage src={''} />
            )}
            <AvatarFallback>
              {isAdminChat && senderProfile 
                ? `${senderProfile.first_name?.[0] || ''}${senderProfile.last_name?.[0] || ''}` 
                : 'UN'}
            </AvatarFallback>
          </Avatar>
        )}

        {isSystemMessage && (
          <Avatar className="h-8 w-8 bg-primary/20">
            <AvatarFallback className="text-primary font-semibold">eB</AvatarFallback>
          </Avatar>
        )}
        
        <div className="space-y-1">
          <div
            className={`px-4 py-2 rounded-lg text-sm ${
              isSentByMe
                ? 'bg-primary text-primary-foreground'
                : isSystemMessage
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'bg-muted'
            }`}
          >
            {editMode ? (
              <div className="flex">
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="min-w-[200px] bg-background h-8"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    onEditMessage(message.id, editText);
                    setEditMode(false);
                  }}
                  className="h-8 w-8"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditMode(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div>{message.text || message.content}</div>
            )}
          </div>
          
          {renderAttachments()}
          
          {reactionArray.length > 0 && !isSystemMessage && (
            <div className="flex gap-1">
              {reactionArray.map((reaction) => (
                <Button
                  key={reaction.emoji}
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onReactToMessage(message.id, reaction.emoji)}
                >
                  <span className="text-xs">
                    {reaction.emoji} {reaction.users.length}
                  </span>
                </Button>
              ))}
            </div>
          )}
          
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            {formattedTimestamp}
            {(message.edited || message.isEdited) && ' (edited)'}
            {renderStatusIndicator()}
          </div>
        </div>
        
        {isSentByMe && !isSystemMessage && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {
                  setEditText(message.text || message.content);
                  setEditMode(true);
                }}>
                  <Pen className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDeleteMessage(message.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to format timestamp without seconds
function formatMessageTimestamp(timestamp: string): string {
  if (!timestamp) return '';
  
  try {
    // Check if timestamp is a date string or ISO string
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      // If it's already a formatted string, just return it
      return timestamp;
    }
    
    // Format date to show only hours and minutes (no seconds)
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return timestamp; // Return original if there's an error
  }
}
