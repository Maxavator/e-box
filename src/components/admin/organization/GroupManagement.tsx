import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useGroupManagement } from './hooks/useGroupManagement';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Group } from '@/types/chat';

export function GroupManagement() {
  const { 
    isAdmin, userRole, isLoading, error, session,
    groups, members, 
    isCreatingGroup, isEditingGroup, selectedGroup, confirmDelete,
    setIsCreatingGroup, setIsEditingGroup, setSelectedGroup, setConfirmDelete,
    createGroup, updateGroup, deleteGroup
  } = useGroupManagement();

  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [editGroupName, setEditGroupName] = useState('');
  const [editGroupDescription, setEditGroupDescription] = useState('');
  const { toast } = useToast();

  const handleOpenCreateGroup = () => {
    setIsCreatingGroup(true);
    setNewGroupName('');
    setNewGroupDescription('');
  };

  const handleCloseCreateGroup = () => {
    setIsCreatingGroup(false);
  };

  const handleCreate = async () => {
    if (!newGroupName.trim()) {
      toast({
        title: "Error",
        description: "Group name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createGroup({
        name: newGroupName,
        description: newGroupDescription,
        isPublic: true, // Default value
        organizationId: session?.user?.id, // Assuming organizationId is the user ID
        createdBy: session?.user?.id,
      });
      toast({
        title: "Success",
        description: "Group created successfully.",
      });
      handleCloseCreateGroup();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to create group.",
        variant: "destructive",
      });
    }
  };

  const handleOpenEditGroup = (group: Group) => {
    setIsEditingGroup(true);
    setSelectedGroup(group);
    setEditGroupName(group.name);
    setEditGroupDescription(group.description || '');
  };

  const handleCloseEditGroup = () => {
    setIsEditingGroup(false);
    setSelectedGroup(null);
  };

  const handleEdit = async () => {
    if (!editGroupName.trim()) {
      toast({
        title: "Error",
        description: "Group name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedGroup) return;

    try {
      await updateGroup({
        id: selectedGroup.id,
        name: editGroupName,
        description: editGroupDescription,
      });
      toast({
        title: "Success",
        description: "Group updated successfully.",
      });
      handleCloseEditGroup();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update group.",
        variant: "destructive",
      });
    }
  };

  const handleOpenDeleteConfirmation = (groupId: string) => {
    setConfirmDelete(groupId);
  };

  const handleCloseDeleteConfirmation = () => {
    setConfirmDelete(null);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;

    try {
      await deleteGroup(confirmDelete);
      toast({
        title: "Success",
        description: "Group deleted successfully.",
      });
      handleCloseDeleteConfirmation();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete group.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Group Management</h2>
        <Button onClick={handleOpenCreateGroup}>
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      <ScrollArea className="rounded-md border">
        <Table>
          <TableCaption>A list of your organization groups.</TableCaption>
          <TableHead>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell className="font-medium">{group.name}</TableCell>
                <TableCell>{group.description}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenEditGroup(group)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleOpenDeleteConfirmation(group.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>
                {groups.length} Total Group(s)
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </ScrollArea>

      {/* Create Group Dialog */}
      <Dialog open={isCreatingGroup} onOpenChange={setIsCreatingGroup}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Group</DialogTitle>
            <DialogDescription>
              Create a new group for your organization.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input id="name" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right">
                Description
              </label>
              <Input id="description" value={newGroupDescription} onChange={(e) => setNewGroupDescription(e.target.value)} className="col-span-3" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="button" variant="secondary" onClick={handleCloseCreateGroup}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleCreate}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Group Dialog */}
      <Dialog open={isEditingGroup} onOpenChange={setIsEditingGroup}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
            <DialogDescription>
              Edit the details of the selected group.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input id="edit-name" value={editGroupName} onChange={(e) => setEditGroupName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right">
                Description
              </label>
              <Input id="edit-description" value={editGroupDescription} onChange={(e) => setEditGroupDescription(e.target.value)} className="col-span-3" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="button" variant="secondary" onClick={handleCloseEditGroup}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleEdit}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the group
              and remove all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteConfirmation}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
