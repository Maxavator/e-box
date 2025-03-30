
import React from "react";
import { FileText, Calendar, MessageCircle, User } from "lucide-react";
import { QuickActionCard } from "./QuickActionCard";

interface QuickActionsSectionProps {
  handleQuickAction: (action: string) => void;
}

export const QuickActionsSection = ({ handleQuickAction }: QuickActionsSectionProps) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-6">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickActionCard
          title="Documents"
          description="Access your files"
          icon={<FileText className="w-5 h-5" />}
          onClick={() => handleQuickAction('documents')}
        />
        <QuickActionCard
          title="Calendar"
          description="View schedule"
          icon={<Calendar className="w-5 h-5" />}
          onClick={() => handleQuickAction('calendar')}
        />
        <QuickActionCard
          title="Messages"
          description="Chat with team"
          icon={<MessageCircle className="w-5 h-5" />}
          onClick={() => handleQuickAction('messages')}
        />
        <QuickActionCard
          title="Profile"
          description="Update settings"
          icon={<User className="w-5 h-5" />}
          onClick={() => handleQuickAction('profile')}
        />
      </div>
    </div>
  );
};
