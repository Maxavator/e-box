
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Globe, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatMessageTimestamp } from "@/hooks/messages/utils";
import { Message } from "@/types/chat";

interface BroadcastMessageItemProps {
  message: Message;
}

export function BroadcastMessageItem({ message }: BroadcastMessageItemProps) {
  // Get sender details
  const { data: sender } = useQuery({
    queryKey: ['broadcast-sender', message.senderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url, job_title')
        .eq('id', message.senderId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: Boolean(message.senderId),
  });

  // Get organization details if it's an org broadcast
  const { data: organization } = useQuery({
    queryKey: ['broadcast-org', message.organizationId],
    queryFn: async () => {
      if (!message.organizationId) return null;
      
      const { data, error } = await supabase
        .from('organizations')
        .select('name')
        .eq('id', message.organizationId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: Boolean(message.organizationId),
  });

  const senderName = sender ? `${sender.first_name || ''} ${sender.last_name || ''}`.trim() : 'Admin';
  const senderInitials = senderName.split(' ').map(part => part[0]).join('').toUpperCase();

  return (
    <div className="flex flex-col items-center my-6">
      <Badge variant="outline" className="mb-2 bg-primary/5 text-primary border-primary/20 flex items-center gap-1">
        <Megaphone className="h-3 w-3" />
        <span>Broadcast</span>
        {message.isGlobal ? (
          <Globe className="h-3 w-3 ml-1" />
        ) : (
          <Users className="h-3 w-3 ml-1" />
        )}
      </Badge>
      
      <div className="flex flex-col items-center">
        <Avatar className="h-10 w-10 border-2 border-primary/20">
          <AvatarImage src={sender?.avatar_url || ''} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {senderInitials || 'A'}
          </AvatarFallback>
        </Avatar>
        
        <div className="mt-2 text-center">
          <div className="font-medium text-sm">{senderName}</div>
          {sender?.job_title && (
            <div className="text-xs text-muted-foreground">{sender.job_title}</div>
          )}
        </div>
      </div>
      
      <div className="mt-3 px-6 py-4 bg-primary/5 rounded-lg border border-primary/10 text-center max-w-md">
        <p>{message.content || message.text}</p>
        
        {organization && (
          <div className="mt-2 text-xs flex justify-center items-center">
            <span className="text-muted-foreground">Sent to</span>
            <Badge variant="outline" className="ml-2 text-xs bg-blue-50 text-blue-700 border-blue-200">
              {organization.name}
            </Badge>
          </div>
        )}
        
        {message.isGlobal && (
          <div className="mt-2 text-xs flex justify-center items-center">
            <span className="text-muted-foreground">Sent to</span>
            <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700 border-green-200">
              All Users
            </Badge>
          </div>
        )}
      </div>
      
      <div className="text-xs text-muted-foreground mt-2">
        {formatMessageTimestamp(message.timestamp)}
      </div>
    </div>
  );
}
