
export type NotificationTime = '5_min' | '10_min' | '15_min' | '30_min' | '1_hour' | '1_day';

export type CalendarEvent = {
  id: string;
  created_at: string;
  updated_at: string;
  creator_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  is_online: boolean;
  meeting_link?: string;
};

export type InviteStatus = 'pending' | 'accepted' | 'declined' | 'tentative';

export type CalendarInvite = {
  id: string;
  event_id: string;
  invitee_id: string;
  status: InviteStatus;
};
