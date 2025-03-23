
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  isEdited?: boolean;
  reactions?: { [emoji: string]: string[] };
  attachments?: Attachment[];
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
}

export interface Conversation {
  id: string;
  name: string;
  participantIds: string[];
  lastMessage?: Message;
  unreadCount?: number;
  avatar?: string;
  isGroup?: boolean;
  isAdminGroup?: boolean;
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size?: number;
  thumbnailUrl?: string;
}

export interface ChatTab {
  id: string;
  name: string;
  icon: string;
}
