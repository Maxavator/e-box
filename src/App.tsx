
import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/shared/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { MainLayout } from '@/layouts/MainLayout';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Index, Auth, Dashboard, NotFound, Chat, AdminPortal, OrganizationDashboard, Changelog, Settings, Documents, Calendar, ContactsList, LeaveManager, Policies, Desk } from './pages';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import GovZA from "./pages/GovZA";

const queryClient = new QueryClient();

// Create a layout route component that doesn't add another Router
const ProtectedLayoutRoute = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <Outlet />
      </MainLayout>
    </ProtectedRoute>
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
      element: <Index />,
      errorElement: <NotFound />,
    },
    {
      path: '/auth',
      element: <Auth />,
    },
    {
      path: '/changelog',
      element: <Changelog />,
    },
    // Protected routes using the layout route pattern
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
          element: <div>Notes</div>,
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
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="e-box-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
