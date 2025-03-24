
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Note } from '@/types/chat';
import { toast } from 'sonner';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (error) {
        throw error;
      }

      // Transform the data to match our Note type
      setNotes(data.map(note => ({
        id: note.id,
        title: note.title,
        content: note.content,
        createdAt: note.created_at,
        updatedAt: note.updated_at,
        isPinned: note.is_pinned,
        isJournal: note.is_journal,
        color: note.color,
        userId: note.user_id,
        isShared: note.is_shared
      })));
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to load notes');
    } finally {
      setIsLoading(false);
    }
  };

  const createNote = async (noteData: Partial<Note>): Promise<Note> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('notes')
        .insert({
          title: noteData.title || 'Untitled',
          content: noteData.content || '',
          is_pinned: noteData.isPinned || false,
          is_journal: noteData.isJournal || false,
          color: noteData.color || null,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const newNote: Note = {
        id: data.id,
        title: data.title,
        content: data.content,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        isPinned: data.is_pinned,
        isJournal: data.is_journal,
        color: data.color,
        userId: data.user_id,
        isShared: data.is_shared
      };
      
      setNotes(prevNotes => [newNote, ...prevNotes]);
      
      toast.success('Note created successfully');
      return newNote;
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error('Failed to create note');
      throw error;
    }
  };

  const updateNote = async (noteData: Partial<Note> & { id: string }): Promise<Note> => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .update({
          title: noteData.title,
          content: noteData.content,
          is_pinned: noteData.isPinned,
          color: noteData.color,
          updated_at: new Date().toISOString()
        })
        .eq('id', noteData.id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const updatedNote: Note = {
        id: data.id,
        title: data.title,
        content: data.content,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        isPinned: data.is_pinned,
        isJournal: data.is_journal,
        color: data.color,
        userId: data.user_id,
        isShared: data.is_shared
      };
      
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === updatedNote.id ? updatedNote : note
        )
      );
      
      toast.success('Note updated successfully');
      return updatedNote;
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Failed to update note');
      throw error;
    }
  };

  const deleteNote = async (noteId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);
      
      if (error) {
        throw error;
      }
      
      setNotes(prevNotes => 
        prevNotes.filter(note => note.id !== noteId)
      );
      
      toast.success('Note deleted successfully');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
      throw error;
    }
  };

  const shareNote = async (noteId: string, emails: string[]): Promise<boolean> => {
    try {
      // Set note as shared
      const { error } = await supabase
        .from('notes')
        .update({
          is_shared: true
        })
        .eq('id', noteId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === noteId ? {...note, isShared: true} : note
        )
      );
      
      // In a real app, we would also send invitations to these emails
      // For now, we'll just simulate that part
      console.log(`Sharing note ${noteId} with:`, emails);
      
      toast.success('Note shared successfully');
      return true;
    } catch (error) {
      console.error('Error sharing note:', error);
      toast.error('Failed to share note');
      return false;
    }
  };

  const setupJournalReminder = async (enabled: boolean, dayOfWeek: number, time: string): Promise<boolean> => {
    try {
      // In a real app, we would store this in a user_preferences table
      // For now, we'll just simulate that this was saved
      console.log('Journal reminder settings:', { enabled, dayOfWeek, time });
      
      toast.success('Journal reminder set successfully');
      return true;
    } catch (error) {
      console.error('Error setting up journal reminder:', error);
      toast.error('Failed to set up journal reminder');
      return false;
    }
  };

  return {
    notes,
    isLoading,
    createNote,
    updateNote,
    deleteNote,
    shareNote,
    setupJournalReminder
  };
}
