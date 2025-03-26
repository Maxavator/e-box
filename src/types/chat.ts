
export interface User {
  id: string;
  name: string;
  status: string;
  lastSeen: string;
  avatar: string;
  initials: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  reactions: Record<string, string[]>;
  sender?: 'me' | 'them';
}

export interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  participantIds: string[];
  userId?: string;
  unreadCount?: number;
  messages?: Message[];
  lastMessage?: Message | string;
  isGroup?: boolean;
  groupName?: string;
  draft?: boolean;
  unread?: boolean;
  labels?: string[];
}
