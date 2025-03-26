
export interface User {
  id: string;
  name: string;
  status: string;
  lastSeen: string;
  avatar: string;
  initials: string;
  email?: string;
  organization?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'sending' | 'failed';
  reactions: Record<string, string[]>;
  sender?: 'me' | 'them' | 'system';
  edited?: boolean;
  isEdited?: boolean;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  type: 'image' | 'file' | 'link';
  url: string;
  name: string;
  size?: number;
  preview?: string;
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

export interface Group {
  id: string;
  name: string;
  avatarUrl: string;
  memberIds: string[];
  createdAt: string;
}

export interface GroupConversation extends Conversation {
  isGroup: true;
  memberIds: string[];
}

export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  role: 'admin' | 'member';
  joinedAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isShared: boolean;
  category: string;
  tags: string[];
  isFavorite: boolean;
  owner: string;
  attachments?: Attachment[];
  color?: string;
  isPinned?: boolean;
  isJournal?: boolean;
  userId?: string;
}
