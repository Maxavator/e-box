
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useDirectMessaging } from "@/hooks/useDirectMessaging";
import { useGroupConversations } from "@/hooks/useGroupConversations";
import { useConversations } from "@/hooks/useConversations";
import { useMessages } from "@/hooks/useMessages";
import { useRealtime } from "@/hooks/useRealtime";
import { ChatSidebar } from "./ChatSidebar";
import { ChatContent } from "./ChatContent";
import { ChatInput } from "./ChatInput";
import { 
  MessageSquare, 
  UserPlus, 
  Users, 
  Search, 
  Bell,
  Hash,
  Building
} from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { toast } from "sonner";

export function MessagingSystem() {
  const [activeTab, setActiveTab] = useState("direct");
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isSearchUserOpen, setIsSearchUserOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [isPublicGroup, setIsPublicGroup] = useState(false);
  const [searchType, setSearchType] = useState<'name' | 'mobile' | 'id'>('name');
  const [searchTerm, setSearchTerm] = useState("");
  
  // Import our existing hooks plus the new ones
  const { 
    selectedConversation, 
    setSelectedConversation,
    filteredConversations 
  } = useConversations();
  
  const {
    newMessage: directMessage,
    setNewMessage: setDirectMessage,
    handleSendMessage,
    handleEditMessage,
    handleDeleteMessage,
    handleReaction
  } = useMessages(selectedConversation, setSelectedConversation);
  
  // Set up realtime updates
  useRealtime(selectedConversation, setSelectedConversation);
  
  // Direct messaging with invite system
  const {
    conversations: directConversations,
    invitations,
    isLoading: isDirectLoading,
    searchResults,
    isSearching,
    searchUsers,
    sendMessageInvitation,
    respondToInvitation,
    sendDirectMessage,
    forwardMessage,
    refreshInvitations
  } = useDirectMessaging();
  
  // Group conversations
  const {
    groups,
    selectedGroup,
    isLoading: isGroupsLoading,
    createGroup,
    joinGroup,
    inviteToGroup,
    respondToJoinRequest,
    leaveGroup,
    fetchGroupDetails,
    refreshGroups
  } = useGroupConversations();
  
  // Handle sending a message
  const handleSendNewMessage = () => {
    if (activeTab === "direct") {
      handleSendMessage();
    } else if (activeTab === "groups" && selectedGroup) {
      // Send group message
      sendDirectMessage({
        receiverId: selectedGroup.id,
        message: newMessage
      });
      setNewMessage("");
    }
  };
  
  // Handle creating a new group
  const handleCreateGroup = async () => {
    if (!groupName) {
      toast.error("Please enter a group name");
      return;
    }
    
    const result = await createGroup({
      name: groupName,
      description: groupDescription,
      isPublic: isPublicGroup
    });
    
    if (result) {
      setGroupName("");
      setGroupDescription("");
      setIsPublicGroup(false);
      setIsCreateGroupOpen(false);
      toast.success(`Group "${groupName}" created successfully`);
    }
  };
  
  // Handle user search
  const handleSearchUsers = () => {
    if (!searchTerm) {
      toast.error("Please enter a search term");
      return;
    }
    
    searchUsers({
      searchTerm,
      searchType
    });
  };
  
  // Handle sending an invitation
  const handleSendInvite = async (userId: string) => {
    const result = await sendMessageInvitation(userId);
    if (result) {
      setIsSearchUserOpen(false);
      setSearchTerm("");
      setSearchType('name');
    }
  };
  
  // Handle invitation response
  const handleRespondToInvite = async (invitationId: string, accept: boolean) => {
    await respondToInvitation(invitationId, accept);
    refreshInvitations();
  };
  
  // Get the content based on the active tab
  const getTabContent = () => {
    switch (activeTab) {
      case "direct":
        return (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={25} minSize={20} maxSize={30} className="h-full">
              <ChatSidebar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                conversations={directConversations}
                selectedConversation={selectedConversation}
                onSelectConversation={(conv) => setSelectedConversation(conv)}
                onCalendarActionClick={() => {}}
              />
              <div className="p-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsSearchUserOpen(true)}
                  className="w-full"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Find Contact
                </Button>
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={75} className="h-full">
              <div className="flex flex-col h-full">
                {selectedConversation ? (
                  <>
                    <div className="bg-muted/20 p-2 border-b flex justify-between items-center">
                      <h2 className="text-sm font-medium">{selectedConversation.name}</h2>
                    </div>
                    <ChatContent
                      conversation={selectedConversation}
                      onEditMessage={handleEditMessage}
                      onDeleteMessage={handleDeleteMessage}
                      onReactToMessage={handleReaction}
                    />
                    <ChatInput
                      value={directMessage}
                      onChange={setDirectMessage}
                      onSendMessage={handleSendMessage}
                    />
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full p-8 text-center">
                    <div>
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Select a Conversation</h3>
                      <p className="text-muted-foreground mb-4">
                        Choose a conversation from the sidebar or find a new contact
                      </p>
                      <Button onClick={() => setIsSearchUserOpen(true)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Find Contact
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        );
      
      case "groups":
        return (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={25} minSize={20} maxSize={30} className="h-full">
              <div className="p-3 border-b">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    <h2 className="font-medium">Groups</h2>
                  </div>
                </div>
                <Input
                  type="search"
                  placeholder="Search groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="p-3">
                <Button 
                  onClick={() => setIsCreateGroupOpen(true)}
                  className="w-full"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </div>
              
              <div className="p-2 space-y-2">
                {isGroupsLoading ? (
                  <div className="text-center p-4">Loading groups...</div>
                ) : groups.length === 0 ? (
                  <div className="text-center p-4">
                    <p className="text-muted-foreground">No groups found</p>
                    <p className="text-sm text-muted-foreground">
                      Create a new group or join an existing one
                    </p>
                  </div>
                ) : (
                  groups.map(group => (
                    <button
                      key={group.id}
                      className={`flex items-center gap-3 w-full p-3 rounded-lg ${
                        selectedGroup?.id === group.id
                          ? 'bg-muted'
                          : 'hover:bg-muted/60'
                      }`}
                      onClick={() => fetchGroupDetails(group.id)}
                    >
                      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        {group.isBusiness ? (
                          <Building className="h-5 w-5 text-primary" />
                        ) : (
                          <Users className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{group.name}</span>
                          {group.isPublic && (
                            <Badge variant="outline" className="ml-2">Public</Badge>
                          )}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Hash className="h-3 w-3 mr-1" />
                          <span className="truncate">{group.uniqueGroupId}</span>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={75} className="h-full">
              <div className="flex flex-col h-full">
                {selectedGroup ? (
                  <>
                    <div className="bg-muted/20 p-3 border-b">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-lg font-medium">{selectedGroup.name}</h2>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Hash className="h-3 w-3 mr-1" />
                            <span>{selectedGroup.uniqueGroupId}</span>
                            {selectedGroup.isPublic && (
                              <Badge variant="outline" className="ml-2">Public</Badge>
                            )}
                          </div>
                        </div>
                        <div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => leaveGroup(selectedGroup.id)}
                          >
                            Leave Group
                          </Button>
                        </div>
                      </div>
                      {selectedGroup.description && (
                        <p className="text-sm text-muted-foreground mt-2">{selectedGroup.description}</p>
                      )}
                    </div>
                    <div className="flex-1 overflow-auto p-4">
                      {/* Group messages would go here */}
                      <div className="text-center p-8">
                        <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Group Chat</h3>
                        <p className="text-muted-foreground">
                          This group has {selectedGroup.members?.length || 0} members
                        </p>
                      </div>
                    </div>
                    <div className="p-3 border-t">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendNewMessage();
                            }
                          }}
                        />
                        <Button onClick={handleSendNewMessage}>Send</Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full p-8 text-center">
                    <div>
                      <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Select a Group</h3>
                      <p className="text-muted-foreground mb-4">
                        Choose a group from the sidebar or create a new one
                      </p>
                      <Button onClick={() => setIsCreateGroupOpen(true)}>
                        <Users className="h-4 w-4 mr-2" />
                        Create Group
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Top Tabs */}
      <div className="border-b">
        <div className="container mx-auto py-1 px-2">
          <div className="flex justify-between items-center">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList>
                <TabsTrigger value="direct" className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Direct Messages
                </TabsTrigger>
                <TabsTrigger value="groups" className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Groups
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsNotificationsOpen(true)}
                className="relative"
              >
                <Bell className="h-5 w-5" />
                {invitations.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive text-xs text-white">
                    {invitations.length}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1">
        {getTabContent()}
      </div>
      
      {/* Create Group Dialog */}
      <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="group-name">Group Name</Label>
              <Input 
                id="group-name" 
                value={groupName} 
                onChange={(e) => setGroupName(e.target.value)} 
                placeholder="Enter group name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="group-description">Description (Optional)</Label>
              <Input 
                id="group-description" 
                value={groupDescription} 
                onChange={(e) => setGroupDescription(e.target.value)} 
                placeholder="Enter group description"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="public-group"
                checked={isPublicGroup}
                onChange={(e) => setIsPublicGroup(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="public-group">Make this group public</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateGroupOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateGroup}>Create Group</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Search Users Dialog */}
      <Dialog open={isSearchUserOpen} onOpenChange={setIsSearchUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Find Contacts</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="space-y-2 flex-1">
                <Label htmlFor="search-term">Search Term</Label>
                <Input 
                  id="search-term" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  placeholder="Enter name, mobile number, or ID"
                />
              </div>
              <div className="space-y-2 w-1/3">
                <Label htmlFor="search-type">Search By</Label>
                <select
                  id="search-type"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="name">Name</option>
                  <option value="mobile">Mobile</option>
                  <option value="id">ID Number</option>
                </select>
              </div>
            </div>
            <Button 
              onClick={handleSearchUsers} 
              className="w-full"
              disabled={isSearching}
            >
              {isSearching ? "Searching..." : "Search"}
              <Search className="h-4 w-4 ml-2" />
            </Button>
            
            {searchResults.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Search Results</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {searchResults.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-2 border rounded-md">
                      <div>
                        <p className="font-medium">{user.first_name} {user.last_name}</p>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleSendInvite(user.id)}
                      >
                        Invite
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Notifications Dialog */}
      <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Message Invitations</h3>
            {invitations.length === 0 ? (
              <p className="text-sm text-muted-foreground">You have no pending invitations</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {invitations.map((invitation) => (
                  <Card key={invitation.id}>
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">
                        {invitation.sender.first_name} {invitation.sender.last_name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      {invitation.initial_message && (
                        <p className="text-sm text-muted-foreground mb-2">
                          "{invitation.initial_message}"
                        </p>
                      )}
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRespondToInvite(invitation.id, false)}
                        >
                          Decline
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleRespondToInvite(invitation.id, true)}
                        >
                          Accept
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
