
export interface User {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline';
  lastSeen?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: 'sending' | 'sent' | 'error';
  edited?: boolean;
  editedAt?: string;
  reactions?: {
    emoji: string;
    users: string[];
  }[];
}

export interface Conversation {
  id: string;
  userId: string;
  messages: Message[];
  unreadCount: number;
}
