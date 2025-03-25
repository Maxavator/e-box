
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
  sender?: 'me' | 'them' | 'system'; // Updated to include system messages
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
  avatar?: string;
  initials?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  organizationId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  memberCount?: number;
}

export interface GroupMember {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role?: 'admin' | 'member';
}

export interface GroupConversation extends Conversation {
  groupId: string;
  description?: string;
  isBusiness?: boolean;
  members?: GroupMember[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  color?: string;
  isPinned?: boolean;
  isJournal?: boolean;
  isShared?: boolean;
  sharedWith?: string[];
}
