import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/shared/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { MainLayout } from '@/layouts/MainLayout';
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';
import { Index, Auth, Dashboard, NotFound, Chat, AdminPortal, OrganizationDashboard, Changelog, Settings, Documents, Calendar, ContactsList, LeaveManager, Policies, Desk, Notes } from './pages';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import GovZA from "./pages/GovZA";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const ProtectedLayoutRoute = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <Outlet />
      </MainLayout>
    </ProtectedRoute>
  );
};

const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";
  
  return (
    <ThemeProvider 
      defaultTheme="light" 
      storageKey="e-box-theme"
      forcedTheme={isAuthPage ? "light" : undefined}
    >
      {children}
    </ThemeProvider>
  );
};

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <ThemeWrapper><Outlet /></ThemeWrapper>,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <Index />,
        },
        {
          path: '/auth',
          element: <Auth />,
        },
        {
          path: '/changelog',
          element: <Changelog />,
        },
        {
          element: <ProtectedLayoutRoute />,
          children: [
            {
              path: '/dashboard',
              element: <Dashboard />,
            },
            {
              path: '/chat',
              element: <Chat />,
            },
            {
              path: '/calendar',
              element: <Calendar />,
            },
            {
              path: '/contacts',
              element: <ContactsList />,
            },
            {
              path: '/documents',
              element: <Documents />,
            },
            {
              path: '/notes',
              element: <Notes />,
            },
            {
              path: '/surveys',
              element: <div>Surveys</div>,
            },
            {
              path: '/admin',
              element: <AdminPortal />,
            },
            {
              path: '/organization',
              element: <OrganizationDashboard />,
            },
            {
              path: '/admin/users',
              element: <AdminPortal />,
            },
            {
              path: '/profile',
              element: <Settings />,
            },
            {
              path: '/leave',
              element: <LeaveManager />,
            },
            {
              path: '/policies',
              element: <Policies />,
            },
            {
              path: '/mydesk',
              element: <Desk />,
            },
            {
              path: '/desk/:page',
              element: <Desk />,
            },
          ]
        },
        {
          path: '/govza/*',
          element: (
            <MainLayout>
              <GovZA />
            </MainLayout>
          ),
        },
        {
          path: '*',
          element: <NotFound />,
        },
      ]
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
