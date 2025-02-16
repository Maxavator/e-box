
export interface NewEventFormData {
  title: string;
  description: string;
  location: string;
  isOnline: boolean;
  meetingLink: string;
  date: Date;
  startTime: string;
  endTime: string;
  invitees: string[];
}
