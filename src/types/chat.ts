
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
  sender?: 'me' | 'them';  // Added to support existing code
}

export interface Conversation {
  id: string;
  userId: string;
  unreadCount: number;
  messages: Message[];
  lastMessage: string;  // Added to support message preview
}
