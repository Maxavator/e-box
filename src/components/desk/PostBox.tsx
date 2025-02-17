
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";

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
  } | null;
}

type ServiceCategory = 
  | "All Messages"
  | "Banking Services"
  | "Municipality"
  | "Credit Providers"
  | "Mobile Networks"
  | "Government Service";

export function PostBox() {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>("All Messages");

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
      
      return (data as any[]).map(msg => ({
        ...msg,
        sender: msg.sender || { first_name: 'SA', last_name: 'Post Office' }
      })) as PostBoxMessage[];
    },
  });

  const categories: ServiceCategory[] = [
    "All Messages",
    "Banking Services",
    "Municipality",
    "Credit Providers",
    "Mobile Networks",
    "Government Service"
  ];

  if (isLoading) {
    return <div className="p-4">Loading messages...</div>;
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      {/* Sidebar */}
      <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
        <div className="h-full border-r bg-gray-50/40 p-4 space-y-2">
          <h3 className="font-semibold mb-4">Categories</h3>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                selectedCategory === category && "bg-gray-100"
              )}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </ResizablePanel>

      <ResizableHandle />

      {/* Main Content */}
      <ResizablePanel defaultSize={80}>
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
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
