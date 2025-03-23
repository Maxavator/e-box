import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, MoreVertical, Pen, Trash2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Message } from "@/types/chat";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  const [editText, setEditText] = useState(message.text);
  
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
  
  return (
    <div
      className={`flex flex-col ${
        isSentByMe ? 'items-end' : 'items-start'
      }`}
    >
      {isAdminChat && !isSentByMe && (
        <div className="text-xs text-muted-foreground mb-1">
          {senderProfile ? `${senderProfile.first_name} ${senderProfile.last_name}` : 'Admin'}
        </div>
      )}
      
      <div className="flex items-start gap-2 group">
        {!isSentByMe && (
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
        
        <div className="space-y-1">
          <div
            className={`px-4 py-2 rounded-lg text-sm ${
              isSentByMe
                ? 'bg-primary text-primary-foreground'
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
              <div>{message.text}</div>
            )}
          </div>
          
          {message.reactions.length > 0 && (
            <div className="flex gap-1">
              {message.reactions.map((reaction) => (
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
          
          <div className="text-xs text-muted-foreground">
            {message.timestamp}
            {message.edited && ' (edited)'}
          </div>
        </div>
        
        {isSentByMe && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {
                  setEditText(message.text);
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
