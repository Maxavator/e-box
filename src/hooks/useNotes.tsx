
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Note } from '@/types/chat';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useNotes() {
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  // Fetch notes
  const { data: notes = [], isLoading, error } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      try {
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform from database format to Note interface
        return data.map((note: any) => ({
          id: note.id,
          title: note.title,
          content: note.content || '',
          userId: note.user_id,
          createdAt: note.created_at,
          updatedAt: note.updated_at,
          tags: note.tags,
          color: note.color,
          isPinned: note.is_pinned
        })) as Note[];
      } catch (error) {
        console.error('Error fetching notes:', error);
        // Return mock data if database fetch fails
        return generateMockNotes();
      }
    }
  });

  // Create note mutation
  const createNoteMutation = useMutation({
    mutationFn: async (newNote: Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      try {
        const { data, error } = await supabase
          .from('notes')
          .insert({
            title: newNote.title,
            content: newNote.content,
            user_id: user.id,
            tags: newNote.tags,
            color: newNote.color,
            is_pinned: newNote.isPinned
          })
          .select()
          .single();

        if (error) throw error;

        return {
          id: data.id,
          title: data.title,
          content: data.content || '',
          userId: data.user_id,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          tags: data.tags,
          color: data.color,
          isPinned: data.is_pinned
        } as Note;
      } catch (error) {
        console.error('Error creating note:', error);
        throw error;
      }
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

  // Update note mutation
  const updateNoteMutation = useMutation({
    mutationFn: async (updatedNote: Partial<Note> & { id: string }) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('User not authenticated');
        }

        // Convert to database format
        const noteData: any = {};
        if (updatedNote.title !== undefined) noteData.title = updatedNote.title;
        if (updatedNote.content !== undefined) noteData.content = updatedNote.content;
        if (updatedNote.tags !== undefined) noteData.tags = updatedNote.tags;
        if (updatedNote.color !== undefined) noteData.color = updatedNote.color;
        if (updatedNote.isPinned !== undefined) noteData.is_pinned = updatedNote.isPinned;

        const { data, error } = await supabase
          .from('notes')
          .update(noteData)
          .eq('id', updatedNote.id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;

        return {
          id: data.id,
          title: data.title,
          content: data.content || '',
          userId: data.user_id,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          tags: data.tags,
          color: data.color,
          isPinned: data.is_pinned
        } as Note;
      } catch (error) {
        console.error('Error updating note:', error);
        throw error;
      }
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

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('User not authenticated');
        }

        const { error } = await supabase
          .from('notes')
          .delete()
          .eq('id', noteId)
          .eq('user_id', user.id);

        if (error) throw error;

        return noteId;
      } catch (error) {
        console.error('Error deleting note:', error);
        throw error;
      }
    },
    onSuccess: (deletedNoteId) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      
      // If the active note was deleted, clear it
      if (activeNote && activeNote.id === deletedNoteId) {
        setActiveNote(null);
      }
      
      toast.success('Note deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  });

  // Create a new note
  const createNote = (note: Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    return createNoteMutation.mutateAsync(note);
  };

  // Update a note
  const updateNote = (note: Partial<Note> & { id: string }) => {
    return updateNoteMutation.mutateAsync(note);
  };

  // Delete a note
  const deleteNote = (noteId: string) => {
    return deleteNoteMutation.mutateAsync(noteId);
  };

  // Filter notes based on search query
  const filteredNotes = notes.filter((note) => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Create mock notes data for testing
  function generateMockNotes(): Note[] {
    return [
      {
        id: '1',
        title: 'Welcome to Notes',
        content: 'This is a personal space where you can jot down your thoughts, ideas, and tasks.',
        userId: 'user-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPinned: true,
        color: '#f9d5e5'
      },
      {
        id: '2',
        title: 'Meeting with Team',
        content: 'Discuss the new project timeline and milestones.',
        userId: 'user-1',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        tags: ['work', 'meeting']
      },
      {
        id: '3',
        title: 'Shopping List',
        content: '- Milk\n- Eggs\n- Bread\n- Coffee\n- Fruits',
        userId: 'user-1',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
        tags: ['personal', 'shopping'],
        color: '#d0f0c0'
      }
    ];
  }

  return {
    notes,
    filteredNotes,
    activeNote,
    setActiveNote,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    createNote,
    updateNote,
    deleteNote,
    isCreating: createNoteMutation.isPending,
    isUpdating: updateNoteMutation.isPending,
    isDeleting: deleteNoteMutation.isPending
  };
}
