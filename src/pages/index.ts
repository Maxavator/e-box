
import AdminPortal from "./AdminPortal";
import Auth from "./Auth";
import Chat from "./Chat";
import Contacts from "./Contacts";
import Dashboard from "./Dashboard";
import Desk from "./Desk";
import GovZA from "./GovZA";
import Index from "./Index";
import LogoutPage from "./LogoutPage";
import NotFound from "./NotFound";
import Notes from "./Notes";
import OrganizationManagementPage from "./OrganizationManagement";
import Changelog from "./Changelog";
import MyDocuments from "./MyDocuments";

// Add OrganizationDashboard alias
const OrganizationDashboard = OrganizationManagementPage;

// These components need to be properly referenced from their actual locations
// For now, we'll create temporary exports that reference existing components
const Settings = Desk; // Temporary alias for Settings page
const Documents = Desk; // Temporary alias for Documents page
const Calendar = Desk; // Temporary alias for Calendar page
const LeaveManager = Desk; // Temporary alias for LeaveManager page
const Policies = Desk; // Temporary alias for Policies page
// Using existing Contacts component instead of ContactsList
const ContactsList = Contacts; // This fixes the error in App.tsx

export {
  AdminPortal,
  Auth,
  Chat,
  Contacts,
  Dashboard,
  Desk,
  GovZA,
  Index,
  LogoutPage,
  NotFound,
  Notes,
  OrganizationManagementPage,
  Changelog,
  MyDocuments,
  // Add missing exports
  OrganizationDashboard,
  Settings,
  Documents,
  Calendar,
  LeaveManager,
  Policies,
  ContactsList
};
