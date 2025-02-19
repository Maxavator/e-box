
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";
import AdminPortal from "./pages/AdminPortal";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import NotFound from "./pages/NotFound";
import { ContactsList } from "./components/desk/ContactsList";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-background">
            <Routes>
              <Route path="/" element={<Auth />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/admin" element={<AdminPortal />} />
              <Route path="/organization" element={<OrganizationDashboard />} />
              <Route path="/contacts" element={<ContactsList />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster />
          <Sonner />
        </SidebarProvider>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
