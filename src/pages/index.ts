
// Barrel export for pages - this can help with imports in the future
export { default as Index } from './Index';
export { default as Auth } from './Auth';
export { default as Dashboard } from './Dashboard';
export { default as NotFound } from './NotFound';
export { default as Chat } from './Chat';
export { default as AdminPortal } from './AdminPortal';
export { default as OrganizationDashboard } from './OrganizationDashboard';
export { default as Changelog } from './Changelog';

// These are actually imported from components directory, not pages
// We're re-exporting them here for consistency
export { Settings } from '@/components/settings/Settings';
export { Documents } from '@/components/desk/Documents';
export { Calendar } from '@/components/desk/Calendar';
export { ContactsList } from '@/components/desk/ContactsList';
export { LeaveManager } from '@/components/desk/LeaveManager';
export { Policies } from '@/components/desk/Policies';
