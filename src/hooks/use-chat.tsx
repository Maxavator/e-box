
import { useState } from "react";
import { useConversations } from "./useConversations";
import { useMessages } from "./messages";
import { useRealtime } from "./useRealtime";
import { Attachment } from "@/types/chat";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useGolderColleagues } from "@/components/contacts/hooks/useGolderColleagues";
import { toast } from "sonner";

export const useChat = () => {
  const [activeTab, setActiveTab] = useState("chats");
  const [calendarView, setCalendarView] = useState<"calendar" | "inbox" | "proposed">("calendar");
  const [selectedFeature, setSelectedFeature] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);

  const { data: colleagues, isLoading: isLoadingColleagues } = useQuery({
    queryKey: ['chat-colleagues'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      if (!data?.session?.user) return [];
      
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', data.session.user.id)
        .single();
      
      if (!userProfile?.organization_id) return [];
      
      const { data: colleagueProfiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, job_title')
        .eq('organization_id', userProfile.organization_id)
        .neq('id', data.session.user.id);
      
      return colleagueProfiles || [];
    },
    enabled: activeTab === "colleagues"
  });

  const { data: golderColleagues, isLoading: isLoadingGolderColleagues } = useGolderColleagues();

  const {
    conversations,
    selectedConversation,
    setSelectedConversation,
    searchQuery,
    setSearchQuery,
    filteredConversations,
    handleSelectConversation,
    isNewConversation,
  } = useConversations();

  const {
    newMessage,
    setNewMessage,
    handleSendMessage: baseSendMessage,
    handleEditMessage,
    handleDeleteMessage,
    handleReaction,
    isSending
  } = useMessages(selectedConversation, setSelectedConversation);

  useRealtime(selectedConversation, setSelectedConversation);

  const handleAttachFiles = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files) return;
      
      const newAttachments: Attachment[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileId = crypto.randomUUID();
        
        newAttachments.push({
          id: fileId,
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'file',
          size: file.size,
          url: URL.createObjectURL(file),
        });
      }
      
      setAttachments([...attachments, ...newAttachments]);
    };
    
    input.click();
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    setAttachments(attachments.filter(a => a.id !== attachmentId));
  };

  const handleSendMessage = () => {
    baseSendMessage(attachments);
    setAttachments([]);
  };

  const handleStartConversationWithColleague = async (colleagueId: string) => {
    try {
      const { data } = await supabase.auth.getSession();
      if (!data?.session?.user) {
        toast.error("You must be logged in to start conversations");
        return null;
      }
      
      // Check if conversation already exists
      const { data: existingConvs, error: searchError } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(user1_id.eq.${data.session.user.id},user2_id.eq.${colleagueId}),and(user1_id.eq.${colleagueId},user2_id.eq.${data.session.user.id})`)
        .maybeSingle();
      
      if (searchError) {
        console.error("Error searching for existing conversation:", searchError);
        toast.error("Failed to check for existing conversation");
        return null;
      }
      
      if (existingConvs) {
        handleSelectConversation(existingConvs.id);
        setActiveTab("chats");
        return existingConvs.id;
      }
      
      // Create new conversation with RLS handling
      const { data: newConv, error } = await supabase
        .from('conversations')
        .insert({
          user1_id: data.session.user.id,
          user2_id: colleagueId
        })
        .select('id')
        .single();
      
      if (error) {
        console.error("Error creating conversation:", error);
        toast.error("Failed to create conversation");
        return null;
      }
      
      toast.success("New conversation started");
      handleSelectConversation(newConv.id);
      setActiveTab("chats");
      return newConv.id;
    } catch (err) {
      console.error("Error in handleStartConversationWithColleague:", err);
      toast.error("Couldn't start conversation");
      return null;
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    calendarView,
    setCalendarView,
    selectedConversation,
    newMessage,
    setNewMessage,
    selectedFeature,
    setSelectedFeature,
    filteredConversations,
    attachments,
    colleagues,
    golderColleagues,
    isLoadingColleagues,
    isLoadingGolderColleagues,
    showSidebar,
    setShowSidebar,
    handleSendMessage,
    handleEditMessage,
    handleDeleteMessage,
    handleReaction,
    handleSelectConversation,
    handleAttachFiles,
    handleRemoveAttachment,
    handleStartConversationWithColleague,
    isNewConversation,
    isSending
  };
};
