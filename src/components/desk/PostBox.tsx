
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PostBoxMessage {
  id: string;
  subject: string;
  message: string;
  created_at: string;
  sender_id: string;
  is_read: boolean;
  sender: {
    first_name: string;
    last_name: string;
  };
}

export function PostBox() {
  const { data: messages, isLoading } = useQuery({
    queryKey: ['postBoxMessages'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('partner_messages')
        .select(`
          id,
          subject,
          message,
          created_at,
          sender_id,
          is_read,
          sender:profiles(
            first_name,
            last_name
          )
        `)
        .eq('receiver_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to handle the joined data structure
      return (data as any[]).map(msg => ({
        ...msg,
        sender: msg.sender || { first_name: 'SA', last_name: 'Post Office' }
      })) as PostBoxMessage[];
    },
  });

  if (isLoading) {
    return <div className="p-4">Loading messages...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Post Box</h2>
        <p className="text-sm text-muted-foreground">Official South African Post Office Communications</p>
      </div>

      <div className="space-y-4">
        {messages?.map((msg) => (
          <Card key={msg.id} className={msg.is_read ? 'bg-gray-50' : 'bg-white'}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{msg.subject}</CardTitle>
                  <p className="text-sm text-gray-500">
                    From: South African Post Office
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Official Communication - POPIA Compliant
                  </p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(msg.created_at).toLocaleDateString()}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{msg.message}</p>
            </CardContent>
          </Card>
        ))}

        {messages?.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              <p>No official communications at this time</p>
              <p className="text-sm mt-2">Messages will appear here when the Post Office has communications for you</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
