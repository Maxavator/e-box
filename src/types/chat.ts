
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
  text?: string; // Legacy field for compatibility
  sender?: string; // Legacy field for compatibility
  edited?: boolean; // Legacy field for compatibility
}

export interface Conversation {
  id: string;
  name: string;
  participantIds: string[];
  lastMessage?: Message | string;
  unreadCount?: number;
  avatar?: string;
  isGroup?: boolean;
  isAdminGroup?: boolean;
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
  userId?: string; // Legacy field for compatibility
  messages?: Message[]; // Legacy field for compatibility
  groupName?: string; // Legacy field for compatibility
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

export interface User {
  id: string;
  name: string;
  status: 'online' | 'offline';
  lastSeen?: string;
}
