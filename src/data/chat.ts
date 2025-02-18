import { Message, User } from "@/types/chat";

export const demoUsers: User[] = [
  {
    id: 'user1',
    name: 'Alice Johnson',
    status: 'online',
    lastSeen: 'Just now'
  },
  {
    id: 'user2',
    name: 'Bob Smith',
    status: 'offline',
    lastSeen: '5 minutes ago'
  },
  {
    id: 'user3',
    name: 'Charlie Brown',
    status: 'online',
    lastSeen: '10 minutes ago'
  },
  {
    id: 'user4',
    name: 'Diana Miller',
    status: 'offline',
    lastSeen: '30 minutes ago'
  },
  {
    id: 'user5',
    name: 'Ethan Davis',
    status: 'online',
    lastSeen: '1 hour ago'
  }
];

const createMessage = (id: string, senderId: string, text: string, timestamp: string): Message => ({
  id,
  senderId,
  text,
  timestamp,
  status: 'sent',
  reactions: [],
});

export const demoMessages: Message[] = [
  createMessage('1', 'user1', 'Hello!', '2024-02-01T10:00:00Z'),
  createMessage('2', 'user2', 'Hi there!', '2024-02-01T10:01:00Z'),
  createMessage('3', 'user3', 'Good morning!', '2024-02-01T10:02:00Z'),
];

export const demoConversations = [
  {
    id: '1',
    userId: 'user1',
    unreadCount: 0,
    messages: [
      createMessage('1', 'user1', 'Hey, how are you?', '2024-02-01T10:00:00Z'),
      createMessage('2', 'me', 'I\'m good, thanks!', '2024-02-01T10:01:00Z'),
    ],
    lastMessage: 'I\'m good, thanks!'
  },
  {
    id: '2',
    userId: 'user2',
    unreadCount: 2,
    messages: [
      createMessage('3', 'user2', 'Did you see the new feature?', '2024-02-01T10:02:00Z'),
      createMessage('4', 'me', 'Not yet, what is it?', '2024-02-01T10:03:00Z'),
    ],
    lastMessage: 'Not yet, what is it?'
  },
  {
    id: '3',
    userId: 'user3',
    unreadCount: 1,
    messages: [
      createMessage('5', 'user3', 'What are you working on today?', '2024-02-01T10:04:00Z'),
      createMessage('6', 'me', 'Just finishing up some reports.', '2024-02-01T10:05:00Z'),
    ],
    lastMessage: 'Just finishing up some reports.'
  },
  {
    id: '4',
    userId: 'user4',
    unreadCount: 0,
    messages: [
      createMessage('7', 'user4', 'Can we schedule a meeting?', '2024-02-01T10:06:00Z'),
      createMessage('8', 'me', 'Sure, when are you free?', '2024-02-01T10:07:00Z'),
    ],
    lastMessage: 'Sure, when are you free?'
  },
  {
    id: '5',
    userId: 'user5',
    unreadCount: 0,
    messages: [
      createMessage('9', 'user5', 'How is the project going?', '2024-02-01T10:08:00Z'),
      createMessage('10', 'me', 'It\'s progressing well.', '2024-02-01T10:09:00Z'),
    ],
    lastMessage: 'It\'s progressing well.'
  },
];

export const getUserById = (id: string) => demoUsers.find(user => user.id === id);
