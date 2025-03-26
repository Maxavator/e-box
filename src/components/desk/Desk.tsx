
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MyDesk } from "@/components/desk/MyDesk";
import { Documents } from "@/components/desk/Documents";
import { LeaveManager } from "@/components/desk/LeaveManager";
import { Policies } from "@/components/desk/Policies";
import { Calendar } from "@/components/desk/Calendar";
import { ContactsList } from "@/components/desk/contacts/ContactsList";
import { Inbox } from "@/components/desk/Inbox";
import { Payslip } from "@/components/desk/Payslip";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Desk() {
  const { page } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect legacy routes
    if (!page && window.location.pathname === "/desk") {
      navigate("/mydesk", { replace: true });
    }
  }, [page, navigate]);
  
  const handleBackToDesk = () => {
    navigate("/mydesk");
  };
  
  // Create a navigation header for subpages
  const renderHeader = () => {
    if (!page) return null;
    
    return (
      <Card className="mb-6 shadow-sm">
        <CardContent className="p-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={handleBackToDesk}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Desk</span>
          </Button>
        </CardContent>
      </Card>
    );
  };
  
  // Render different components based on the subpage
  if (page) {
    let Component = null;
    
    switch (page) {
      case "documents":
        Component = Documents;
        break;
      case "leave":
        Component = LeaveManager;
        break;
      case "policies":
        Component = Policies;
        break;
      case "calendar":
        // If user navigates to /desk/calendar, redirect to the main calendar page
        useEffect(() => {
          if (page === "calendar") {
            navigate("/calendar");
          }
        }, []);
        return null;
      case "colleagues":
        Component = ContactsList;
        break;
      case "inbox":
        Component = Inbox;
        break;
      case "payslip":
        Component = Payslip;
        break;
      default:
        // If page doesn't exist, navigate to the main desk page
        navigate("/mydesk", { replace: true });
        return null;
    }
    
    return (
      <div className="p-4 md:p-6">
        {renderHeader()}
        <Component />
      </div>
    );
  }
  
  // Default to the main desk view
  return <MyDesk />;
}
