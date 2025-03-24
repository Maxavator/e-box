
import React, { Suspense, useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

// Import individual page components
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Chat from '@/pages/Chat';
import Changelog from '@/pages/Changelog';
import AdminPortal from '@/pages/AdminPortal';
import OrganizationDashboard from '@/pages/OrganizationDashboard';
import Notes from '@/pages/Notes'; // Add this import

// Import from components directory rather than pages for these components
import { Settings } from '@/components/settings/Settings';
import { Documents } from '@/components/desk/Documents';
import { Calendar } from '@/components/desk/Calendar';
import { ContactsList } from '@/components/desk/ContactsList';
import { LeaveManager } from '@/components/desk/LeaveManager';
import { Policies } from '@/components/desk/Policies';
import { MyDesk } from '@/components/desk/MyDesk';

// Import auth and UI components
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Import the MainLayout
import { MainLayout } from '@/components/shared/MainLayout';
import { AuthenticationDialog } from '@/components/auth/AuthenticationDialog';

function App() {
  const [isMounted, setIsMounted] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const session = useSession();
  const supabase = useSupabaseClient();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!supabase || !supabase.auth) {
      console.error("Supabase client is not properly initialized");
      return () => {};
    }

    const handleAuthStateChange = async (event: string, newSession: any) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_OUT') {
        // Show auth dialog instead of redirecting if on a protected route
        if (location.pathname !== '/' && location.pathname !== '/auth') {
          setShowAuthDialog(true);
        } else {
          navigate('/auth');
        }
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Close auth dialog and stay on current page if dialog was shown
        setShowAuthDialog(false);
        
        // If on auth page, redirect to dashboard
        if (location.pathname === '/auth') {
          navigate('/dashboard');
        }
      }
    };

    try {
      const { data } = supabase.auth.onAuthStateChange(handleAuthStateChange);
      
      return () => {
        if (data?.subscription?.unsubscribe) {
          data.subscription.unsubscribe();
        }
      };
    } catch (error) {
      console.error("Error setting up auth state change listener:", error);
      return () => {};
    }
  }, [location, navigate, supabase]);

  // Wrap protected route components with MainLayout
  const withLayout = (Component: React.ComponentType) => (props: any) => (
    <MainLayout>
      <Component {...props} />
    </MainLayout>
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light" 
        enableSystem={false}
        disableTransitionOnChange
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Protected routes - all wrapped with MainLayout */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={withLayout(Dashboard)({})} />
            <Route path="/chat" element={withLayout(Chat)({})} />
            <Route path="/mydesk" element={withLayout(MyDesk)({})} />
            <Route path="/documents" element={withLayout(Documents)({})} />
            <Route path="/calendar" element={withLayout(Calendar)({})} />
            <Route path="/contacts" element={withLayout(ContactsList)({})} />
            <Route path="/leave" element={withLayout(LeaveManager)({})} />
            <Route path="/policies" element={withLayout(Policies)({})} />
            <Route path="/notes" element={withLayout(Notes)({})} /> {/* Add this route */}
            <Route path="/profile" element={withLayout(Settings)({})} />
            <Route path="/organization" element={withLayout(OrganizationDashboard)({})} />
            <Route path="/admin" element={withLayout(AdminPortal)({})} />
            <Route path="/changelog" element={withLayout(Changelog)({})} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        {/* Global auth dialog */}
        <AuthenticationDialog 
          isOpen={showAuthDialog}
          onClose={() => setShowAuthDialog(false)}
        />
        
        <Toaster />
        <Sonner />
      </ThemeProvider>
    </Suspense>
  );
}

export default App;
