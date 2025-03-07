import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, List, Plus, Trash, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { CalendarTask } from "@/types/supabase-types";

export const TaskManager = () => {
  const [newTask, setNewTask] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks, isLoading, isError } = useQuery({
    queryKey: ['calendar-tasks'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to view your tasks",
          variant: "destructive",
        });
        return [];
      }

      const { data, error } = await supabase
        .from('calendar_tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        toast({
          title: "Error",
          description: "Failed to load tasks",
          variant: "destructive",
        });
        return [];
      }

      return data as CalendarTask[];
    },
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching tasks:', error);
        toast({
          title: "Error",
          description: "Failed to load tasks",
          variant: "destructive",
        });
      }
    }
  });

  const addTaskMutation = useMutation({
    mutationFn: async (title: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to add tasks",
          variant: "destructive",
        });
        throw new Error("No user found");
      }

      const { data, error } = await supabase
        .from('calendar_tasks')
        .insert([
          {
            title,
            user_id: user.id,
            completed: false
          }
        ])
        .select();

      if (error) throw error;
      return data?.[0] as CalendarTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-tasks'] });
      toast({
        title: "Task added",
        description: "Your task has been added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to add task: " + error.message,
        variant: "destructive",
      });
    }
  });

  const toggleTaskMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { data, error } = await supabase
        .from('calendar_tasks')
        .update({ completed })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data?.[0] as CalendarTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-tasks'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to update task: " + error.message,
        variant: "destructive",
      });
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('calendar_tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-tasks'] });
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to delete task: " + error.message,
        variant: "destructive",
      });
    }
  });

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      await addTaskMutation.mutateAsync(newTask);
      setNewTask("");
    } catch (error) {
      // Error is handled by mutation's onError
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="h-5 w-5" />
          Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
          <Input
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        {isLoading ? (
          <div className="text-center py-4">Loading tasks...</div>
        ) : isError ? (
          <div className="text-center py-4 text-red-600">Failed to load tasks</div>
        ) : tasks?.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No tasks yet</div>
        ) : (
          <div className="space-y-2">
            {tasks?.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleTaskMutation.mutate({ id: task.id, completed: !task.completed })}
                  className={task.completed ? "text-green-600" : "text-gray-400"}
                >
                  {task.completed ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </Button>
                <span className={`flex-1 ${task.completed ? "line-through text-gray-400" : ""}`}>
                  {task.title}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTaskMutation.mutate(task.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
