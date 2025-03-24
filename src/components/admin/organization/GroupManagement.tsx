
import React, { useState } from 'react';
import { useGroupManagement } from './hooks/useGroupManagement';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Group } from './types';

export const GroupManagement = () => {
  const { 
    isAdmin,
    session,
    groups,
    members,
    isLoadingGroups,
    isLoadingMembers,
    isCreatingGroup,
    setIsCreatingGroup,
    isEditingGroup,
    setIsEditingGroup,
    isCreating,
    isUpdating,
    isDeleting,
    handleCreateGroup,
    handleUpdateGroup,
    handleDeleteGroup
  } = useGroupManagement();
  
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  
  const createGroup = async () => {
    if (!newGroupName) return;
    if (!session) return;
    
    const userId = session.user.id;
    const organizationId = session.user.user_metadata.organization_id;
    
    if (!organizationId) {
      console.error('No organization ID found');
      return;
    }
    
    try {
      await handleCreateGroup({
        name: newGroupName,
        description: newGroupDescription,
        is_public: true,
        organization_id: organizationId,
        created_by: userId
      });
      
      // Reset form
      setNewGroupName('');
      setNewGroupDescription('');
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };
  
  if (!isAdmin) {
    return <div>You do not have permission to manage groups.</div>;
  }
  
  if (isLoadingGroups) {
    return <div>Loading groups...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Groups Management</h2>
        <Button 
          onClick={() => setIsCreatingGroup(true)}
          disabled={isCreatingGroup}
        >
          Create New Group
        </Button>
      </div>
      
      {isCreatingGroup && (
        <div className="bg-secondary/30 p-4 rounded-md space-y-4">
          <h3 className="font-semibold">Create New Group</h3>
          
          <div className="space-y-2">
            <label className="block text-sm">Group Name:</label>
            <input 
              type="text" 
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm">Description:</label>
            <textarea 
              value={newGroupDescription}
              onChange={(e) => setNewGroupDescription(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={createGroup}
              disabled={isCreating || !newGroupName}
            >
              {isCreating ? 'Creating...' : 'Save Group'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsCreatingGroup(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Existing Groups</h3>
        
        {groups.length === 0 ? (
          <div className="text-center py-8 bg-muted/30 rounded-md">
            <p>No groups created yet. Create your first group to get started.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell>{group.name}</TableCell>
                  <TableCell>{group.description}</TableCell>
                  <TableCell>
                    {members.filter(m => m.group_id === group.id).length}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsEditingGroup(group.id)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this group?')) {
                            handleDeleteGroup(group.id);
                          }
                        }}
                        disabled={isDeleting}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};
