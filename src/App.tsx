
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Toaster } from "sonner";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import AdminPortal from "./pages/AdminPortal";
import OrganizationManagement from "./pages/OrganizationManagement";
import GovZA from "./pages/GovZA";
import Chat from "./pages/Chat";
import Changelog from "./pages/Changelog";
import NotFound from "./pages/NotFound";
import MessagingPage from "./pages/Messaging";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();
  const supabase = useSupabaseClient();

  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.info("Session found:", session);
        } else {
          console.warn("No session found");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [supabase]);

  // Using Outlet from react-router-dom for the protected routes
  const ProtectedRoute = () => {
    if (!session && !isLoading) {
      return <Navigate to="/auth" replace />;
    }

    return <Outlet />;
  };

  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/organization" element={<OrganizationDashboard />} />
          <Route path="/admin" element={<AdminPortal />} />
          <Route path="/organization-management" element={<OrganizationManagement />} />
          <Route path="/govza" element={<GovZA />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/messaging" element={<MessagingPage />} />
          <Route path="/changelog" element={<Changelog />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
