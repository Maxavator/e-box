
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { ThemeProvider } from "@/components/shared/theme-provider"
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import AdminPortal from "@/pages/AdminPortal";
import OrganizationDashboard from "@/pages/OrganizationDashboard";
import OrganizationManagementPage from "@/pages/OrganizationManagement";
import Chat from "@/pages/Chat";
import AdminChat from "@/pages/AdminChat";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a global QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-react-theme">
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/admin-chat" element={<AdminChat />} />
            <Route path="/documents" element={<Dashboard />} />
            <Route path="/calendar" element={<Dashboard />} />
            <Route path="/contacts" element={<Dashboard />} />
            <Route path="/leave" element={<Dashboard />} />
            <Route path="/policies" element={<Dashboard />} />
            <Route path="/profile" element={<Dashboard />} />
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="/organization" element={<OrganizationDashboard />} />
            <Route path="/organization/manage" element={<OrganizationManagementPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
