
import { useChat } from "@/hooks/use-chat";
import { Conversation } from "@/types/chat";
import { UserSearch } from "../UserSearch";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAuthDialog } from "@/hooks/useAuthDialog";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/useUserProfile";

export const ChatsTabContent = () => {
  const { conversations = [], isLoading } = useChat();
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { openAuthDialog } = useAuthDialog();
  const { userDisplayName, organizationId } = useUserProfile();

  const renderConversationTitle = (conversation: Conversation) => {
    if (!userDisplayName) return "Chat";
    
    // Fix: Use participantIds instead of participants
    const otherParticipantId = conversation.participantIds?.find(
      (id) => id !== organizationId
    );
    
    // Since profiles might not exist in the conversation object, provide a fallback
    if (conversation.name) {
      return conversation.name;
    }
    
    return "Chat";
  };

  return (
    <div className="h-full w-full relative">
      {/* User Search */}
      <div className="absolute top-2 left-2 right-2 z-10">
        <UserSearch onSelectUser={(user) => {
          // Handle user selection
          console.log("Selected user:", user);
          // Here you would start a conversation with the selected user
        }} />
      </div>

      {/* New Chat Button */}
      {userDisplayName && (
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 z-10"
          onClick={() => {
            supabase.auth.signOut();
            openAuthDialog();
          }}
        >
          <PlusCircle className="h-5 w-5" />
        </Button>
      )}

      {/* Conversation List */}
      <div className="h-full mt-16">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            Loading chats...
          </div>
        ) : conversations && conversations.length > 0 ? (
          <ul className="h-full overflow-y-auto px-2">
            {conversations.map((conversation) => (
              <li key={conversation.id} className="mb-2">
                <Button
                  variant="ghost"
                  className={`w-full justify-start rounded-lg ${
                    conversationId === conversation.id ? "bg-secondary" : ""
                  }`}
                  onClick={() => navigate(`/chat/${conversation.id}`)}
                >
                  {renderConversationTitle(conversation)}
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-full">
            No chats yet. Start a conversation!
          </div>
        )}
      </div>
    </div>
  );
};
