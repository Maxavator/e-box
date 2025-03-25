
import { Button } from "@/components/ui/button";
import { UsersRound, Store, Mail, User2, UserPlus } from "lucide-react";

interface EmptyContactsProps {
  type: "personal" | "retail" | "groups" | "invites";
  subtype?: "pending" | "accepted" | "declined";
}

export const EmptyContacts = ({ type, subtype }: EmptyContactsProps) => {
  let icon;
  let title;
  let description;
  let actionLabel;
  let actionIcon;
  let onAction = () => {}; // Default empty function
  
  switch (type) {
    case "personal":
      icon = <UsersRound className="h-12 w-12 text-primary opacity-70" />;
      title = "No Personal Contacts Yet";
      description = "Your personal contacts will appear here. Search for contacts or send invitations to connect.";
      actionLabel = "Add Contact";
      actionIcon = <UserPlus className="h-4 w-4 mr-2" />;
      break;
      
    case "retail":
      icon = <Store className="h-12 w-12 text-primary opacity-70" />;
      title = "No Retail Partners Connected";
      description = "Connect with retail businesses where you're a customer, supplier, or stakeholder.";
      actionLabel = "Add Retail Partner";
      actionIcon = <Store className="h-4 w-4 mr-2" />;
      break;
      
    case "groups":
      icon = <UsersRound className="h-12 w-12 text-primary opacity-70" />;
      title = "No Contact Groups Created";
      description = "Organize your contacts into groups for easier management and communication.";
      actionLabel = "Create Group";
      actionIcon = <UsersRound className="h-4 w-4 mr-2" />;
      break;
      
    case "invites":
      icon = <Mail className="h-12 w-12 text-primary opacity-70" />;
      
      if (subtype === "pending") {
        title = "No Pending Invitations";
        description = "You haven't sent any invitations that are still pending.";
      } else if (subtype === "accepted") {
        title = "No Accepted Invitations";
        description = "None of your sent invitations have been accepted yet.";
      } else if (subtype === "declined") {
        title = "No Declined Invitations";
        description = "None of your sent invitations have been declined.";
      } else {
        title = "No Invitations";
        description = "You haven't sent any invitations yet.";
      }
      
      actionLabel = "Send Invitation";
      actionIcon = <Mail className="h-4 w-4 mr-2" />;
      break;
      
    default:
      icon = <User2 className="h-12 w-12 text-primary opacity-70" />;
      title = "No Data Available";
      description = "There's nothing to display here yet.";
      actionLabel = "Get Started";
      actionIcon = <User2 className="h-4 w-4 mr-2" />;
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon}
      <h3 className="mt-4 text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">{description}</p>
      {actionLabel && (
        <Button 
          onClick={onAction} 
          className="mt-6"
        >
          {actionIcon}
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
