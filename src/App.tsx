
import React, { Suspense, useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

// Import individual page components
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Settings from '@/pages/Settings';
import Chat from '@/pages/Chat';
import Documents from '@/pages/Documents';
import Calendar from '@/pages/Calendar';
import ContactsList from '@/pages/ContactsList';
import LeaveManager from '@/pages/LeaveManager';
import Policies from '@/pages/Policies';
import AdminPortal from '@/pages/AdminPortal';
import OrganizationDashboard from '@/pages/OrganizationDashboard';
import Changelog from '@/pages/Changelog';

// Import auth and UI components
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

function App() {
  const [isMounted, setIsMounted] = useState(false);
  const session = useSession();
  const supabase = useSupabaseClient();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleAuthStateChange = async (_event: any, _session: any) => {
      if (!session && location.pathname !== '/auth') {
        navigate('/auth');
      } else if (session && location.pathname === '/auth') {
        navigate('/dashboard');
      }
    };

    const { data } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      // Corrected: use the unsubscribe function returned by onAuthStateChange
      data?.subscription.unsubscribe();
    };
  }, [session, location, navigate, supabase]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/contacts" element={<ContactsList />} />
            <Route path="/leave" element={<LeaveManager />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/profile" element={<Settings />} />
            <Route path="/organization" element={<OrganizationDashboard />} />
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="/changelog" element={<Changelog />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />
      </ThemeProvider>
    </Suspense>
  );
}

export default App;
