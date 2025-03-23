export interface User {
  id: string;
  name: string;
  status: 'online' | 'offline';
  lastSeen?: string;
}

export interface Reaction {
  emoji: string;
  users: string[];
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: 'sending' | 'sent' | 'error';
  edited?: boolean;
  editedAt?: string;
  reactions: Reaction[];
  sender?: 'me' | 'them';
}

export interface Conversation {
  id: string;
  userId: string;
  unreadCount: number;
  messages: Message[];
  lastMessage: string;
  isGroup?: boolean;
  groupName?: string;
}

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  organization_id: string | null;
}

export interface DatabaseConversation {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  updated_at: string;
}
