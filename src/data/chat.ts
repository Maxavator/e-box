import type { User, Conversation } from "@/types/chat";

export const demoUsers: User[] = [
  { id: '1', name: 'Sarah Chen', status: 'online' },
  { id: '2', name: 'Mike Johnson', status: 'offline', lastSeen: '2 hours ago' },
  { id: '3', name: 'Emma Wilson', status: 'online' },
  { id: '4', name: 'Alex Rodriguez', status: 'offline', lastSeen: '1 day ago' },
  { id: '5', name: 'David Kim', status: 'online' },
];

export const demoConversations: Conversation[] = [
  {
    id: '1',
    userId: '1',
    unreadCount: 2,
    messages: [
      { id: '1', senderId: '1', text: 'Hi, could you review the latest design updates?', timestamp: '10:30 AM', status: 'sent' },
      { id: '2', senderId: 'me', text: 'Sure, I\'ll take a look right now', timestamp: '10:32 AM', status: 'sent' },
      { id: '3', senderId: '1', text: 'Thanks! Let me know what you think', timestamp: '10:33 AM', status: 'sent' },
    ]
  },
  {
    id: '2',
    userId: '2',
    unreadCount: 0,
    messages: [
      { id: '1', senderId: '2', text: 'Team meeting at 3 PM today', timestamp: '9:00 AM', status: 'sent' },
      { id: '2', senderId: 'me', text: 'I\'ll be there', timestamp: '9:05 AM', status: 'sent' },
    ]
  },
  {
    id: '3',
    userId: '3',
    unreadCount: 1,
    messages: [
      { id: '1', senderId: '3', text: 'Did you see the new project requirements?', timestamp: '11:20 AM', status: 'sent' },
    ]
  },
  {
    id: '4',
    userId: '4',
    unreadCount: 0,
    messages: [
      { id: '1', senderId: '4', text: 'Great presentation yesterday!', timestamp: 'Yesterday', status: 'sent' },
      { id: '2', senderId: 'me', text: 'Thanks! Glad it went well', timestamp: 'Yesterday', status: 'sent' },
    ]
  },
  {
    id: '5',
    userId: '5',
    unreadCount: 3,
    messages: [
      { id: '1', senderId: '5', text: 'Can we discuss the new feature?', timestamp: '12:45 PM', status: 'sent' },
      { id: '2', senderId: '5', text: 'I have some ideas to share', timestamp: '12:46 PM', status: 'sent' },
      { id: '3', senderId: '5', text: 'Let me know when you\'re free', timestamp: '12:47 PM', status: 'sent' },
    ]
  },
];

export const getUserById = (id: string) => demoUsers.find(user => user.id === id);
