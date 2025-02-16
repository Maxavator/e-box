
export type NotificationTime = '5_min' | '10_min' | '15_min' | '30_min' | '1_hour' | '1_day';

export type CalendarEvent = {
  id: string;
  creatorId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  isOnline: boolean;
  meetingLink?: string;
};

export type InviteStatus = 'pending' | 'accepted' | 'declined' | 'tentative';

export type CalendarInvite = {
  id: string;
  eventId: string;
  inviteeId: string;
  status: InviteStatus;
};
