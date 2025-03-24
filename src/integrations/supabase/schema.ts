
// This file provides a schema reference for Supabase tables
// It helps with documentation but doesn't affect runtime

// Schema information for your Supabase database
export const schema = {
  tables: {
    organizations: 'Organizations - stores company information',
    profiles: 'Profiles - extends auth.users with additional user data',
    user_roles: 'User roles - defines user permissions in the system',
    conversations: 'Conversations - stores chat conversations between users',
    calendar_tasks: 'Calendar tasks - personal tasks for users',
    documents: 'Documents - files uploaded by users',
    calendar_events: 'Calendar events - meetings and appointments',
    calendar_event_invites: 'Calendar event invites - attendees for events',
    leave_requests: 'Leave requests - time off requests',
    contacts: 'Contacts - user connections',
    notifications: 'Notifications - system messages to users'
  },
  enums: {
    user_role: 'User role types (global_admin, org_admin, staff, user)',
    leave_type: 'Leave request types (annual, sick, family, study, other)',
    leave_status: 'Leave request statuses (pending, approved, rejected, cancelled)'
  }
};
