
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

export default function Desk() {
  const { page } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect legacy routes
    if (!page && window.location.pathname === "/desk") {
      navigate("/mydesk", { replace: true });
    }
  }, [page, navigate]);
  
  // Render different components based on the subpage
  if (page) {
    switch (page) {
      case "documents":
        return <Documents />;
      case "leave":
        return <LeaveManager />;
      case "policies":
        return <Policies />;
      case "calendar":
        return <Calendar />;
      case "colleagues":
        return <ContactsList />;
      case "inbox":
        return <Inbox />;
      case "payslip":
        return <Payslip />;
      default:
        // If page doesn't exist, navigate to the main desk page
        navigate("/mydesk", { replace: true });
        return null;
    }
  }
  
  // Default to the main desk view
  return <MyDesk />;
}
