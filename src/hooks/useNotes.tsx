
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Note, CreateNoteInput, UpdateNoteInput } from "@/types/notes";
import { toast } from "sonner";

export const useNotes = () => {
  const queryClient = useQueryClient();
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  // Fetch all notes for the current user
  const { data: notes, isLoading: isLoadingNotes, error: notesError } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data as Note[];
    },
  });

  // Get a single note by ID
  const getNote = async (id: string): Promise<Note | null> => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching note:', error);
      return null;
    }
    
    return data as Note;
  };

  // Create a new note
  const createNoteMutation = useMutation({
    mutationFn: async (newNote: CreateNoteInput) => {
      const { data, error } = await supabase
        .from('notes')
        .insert([newNote])
        .select()
        .single();
      
      if (error) throw error;
      return data as Note;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note created successfully');
    },
    onError: (error) => {
      console.error('Error creating note:', error);
      toast.error('Failed to create note');
    }
  });

  // Update an existing note
  const updateNoteMutation = useMutation({
    mutationFn: async (updateData: UpdateNoteInput) => {
      const { id, ...rest } = updateData;
      const { data, error } = await supabase
        .from('notes')
        .update(rest)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Note;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note updated successfully');
    },
    onError: (error) => {
      console.error('Error updating note:', error);
      toast.error('Failed to update note');
    }
  });

  // Delete a note
  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      if (activeNoteId === id) {
        setActiveNoteId(null);
      }
      toast.success('Note deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  });

  return {
    notes,
    isLoadingNotes,
    notesError,
    activeNoteId,
    setActiveNoteId,
    getNote,
    createNote: createNoteMutation.mutate,
    updateNote: updateNoteMutation.mutate,
    deleteNote: deleteNoteMutation.mutate,
    isCreating: createNoteMutation.isPending,
    isUpdating: updateNoteMutation.isPending,
    isDeleting: deleteNoteMutation.isPending
  };
};
