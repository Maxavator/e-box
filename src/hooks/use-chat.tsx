
import { useState } from "react";
import { useConversations } from "./useConversations";
import { useMessages } from "./useMessages";
import { useRealtime } from "./useRealtime";
import { Attachment } from "@/types/chat";

export const useChat = () => {
  const [activeTab, setActiveTab] = useState("chats");
  const [calendarView, setCalendarView] = useState<"calendar" | "inbox">("calendar");
  const [selectedFeature, setSelectedFeature] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);

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
    handleSendMessage,
    handleEditMessage,
    handleDeleteMessage,
    handleReaction
  } = useMessages(selectedConversation, setSelectedConversation);

  // Initialize realtime subscriptions
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
          type: file.type,
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
    handleSendMessage,
    handleEditMessage,
    handleDeleteMessage,
    handleReaction,
    handleSelectConversation,
    handleAttachFiles,
    handleRemoveAttachment,
    isNewConversation,
  };
};
