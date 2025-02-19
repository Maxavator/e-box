
import { Button } from "@/components/ui/button";
import { LogOut, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { UserManagement } from "@/components/admin/UserManagement";
import { OrganizationManagement } from "@/components/admin/OrganizationManagement";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { AppHeader } from "@/components/shared/AppHeader";
import { Dashboard } from "@/components/admin/dashboard/Dashboard";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminPortal = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'dashboard' | 'users' | 'organizations' | 'settings'>('dashboard');
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/auth');
          return;
        }

        const { data: isAdmin, error } = await supabase.rpc('is_global_admin');
        
        if (error) {
          console.error('Error checking admin status:', error);
          toast.error('Failed to verify admin status');
          navigate('/');
          return;
        }

        if (!isAdmin) {
          toast.error('You do not have permission to access the admin portal');
          navigate('/');
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Error in checkAuthorization:', error);
        toast.error('Failed to verify authentication status');
        navigate('/');
      }
    };

    checkAuthorization();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleLogoClick = () => {
    navigate("/organization");
  };

  const handleBackToDashboard = () => {
    setActiveView('dashboard');
  };

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Verifying access...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  const renderView = () => {
    switch (activeView) {
      case 'users':
        return <UserManagement />;
      case 'organizations':
        return <OrganizationManagement />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <Dashboard onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <AppHeader onLogout={handleLogout} onLogoClick={handleLogoClick} />

      <main className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Admin Portal
            </h1>
            <p className="text-sm text-gray-500">
              Manage your organization's users, settings, and more
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center gap-2 shadow-sm hover:bg-gray-50 transition-colors"
            size={isMobile ? "sm" : "default"}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {activeView !== 'dashboard' && (
          <Button 
            variant="ghost" 
            onClick={handleBackToDashboard}
            className="mb-6 hover:bg-gray-100 text-gray-600 -ml-2"
            size={isMobile ? "sm" : "default"}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        )}
        
        <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default AdminPortal;
