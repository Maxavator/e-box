
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect } from "react";
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";
import AdminPortal from "./pages/AdminPortal";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import NotFound from "./pages/NotFound";
import { ContactsList } from "./components/desk/ContactsList";

const queryClient = new QueryClient();

const ContactsWithChat = () => {
  return (
    <div className="flex w-full">
      <div className="w-80 border-r">
        <Chat />
      </div>
      <div className="flex-1">
        <ContactsList />
      </div>
    </div>
  );
};

const AppContent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleFeatureSelect = (event: CustomEvent<string>) => {
      if (event.detail === 'contacts') {
        navigate('/contacts');
      }
    };

    window.addEventListener('desk-feature-selected', handleFeatureSelect as EventListener);

    return () => {
      window.removeEventListener('desk-feature-selected', handleFeatureSelect as EventListener);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/admin" element={<AdminPortal />} />
        <Route path="/organization" element={<OrganizationDashboard />} />
        <Route path="/contacts" element={<ContactsWithChat />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <SidebarProvider>
          <AppContent />
          <Toaster />
          <Sonner />
        </SidebarProvider>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
