
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus, Users, Trash2, PenLine } from "lucide-react";
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import { useGroupManagement } from "@/components/admin/organization/hooks/useGroupManagement";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

export function GroupManagement() {
  const { isAdmin, userRole, userProfile } = useUserRole();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  
  const { groups, isLoading, createGroup, updateGroup, deleteGroup } = useGroupManagement();
  
  // Check if user has admin access
  const hasAdminAccess = isAdmin || userRole === 'global_admin' || userRole === 'org_admin';
  
  if (!hasAdminAccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Organization Groups</CardTitle>
          <CardDescription>Create and manage groups within your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Permission Denied</h3>
            <p className="text-muted-foreground">
              Only Global Admins and Organization Admins can manage organization groups.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const handleCreateGroup = async () => {
    try {
      if (!groupName.trim()) {
        toast.error("Group name is required");
        return;
      }
      
      await createGroup({
        name: groupName,
        description,
        is_public: isPublic,
        organization_id: userProfile?.organization_id || null
      });
      
      setGroupName("");
      setDescription("");
      setIsPublic(false);
      setIsCreateOpen(false);
      toast.success("Group created successfully");
    } catch (error) {
      console.error("Failed to create group:", error);
      toast.error("Failed to create group");
    }
  };
  
  const handleUpdateGroup = async () => {
    try {
      if (!selectedGroupId || !groupName.trim()) {
        toast.error("Group name is required");
        return;
      }
      
      await updateGroup(selectedGroupId, {
        name: groupName,
        description,
        is_public: isPublic
      });
      
      setGroupName("");
      setDescription("");
      setIsPublic(false);
      setSelectedGroupId(null);
      setIsEditOpen(false);
      toast.success("Group updated successfully");
    } catch (error) {
      console.error("Failed to update group:", error);
      toast.error("Failed to update group");
    }
  };
  
  const handleDeleteGroup = async (groupId: string) => {
    try {
      if (confirm("Are you sure you want to delete this group?")) {
        await deleteGroup(groupId);
        toast.success("Group deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete group:", error);
      toast.error("Failed to delete group");
    }
  };
  
  const openEditDialog = (group: any) => {
    setSelectedGroupId(group.id);
    setGroupName(group.name);
    setDescription(group.description || "");
    setIsPublic(group.is_public);
    setIsEditOpen(true);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Organization Groups</CardTitle>
          <CardDescription>Create and manage groups within your organization</CardDescription>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
              <DialogDescription>
                Create a new group for your organization. Groups can be used for team communication and organization.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name</Label>
                <Input 
                  id="name" 
                  value={groupName} 
                  onChange={(e) => setGroupName(e.target.value)} 
                  placeholder="Enter group name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Enter group description"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isPublic">Public Group</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateGroup}>Create Group</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <p>Loading groups...</p>
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Groups Found</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first organization group.
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Members</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell className="font-medium">{group.name}</TableCell>
                  <TableCell>{group.description || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={group.is_public ? "default" : "outline"}>
                      {group.is_public ? "Public" : "Private"}
                    </Badge>
                  </TableCell>
                  <TableCell>{group.member_count || 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(group)}>
                        <PenLine className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteGroup(group.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Group</DialogTitle>
              <DialogDescription>
                Update group details and settings.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Group Name</Label>
                <Input 
                  id="edit-name" 
                  value={groupName} 
                  onChange={(e) => setGroupName(e.target.value)} 
                  placeholder="Enter group name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea 
                  id="edit-description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Enter group description"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="edit-isPublic">Public Group</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateGroup}>Update Group</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
