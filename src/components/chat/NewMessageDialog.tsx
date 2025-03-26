
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";
import { useNewMessageDialog } from "./dialog/useNewMessageDialog";
import { NewMessageTabs } from "./dialog/NewMessageTabs";

interface NewMessageDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelectConversation?: (conversationId: string) => void;
}

export function NewMessageDialog({ 
  open, 
  onOpenChange,
  onSelectConversation
}: NewMessageDialogProps) {
  const {
    searchQuery,
    setSearchQuery,
    dialogOpen,
    setDialogOpen,
    activeTab,
    setActiveTab,
    colleagues,
    groups,
    isLoadingColleagues,
    isLoadingGroups,
    handleSelectUser,
    handleSelectColleague,
    handleSelectGroup
  } = useNewMessageDialog(onSelectConversation);

  const isOpen = open !== undefined ? open : dialogOpen;
  const setIsOpen = onOpenChange || setDialogOpen;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Pen className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <NewMessageTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelectUser={handleSelectUser}
            onSelectColleague={handleSelectColleague}
            onSelectGroup={handleSelectGroup}
            colleagues={colleagues}
            groups={groups}
            isLoadingColleagues={isLoadingColleagues}
            isLoadingGroups={isLoadingGroups}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
