
import { Message, User, Conversation } from "@/types/chat";

// Define users first so they're available for all subsequent functions
export const demoUsers: User[] = [
  {
    id: 'user1',
    name: 'Alice Johnson',
    status: 'online',
    lastSeen: 'Just now',
    avatar: '/placeholder.svg',
    initials: 'AJ'
  },
  {
    id: 'user2',
    name: 'Bob Smith',
    status: 'offline',
    lastSeen: '5 minutes ago',
    avatar: '/placeholder.svg',
    initials: 'BS'
  },
  {
    id: 'user3',
    name: 'Charlie Brown',
    status: 'online',
    lastSeen: '10 minutes ago',
    avatar: '/placeholder.svg',
    initials: 'CB'
  },
  {
    id: 'user4',
    name: 'Diana Miller',
    status: 'offline',
    lastSeen: '30 minutes ago',
    avatar: '/placeholder.svg',
    initials: 'DM'
  },
  {
    id: 'user5',
    name: 'Ethan Davis',
    status: 'online',
    lastSeen: '1 hour ago',
    avatar: '/placeholder.svg',
    initials: 'ED'
  }
];

// Helper function to get a user by ID
export const getUserById = (id: string) => demoUsers.find(user => user.id === id);

// Message creation function that uses getUserById
const createMessage = (id: string, senderId: string, text: string, timestamp: string): Message => ({
  id,
  conversationId: '', // Will be filled in when added to a conversation
  senderId,
  senderName: getUserById(senderId)?.name || '',
  content: text,
  text, // For backwards compatibility
  timestamp,
  status: 'sent',
  reactions: {},
});

// Demo messages using the createMessage function
export const demoMessages: Message[] = [
  createMessage('1', 'user1', 'Good morning! Could you review the latest project updates?', '2024-03-21T09:00:00Z'),
  createMessage('2', 'user2', 'Has anyone seen the new office policy document?', '2024-03-21T09:15:00Z'),
  createMessage('3', 'user3', 'Team meeting at 2 PM today. Don\'t forget to prepare your updates!', '2024-03-21T09:30:00Z'),
  createMessage('4', 'user4', 'Quick question about the upcoming team building event', '2024-03-21T09:45:00Z'),
  createMessage('5', 'user5', 'Just uploaded the Q1 reports to the documents section', '2024-03-21T10:00:00Z'),
];

// Demo conversations using previously defined data and functions
export const demoConversations: Conversation[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    participantIds: ['user1'],
    userId: 'user1', // For backwards compatibility
    unreadCount: 2,
    messages: [
      { ...createMessage('1', 'user1', 'Hi! Have you had a chance to review the latest design mockups?', '2024-03-21T09:00:00Z'), conversationId: '1', sender: 'them' },
      { ...createMessage('2', 'me', 'Yes, they look great! I especially like the new color scheme.', '2024-03-21T09:05:00Z'), conversationId: '1', sender: 'me' },
      { ...createMessage('3', 'user1', 'Great! Should we schedule a meeting to discuss the implementation?', '2024-03-21T09:10:00Z'), conversationId: '1', sender: 'them' },
      { ...createMessage('4', 'user1', 'I\'ve also shared some additional notes in the project documents.', '2024-03-21T09:15:00Z'), conversationId: '1', sender: 'them' },
    ],
    lastMessage: "I've also shared some additional notes in the project documents."
  },
  {
    id: '2',
    name: 'Bob Smith',
    participantIds: ['user2'],
    userId: 'user2', // For backwards compatibility
    unreadCount: 1,
    messages: [
      { ...createMessage('5', 'user2', 'Hey, quick question about the leave policy', '2024-03-21T10:00:00Z'), conversationId: '2', sender: 'them' },
      { ...createMessage('6', 'me', 'Sure, what would you like to know?', '2024-03-21T10:05:00Z'), conversationId: '2', sender: 'me' },
      { ...createMessage('7', 'user2', 'How many days notice do we need to give for annual leave?', '2024-03-21T10:10:00Z'), conversationId: '2', sender: 'them' },
    ],
    lastMessage: 'How many days notice do we need to give for annual leave?'
  },
  {
    id: '3',
    name: 'Charlie Brown',
    participantIds: ['user3'],
    userId: 'user3', // For backwards compatibility
    unreadCount: 3,
    messages: [
      { ...createMessage('8', 'user3', 'Team meeting starting in 10 minutes', '2024-03-21T11:50:00Z'), conversationId: '3', sender: 'them' },
      { ...createMessage('9', 'me', 'Thanks for the reminder! Joining shortly.', '2024-03-21T11:55:00Z'), conversationId: '3', sender: 'me' },
      { ...createMessage('10', 'user3', 'Could you share your screen during the sprint review?', '2024-03-21T12:00:00Z'), conversationId: '3', sender: 'them' },
      { ...createMessage('11', 'user3', 'Also, I\'ve updated the sprint board with new tasks', '2024-03-21T12:05:00Z'), conversationId: '3', sender: 'them' },
      { ...createMessage('12', 'user3', 'Don\'t forget to update your time entries for this week', '2024-03-21T12:10:00Z'), conversationId: '3', sender: 'them' },
    ],
    lastMessage: 'Don\'t forget to update your time entries for this week'
  },
  {
    id: '4',
    name: 'Diana Miller',
    participantIds: ['user4'],
    userId: 'user4', // For backwards compatibility
    unreadCount: 0,
    messages: [
      { ...createMessage('13', 'user4', 'Are you joining the team lunch today?', '2024-03-21T11:00:00Z'), conversationId: '4', sender: 'them' },
      { ...createMessage('14', 'me', 'Yes, definitely! What time are we heading out?', '2024-03-21T11:05:00Z'), conversationId: '4', sender: 'me' },
      { ...createMessage('15', 'user4', 'Around 12:30, meeting in the lobby', '2024-03-21T11:10:00Z'), conversationId: '4', sender: 'them' },
      { ...createMessage('16', 'me', 'Perfect, see you then!', '2024-03-21T11:15:00Z'), conversationId: '4', sender: 'me' },
    ],
    lastMessage: 'Perfect, see you then!'
  },
  {
    id: '5',
    name: 'Ethan Davis',
    participantIds: ['user5'],
    userId: 'user5', // For backwards compatibility
    unreadCount: 1,
    messages: [
      { ...createMessage('17', 'user5', 'Could you review the Q1 financial report?', '2024-03-21T14:00:00Z'), conversationId: '5', sender: 'them' },
      { ...createMessage('18', 'me', 'Of course, when do you need feedback by?', '2024-03-21T14:05:00Z'), conversationId: '5', sender: 'me' },
      { ...createMessage('19', 'user5', 'By end of day tomorrow if possible', '2024-03-21T14:10:00Z'), conversationId: '5', sender: 'them' },
      { ...createMessage('20', 'user5', 'I\'ve just uploaded the latest version to the documents section', '2024-03-21T14:15:00Z'), conversationId: '5', sender: 'them' },
    ],
    lastMessage: 'I\'ve just uploaded the latest version to the documents section'
  },
];
