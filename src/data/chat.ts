
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
  createMessage('1', 'user1', 'Good morning! Could you review the latest project updates?', '2024-03-21T09:00:00Z'),
  createMessage('2', 'user2', 'Has anyone seen the new office policy document?', '2024-03-21T09:15:00Z'),
  createMessage('3', 'user3', 'Team meeting at 2 PM today. Don\'t forget to prepare your updates!', '2024-03-21T09:30:00Z'),
  createMessage('4', 'user4', 'Quick question about the upcoming team building event', '2024-03-21T09:45:00Z'),
  createMessage('5', 'user5', 'Just uploaded the Q1 reports to the documents section', '2024-03-21T10:00:00Z'),
];

export const demoConversations = [
  {
    id: '1',
    userId: 'user1',
    unreadCount: 2,
    messages: [
      createMessage('1', 'user1', 'Hi! Have you had a chance to review the latest design mockups?', '2024-03-21T09:00:00Z'),
      createMessage('2', 'me', 'Yes, they look great! I especially like the new color scheme.', '2024-03-21T09:05:00Z'),
      createMessage('3', 'user1', 'Great! Should we schedule a meeting to discuss the implementation?', '2024-03-21T09:10:00Z'),
      createMessage('4', 'user1', 'I\'ve also shared some additional notes in the project documents.', '2024-03-21T09:15:00Z'),
    ],
    lastMessage: 'I\'ve also shared some additional notes in the project documents.'
  },
  {
    id: '2',
    userId: 'user2',
    unreadCount: 1,
    messages: [
      createMessage('5', 'user2', 'Hey, quick question about the leave policy', '2024-03-21T10:00:00Z'),
      createMessage('6', 'me', 'Sure, what would you like to know?', '2024-03-21T10:05:00Z'),
      createMessage('7', 'user2', 'How many days notice do we need to give for annual leave?', '2024-03-21T10:10:00Z'),
    ],
    lastMessage: 'How many days notice do we need to give for annual leave?'
  },
  {
    id: '3',
    userId: 'user3',
    unreadCount: 3,
    messages: [
      createMessage('8', 'user3', 'Team meeting starting in 10 minutes', '2024-03-21T11:50:00Z'),
      createMessage('9', 'me', 'Thanks for the reminder! Joining shortly.', '2024-03-21T11:55:00Z'),
      createMessage('10', 'user3', 'Could you share your screen during the sprint review?', '2024-03-21T12:00:00Z'),
      createMessage('11', 'user3', 'Also, I\'ve updated the sprint board with new tasks', '2024-03-21T12:05:00Z'),
      createMessage('12', 'user3', 'Don\'t forget to update your time entries for this week', '2024-03-21T12:10:00Z'),
    ],
    lastMessage: 'Don\'t forget to update your time entries for this week'
  },
  {
    id: '4',
    userId: 'user4',
    unreadCount: 0,
    messages: [
      createMessage('13', 'user4', 'Are you joining the team lunch today?', '2024-03-21T11:00:00Z'),
      createMessage('14', 'me', 'Yes, definitely! What time are we heading out?', '2024-03-21T11:05:00Z'),
      createMessage('15', 'user4', 'Around 12:30, meeting in the lobby', '2024-03-21T11:10:00Z'),
      createMessage('16', 'me', 'Perfect, see you then!', '2024-03-21T11:15:00Z'),
    ],
    lastMessage: 'Perfect, see you then!'
  },
  {
    id: '5',
    userId: 'user5',
    unreadCount: 1,
    messages: [
      createMessage('17', 'user5', 'Could you review the Q1 financial report?', '2024-03-21T14:00:00Z'),
      createMessage('18', 'me', 'Of course, when do you need feedback by?', '2024-03-21T14:05:00Z'),
      createMessage('19', 'user5', 'By end of day tomorrow if possible', '2024-03-21T14:10:00Z'),
      createMessage('20', 'user5', 'I\'ve just uploaded the latest version to the documents section', '2024-03-21T14:15:00Z'),
    ],
    lastMessage: 'I\'ve just uploaded the latest version to the documents section'
  },
];

export const getUserById = (id: string) => demoUsers.find(user => user.id === id);
