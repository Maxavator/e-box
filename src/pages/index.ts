
import Auth from "./Auth";
import Dashboard from "./Dashboard";
import NotFound from "./NotFound";
import Chat from "./Chat";
import AdminPortal from "./AdminPortal";
import OrganizationDashboard from "./OrganizationDashboard";
import Changelog from "./Changelog";
import Index from "./Index";
import Contacts from "./Contacts";
import Notes from "./Notes";
import GovZA from "./GovZA";

// Import components rather than pages for these since we don't have the page files
import { Settings } from "@/components/settings/Settings";
import { ContactsList } from "@/components/desk/contacts/ContactsList";
import { Calendar } from "@/components/desk/Calendar";
import { Documents } from "@/components/desk/Documents";
import { LeaveManager } from "@/components/desk/LeaveManager";
import { Policies } from "@/components/desk/Policies";
import { MyDesk as Desk } from "@/components/desk/MyDesk";

export {
  Index,
  Auth,
  Dashboard,
  NotFound,
  Chat,
  AdminPortal,
  OrganizationDashboard,
  Changelog,
  Settings,
  Contacts,
  ContactsList,
  Notes,
  GovZA,
  Calendar,
  Documents,
  LeaveManager,
  Policies,
  Desk
};
