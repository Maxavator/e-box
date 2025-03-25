
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Plus, Edit2, Trash2 } from "lucide-react";
import { EmptyContacts } from "../components/EmptyContacts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

// Mock data - replace with actual API call
const contactGroups = [
  {
    id: "1",
    name: "Family",
    description: "Immediate family members",
    contacts: ["user1", "user2", "user3"],
    membersPreview: [
      { id: "user1", name: "John Doe", avatar: "" },
      { id: "user2", name: "Jane Smith", avatar: "" }
    ]
  },
  {
    id: "2",
    name: "Work Colleagues",
    description: "People I work with directly",
    contacts: ["user4", "user5"],
    membersPreview: [
      { id: "user4", name: "Alex Johnson", avatar: "" },
      { id: "user5", name: "Sarah Williams", avatar: "" }
    ]
  }
];

const formSchema = z.object({
  name: z.string().min(2, "Group name is required"),
  description: z.string().optional()
});

export const ContactGroups = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  
  // For demo - replace with actual API call
  const isLoading = false;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: ""
    }
  });
  
  const openNewGroupDialog = () => {
    form.reset({
      name: "",
      description: ""
    });
    setEditingGroup(null);
    setIsDialogOpen(true);
  };
  
  const openEditGroupDialog = (groupId: string) => {
    const group = contactGroups.find(g => g.id === groupId);
    if (group) {
      form.reset({
        name: group.name,
        description: group.description || ""
      });
      setEditingGroup(groupId);
      setIsDialogOpen(true);
    }
  };
  
  const handleSubmitGroup = (data: z.infer<typeof formSchema>) => {
    if (editingGroup) {
      toast.success(`Group "${data.name}" updated successfully`);
    } else {
      toast.success(`Group "${data.name}" created successfully`);
    }
    setIsDialogOpen(false);
  };
  
  const handleDeleteGroup = (groupId: string) => {
    toast.success("Group deleted successfully");
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <p>Loading contact groups...</p>
      </div>
    );
  }
  
  if (contactGroups.length === 0) {
    return <EmptyContacts type="groups" />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Your Contact Groups</h2>
        <Button onClick={openNewGroupDialog} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Group
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contactGroups.map((group) => (
          <Card key={group.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                {group.name}
              </CardTitle>
              <CardDescription>{group.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="text-sm text-muted-foreground">
                  {group.contacts.length} {group.contacts.length === 1 ? 'member' : 'members'}
                </div>
                <div className="flex -space-x-2">
                  {group.membersPreview.map((member) => (
                    <Avatar key={member.id} className="border-2 border-background">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {group.contacts.length > group.membersPreview.length && (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-xs border-2 border-background">
                      +{group.contacts.length - group.membersPreview.length}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => openEditGroupDialog(group.id)}
              >
                <Edit2 className="h-3 w-3" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 text-red-600"
                onClick={() => handleDeleteGroup(group.id)}
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Dialog for creating/editing group */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingGroup ? "Edit Contact Group" : "Create New Contact Group"}
            </DialogTitle>
            <DialogDescription>
              {editingGroup 
                ? "Update your contact group details and members"
                : "Create a new group to organize your contacts"
              }
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitGroup)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter group name" {...field} />
                    </FormControl>
                    <FormDescription>
                      A descriptive name for your contact group
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter group description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingGroup ? "Save Changes" : "Create Group"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
