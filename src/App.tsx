import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from './components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { MainLayout } from '@/layouts/MainLayout';
import { createBrowserRouter, RouterProvider, useLocation } from 'react-router-dom';
import { Index, Auth, Dashboard, NotFound, Chat, AdminPortal, OrganizationDashboard, Changelog, Settings, Documents, Calendar, ContactsList, LeaveManager, Policies, Desk } from './pages';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import GovZA from "./pages/GovZA";

const queryClient = new QueryClient();

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

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="e-box-theme">
        <RouterProvider
          router={createBrowserRouter([
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
            {
              path: '/dashboard',
              element: (
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: '/chat',
              element: (
                <ProtectedRoute>
                  <MainLayout>
                    <Chat />
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: '/calendar',
              element: (
                <ProtectedRoute>
                  <MainLayout>
                    <Calendar />
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: '/contacts',
              element: (
                <ProtectedRoute>
                  <MainLayout>
                    <ContactsList />
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: '/documents',
              element: (
                <ProtectedRoute>
                  <MainLayout>
                    <Documents />
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: '/notes',
              element: (
                <ProtectedRoute>
                  <MainLayout>
                    <div>Notes</div>
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: '/surveys',
              element: (
                <ProtectedRoute>
                  <MainLayout>
                    <div>Surveys</div>
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: '/admin',
              element: (
                <ProtectedRoute>
                  <MainLayout>
                    <AdminPortal />
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: '/organization',
              element: (
                <ProtectedRoute>
                  <MainLayout>
                    <OrganizationDashboard />
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: '/admin/users',
              element: (
                <ProtectedRoute>
                  <MainLayout>
                    <AdminPortal />
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: '/profile',
              element: (
                <ProtectedRoute>
                  <MainLayout>
                    <Settings />
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: '/leave',
              element: (
                <ProtectedRoute>
                  <MainLayout>
                    <LeaveManager />
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: '/policies',
              element: (
                <ProtectedRoute>
                  <MainLayout>
                    <Policies />
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: '/mydesk',
              element: (
                <ProtectedRoute>
                  <MainLayout>
                    <Desk />
                  </MainLayout>
                </ProtectedRoute>
              ),
            },
            {
              path: '/desk/:page',
              element: (
                <ProtectedRoute>
                  <MainLayout>
                    <Desk />
                  </MainLayout>
                </ProtectedRoute>
              ),
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
          ])}
        />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
