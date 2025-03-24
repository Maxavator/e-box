
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
};

interface TaskManagerProps {
  fullWidth?: boolean;
}

export const TaskManager = ({ fullWidth = false }: TaskManagerProps) => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Complete quarterly report', completed: false },
    { id: '2', title: 'Schedule team meeting', completed: true },
    { id: '3', title: 'Review project proposal', completed: false },
    { id: '4', title: 'Update documentation', completed: false },
    { id: '5', title: 'Prepare presentation slides', completed: false },
  ]);
  const [newTask, setNewTask] = useState('');

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
    toast.success('Task removed');
  };

  return (
    <Card className={`p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 ${fullWidth ? 'w-full' : ''}`}>
      <div className="flex items-center gap-2 mb-6">
        <CheckCircle2 className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
      </div>
      
      <div className="flex gap-2 mb-4">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
        />
        <Button onClick={addTask}>Add</Button>
      </div>
      
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-3 border rounded-lg flex items-center justify-between group ${
                task.completed ? 'bg-muted border-muted-foreground/20' : 'bg-card'
              }`}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskStatus(task.id)}
                  id={`task-${task.id}`}
                />
                <label
                  htmlFor={`task-${task.id}`}
                  className={`cursor-pointer ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                >
                  {task.title}
                </label>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
