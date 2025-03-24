
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useSidebarBadges() {
  const [chatCount, setChatCount] = useState(0);
  const [documentsCount, setDocumentsCount] = useState(0);
  const [calendarCount, setCalendarCount] = useState(0);
  const [contactsCount, setContactsCount] = useState(0);
  const [leaveCount, setLeaveCount] = useState(0);
  const [flaggedItems, setFlaggedItems] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching badge counts
    const fetchBadgeCounts = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Get unread messages count from conversations
          const { data: conversations } = await supabase
            .from('conversations')
            .select('unread_count');
          
          // Sum up the unread counts
          if (conversations) {
            const totalUnread = conversations.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);
            setChatCount(totalUnread);
          } else {
            // Fallback to random count for demo purposes
            setChatCount(Math.floor(Math.random() * 10));
          }
          
          setDocumentsCount(Math.floor(Math.random() * 5));
          setCalendarCount(Math.floor(Math.random() * 3));
          setContactsCount(Math.floor(Math.random() * 4));
          setLeaveCount(Math.floor(Math.random() * 2));
          setFlaggedItems(Math.floor(Math.random() * 3));
          
          // Set up realtime subscriptions for new messages
          const channel = supabase
            .channel('sidebar-notifications')
            .on('broadcast', { event: 'new-message' }, payload => {
              setChatCount(prev => prev + 1);
              toast({
                title: "New Message",
                description: "You have received a new message",
              });
            })
            .on('broadcast', { event: 'new-document' }, payload => {
              setDocumentsCount(prev => prev + 1);
            })
            .on('broadcast', { event: 'new-calendar-event' }, payload => {
              setCalendarCount(prev => prev + 1);
            })
            .on('broadcast', { event: 'new-contact' }, payload => {
              setContactsCount(prev => prev + 1);
            })
            .on('broadcast', { event: 'new-leave' }, payload => {
              setLeaveCount(prev => prev + 1);
            })
            .on('broadcast', { event: 'new-flagged-item' }, payload => {
              setFlaggedItems(prev => prev + 1);
            })
            .subscribe();
            
          return () => {
            supabase.removeChannel(channel);
          };
        }
      } catch (error) {
        console.error("Error fetching badge counts:", error);
      }
    };
    
    fetchBadgeCounts();
  }, [toast]);

  // Function to reset a specific badge count
  const resetBadgeCount = (type: 'chat' | 'documents' | 'calendar' | 'contacts' | 'leave') => {
    switch (type) {
      case 'chat':
        setChatCount(0);
        break;
      case 'documents':
        setDocumentsCount(0);
        break;
      case 'calendar':
        setCalendarCount(0);
        break;
      case 'contacts':
        setContactsCount(0);
        break;
      case 'leave':
        setLeaveCount(0);
        break;
    }
  };

  return {
    chatCount,
    documentsCount,
    calendarCount,
    contactsCount,
    leaveCount,
    flaggedItems,
    resetBadgeCount
  };
}
