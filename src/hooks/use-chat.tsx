
import { useState } from "react";
import { useConversations } from "./useConversations";
import { useMessages } from "./useMessages";
import { useRealtime } from "./useRealtime";

export const useChat = (type?: 'admin' | undefined) => {
  const [activeTab, setActiveTab] = useState("chats");
  const [calendarView, setCalendarView] = useState<"calendar" | "inbox">("calendar");
  const [selectedFeature, setSelectedFeature] = useState("");

  const {
    conversations,
    selectedConversation,
    setSelectedConversation,
    searchQuery,
    setSearchQuery,
    filteredConversations,
    handleSelectConversation,
  } = useConversations(type);

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
    handleSendMessage,
    handleEditMessage,
    handleDeleteMessage,
    handleReaction,
    handleSelectConversation,
  };
};
