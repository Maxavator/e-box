
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type SenderProfile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

interface RawMessage {
  id: string;
  subject: string;
  message: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  is_read: boolean | null;
}

interface PartnerMessage extends Omit<RawMessage, 'is_read'> {
  is_read: boolean;
  sender: SenderProfile | null;
}

export function PartnerMessages() {
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [receiverEmail, setReceiverEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const { data: messages, isLoading, refetch } = useQuery<PartnerMessage[]>({
    queryKey: ['partnerMessages'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Fetch messages using filter() instead of or()
      const { data: messagesData, error: messagesError } = await supabase
        .from('partner_messages')
        .select()
        .filter('sender_id', 'eq', user.id)
        .filter('receiver_id', 'eq', user.id)
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;
      const rawMessages = messagesData as RawMessage[];

      if (rawMessages.length === 0) return [];

      // Get unique sender IDs
      const senderIds = [...new Set(rawMessages.map(msg => msg.sender_id))];

      // Fetch sender profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id,first_name,last_name')
        .in('id', senderIds);

      if (profilesError) throw profilesError;
      const profiles = profilesData as SenderProfile[];

      // Create profiles lookup map
      const profilesMap = Object.fromEntries(
        profiles.map(profile => [profile.id, profile])
      );

      // Format messages
      return rawMessages.map(msg => ({
        ...msg,
        is_read: Boolean(msg.is_read),
        sender: profilesMap[msg.sender_id] || null
      }));
    }
  });

  const handleSendMessage = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: receiverData, error: receiverError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', receiverEmail)
        .single();

      if (receiverError || !receiverData) {
        toast.error('Recipient not found');
        return;
      }

      const { error } = await supabase
        .from('partner_messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverData.id,
          subject,
          message,
        });

      if (error) throw error;

      toast.success('Message sent successfully');
      setIsNewMessageOpen(false);
      setReceiverEmail("");
      setSubject("");
      setMessage("");
      refetch();
    } catch (error) {
      toast.error('Failed to send message');
      console.error('Error sending message:', error);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading messages...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Partner Messages</h2>
        <Dialog open={isNewMessageOpen} onOpenChange={setIsNewMessageOpen}>
          <DialogTrigger asChild>
            <Button>New Message</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Send New Message</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="receiver">To (Email)</Label>
                <Input
                  id="receiver"
                  value={receiverEmail}
                  onChange={(e) => setReceiverEmail(e.target.value)}
                  placeholder="recipient@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Message subject"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here"
                  rows={4}
                />
              </div>
              <Button onClick={handleSendMessage} className="w-full">
                Send Message
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {messages?.map((msg) => (
          <Card key={msg.id} className={msg.is_read ? 'bg-gray-50' : 'bg-white'}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{msg.subject}</CardTitle>
                  <p className="text-sm text-gray-500">
                    From: {msg.sender?.first_name} {msg.sender?.last_name}
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
      </div>
    </div>
  );
}
