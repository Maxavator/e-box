
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CheckCircle2, 
  FileText, 
  Share, 
  Download, 
  Bell,
  ChevronRight,
  ChevronLeft,
  X
} from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
  details?: string;
  reminderDate?: Date;
  sharedWith?: string[];
};

interface TaskManagerProps {
  fullWidth?: boolean;
}

export const TaskManager = ({ fullWidth = false }: TaskManagerProps) => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Complete quarterly report', completed: false, details: 'Include all financial data from Q3' },
    { id: '2', title: 'Schedule team meeting', completed: true, dueDate: new Date(2023, 11, 15) },
    { id: '3', title: 'Review project proposal', completed: false, details: 'Focus on budget section and timeline' },
    { id: '4', title: 'Update documentation', completed: false, dueDate: new Date(2023, 11, 20) },
    { id: '5', title: 'Prepare presentation slides', completed: false, reminderDate: new Date(2023, 11, 18) },
  ]);
  const [newTask, setNewTask] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareEmail, setShareEmail] = useState('');

  const addTask = () => {
    if (newTask.trim() === '') {
      toast.error('Task cannot be empty');
      return;
    }
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      completed: false,
    };
    
    setTasks([...tasks, task]);
    setNewTask('');
    toast.success('Task added successfully');
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    if (selectedTask && selectedTask.id === id) {
      setSelectedTask(null);
      setShowDetails(false);
    }
    toast.success('Task removed');
  };

  const viewTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setShowDetails(true);
  };

  const updateTaskDetails = () => {
    if (!selectedTask) return;
    
    setTasks(tasks.map(task => 
      task.id === selectedTask.id ? selectedTask : task
    ));
    
    toast.success('Task updated');
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedTask(null);
  };

  const setTaskReminder = () => {
    if (!selectedTask || !selectedTask.reminderDate) return;
    
    setTasks(tasks.map(task => 
      task.id === selectedTask.id ? selectedTask : task
    ));
    
    setShowReminderDialog(false);
    toast.success(`Reminder set for ${format(selectedTask.reminderDate, 'PPP')}`);
  };

  const shareTask = () => {
    if (!selectedTask || !shareEmail) return;
    
    const updatedTask = {
      ...selectedTask,
      sharedWith: [...(selectedTask.sharedWith || []), shareEmail]
    };
    
    setTasks(tasks.map(task => 
      task.id === selectedTask.id ? updatedTask : task
    ));
    
    setShareEmail('');
    setShowShareDialog(false);
    toast.success(`Task shared with ${shareEmail}`);
  };

  const downloadTask = () => {
    if (!selectedTask) return;
    
    // Create task data for download
    const taskData = {
      title: selectedTask.title,
      details: selectedTask.details || '',
      completed: selectedTask.completed ? 'Yes' : 'No',
      dueDate: selectedTask.dueDate ? format(selectedTask.dueDate, 'PPP') : 'No due date',
      reminder: selectedTask.reminderDate ? format(selectedTask.reminderDate, 'PPP') : 'No reminder'
    };
    
    // Convert to text content
    const textContent = Object.entries(taskData)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    
    // Create download link
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `task-${selectedTask.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Task downloaded');
  };

  // Main task list view
  const TasksList = () => (
    <ScrollArea className="flex-1 p-6">
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-3 border rounded-lg flex items-center justify-between group ${
              task.completed ? 'bg-muted border-muted-foreground/20' : 'bg-card'
            }`}
          >
            <div className="flex items-center gap-3 flex-1">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTaskStatus(task.id)}
                id={`task-${task.id}`}
              />
              <label
                htmlFor={`task-${task.id}`}
                className={`cursor-pointer flex-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}
              >
                {task.title}
              </label>
              {(task.dueDate || task.reminderDate) && (
                <div className="text-xs text-muted-foreground mr-2 hidden sm:block">
                  {task.dueDate && <span>Due: {format(task.dueDate, 'MMM d')}</span>}
                  {task.reminderDate && !task.dueDate && <span>Reminder: {format(task.reminderDate, 'MMM d')}</span>}
                </div>
              )}
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => viewTaskDetails(task)}
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                title="View details"
              >
                <FileText className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                title="Remove task"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );

  // Task details panel
  const TaskDetails = () => (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={closeDetails}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-medium">Task Details</h3>
        <div className="w-8"></div>
      </div>
      
      {selectedTask && (
        <div className="flex-1 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Title</label>
            <Input 
              value={selectedTask.title} 
              onChange={(e) => setSelectedTask({...selectedTask, title: e.target.value})}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Details</label>
            <Textarea 
              value={selectedTask.details || ''} 
              onChange={(e) => setSelectedTask({...selectedTask, details: e.target.value})}
              rows={3}
              placeholder="Add details about this task..."
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Due Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedTask.dueDate && "text-muted-foreground"
                  )}
                >
                  {selectedTask.dueDate ? format(selectedTask.dueDate, "PPP") : "Set due date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedTask.dueDate}
                  onSelect={(date) => setSelectedTask({...selectedTask, dueDate: date || undefined})}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium mb-1 block">Actions</label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setShowReminderDialog(true)}
              >
                <Bell className="h-4 w-4" />
                <span>Set Reminder</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setShowShareDialog(true)}
              >
                <Share className="h-4 w-4" />
                <span>Share</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={downloadTask}
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
            </div>
          </div>
          
          {selectedTask.sharedWith && selectedTask.sharedWith.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-1 block">Shared With</label>
              <div className="space-y-1">
                {selectedTask.sharedWith.map((email, index) => (
                  <div key={index} className="text-sm bg-secondary/50 px-3 py-1 rounded-md">
                    {email}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="pt-4">
            <Button 
              className="w-full"
              onClick={updateTaskDetails}
            >
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Card className={`h-full shadow-lg hover:shadow-xl transition-shadow duration-200 ${fullWidth ? 'col-span-full' : ''}`}>
      <div className="flex flex-col h-full">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
          </div>
          
          {!showDetails && (
            <div className="flex gap-2">
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
              />
              <Button onClick={addTask}>Add</Button>
            </div>
          )}
        </div>
        
        {showDetails ? <TaskDetails /> : <TasksList />}
      </div>

      {/* Reminder Dialog */}
      <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Set a reminder</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Calendar
              mode="single"
              selected={selectedTask?.reminderDate}
              onSelect={(date) => {
                if (selectedTask) {
                  setSelectedTask({...selectedTask, reminderDate: date || undefined});
                }
              }}
              className="rounded-md border"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReminderDialog(false)}>Cancel</Button>
            <Button onClick={setTaskReminder}>Set Reminder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share this task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email address</label>
              <Input 
                placeholder="user@example.com" 
                value={shareEmail} 
                onChange={(e) => setShareEmail(e.target.value)} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>Cancel</Button>
            <Button onClick={shareTask}>Share</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
