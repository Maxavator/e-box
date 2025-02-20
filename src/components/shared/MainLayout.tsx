
import { AppHeader } from "@/components/shared/AppHeader";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    // Handle logout logic here
    navigate('/auth');
  };

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader onLogout={handleLogout} onLogoClick={handleLogoClick} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
