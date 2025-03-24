
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
  isForwarded?: boolean;
  originalMessageId?: string;
  allowForwarding?: boolean;
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
  isBusiness?: boolean;
  uniqueGroupId?: string;
  organizationId?: string | null;
  createdBy?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  members?: any[]; // Group members
  userRole?: string; // User's role in the group
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

export interface GroupMember {
  id: string;
  userId: string;
  conversationId: string;
  role: 'moderator' | 'member';
  status: 'pending' | 'accepted' | 'rejected';
  invitedBy?: string;
  invitationDate?: string;
  joinDate?: string;
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
}

export interface MessageInvitation {
  id: string;
  senderId: string;
  receiverId: string;
  initialMessage?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  respondedAt?: string;
  sender?: {
    id: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
}
