
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
          isPinned: note.is_pinned,
          isJournal: note.is_journal,
          isShared: note.is_shared,
          sharedWith: note.shared_with
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
            is_pinned: newNote.isPinned,
            is_journal: newNote.isJournal,
            is_shared: newNote.isShared,
            shared_with: newNote.sharedWith
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
          isPinned: data.is_pinned,
          isJournal: data.is_journal,
          isShared: data.is_shared,
          sharedWith: data.shared_with
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
        if (updatedNote.isJournal !== undefined) noteData.is_journal = updatedNote.isJournal;
        if (updatedNote.isShared !== undefined) noteData.is_shared = updatedNote.isShared;
        if (updatedNote.sharedWith !== undefined) noteData.shared_with = updatedNote.sharedWith;

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
          isPinned: data.is_pinned,
          isJournal: data.is_journal,
          isShared: data.is_shared,
          sharedWith: data.shared_with
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

  // Share note with other users
  const shareNote = async (noteId: string, userEmails: string[]) => {
    try {
      const note = notes.find(n => n.id === noteId);
      if (!note) {
        throw new Error('Note not found');
      }
      
      await updateNoteMutation.mutateAsync({
        id: noteId,
        isShared: true,
        sharedWith: userEmails
      });
      
      toast.success('Note shared successfully');
      return true;
    } catch (error) {
      console.error('Error sharing note:', error);
      toast.error('Failed to share note');
      return false;
    }
  };

  // Setup weekly journal reminder
  const setupJournalReminder = async (enabled: boolean, dayOfWeek: number = 1, time: string = '09:00') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Update user preferences
      const { error } = await supabase
        .from('profiles')
        .update({
          journal_reminder_enabled: enabled,
          journal_reminder_day: dayOfWeek,
          journal_reminder_time: time
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast.success(enabled ? 'Journal reminders enabled' : 'Journal reminders disabled');
      return true;
    } catch (error) {
      console.error('Error setting up journal reminder:', error);
      toast.error('Failed to update journal reminder settings');
      return false;
    }
  };

  // Create a new note
  const createNote = (note: Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    return createNoteMutation.mutateAsync(note);
  };

  // Create a new journal entry
  const createJournalEntry = (title: string, content: string) => {
    return createNoteMutation.mutateAsync({
      title,
      content,
      isJournal: true,
      isPinned: false,
      color: '#e6ccff'
    });
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

  // Get journal entries
  const journalEntries = notes.filter(note => note.isJournal);

  // Check if welcome note exists
  useEffect(() => {
    const hasWelcomeNote = notes.some(note => 
      note.title === 'Welcome to e-Box Notes' && 
      note.content.includes('e-Box by Afrovation')
    );
    
    // Create welcome note if it doesn't exist and we have notes data
    if (!hasWelcomeNote && notes.length > 0 && !isLoading) {
      createWelcomeNote();
    }
  }, [notes, isLoading]);

  // Create welcome note
  const createWelcomeNote = async () => {
    try {
      await createNote({
        title: 'Welcome to e-Box Notes',
        content: `# Welcome to e-Box Notes by Afrovation

Thank you for using our Notes feature! Here are some ways you can make the most of it:

## Regular Notes
- Create quick notes for ideas, reminders, and information you need to remember
- Organize with colors and pins for easy access
- Use the search function to find your notes quickly

## Personal Journal
- Reflect on your day with private journal entries
- Set up weekly reminders to maintain your journaling habit
- Track your thoughts, goals, and achievements over time

## Sharing Capabilities
- Share important notes with colleagues or team members
- Collaborate on shared information
- Control who can access your shared notes

We hope these features help you stay organized and productive!

*e-Box by Afrovation - Empowering your digital workspace*`,
        isPinned: true,
        color: '#b5e3ff',
        isJournal: false
      });
    } catch (error) {
      console.error('Error creating welcome note:', error);
    }
  };

  // Create mock notes data for testing
  function generateMockNotes(): Note[] {
    return [
      {
        id: '1',
        title: 'Welcome to e-Box Notes',
        content: `# Welcome to e-Box Notes by Afrovation

Thank you for using our Notes feature! Here are some ways you can make the most of it:

## Regular Notes
- Create quick notes for ideas, reminders, and information you need to remember
- Organize with colors and pins for easy access
- Use the search function to find your notes quickly

## Personal Journal
- Reflect on your day with private journal entries
- Set up weekly reminders to maintain your journaling habit
- Track your thoughts, goals, and achievements over time

## Sharing Capabilities
- Share important notes with colleagues or team members
- Collaborate on shared information
- Control who can access your shared notes

We hope these features help you stay organized and productive!

*e-Box by Afrovation - Empowering your digital workspace*`,
        userId: 'user-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPinned: true,
        color: '#b5e3ff',
        isJournal: false
      },
      {
        id: '2',
        title: 'Meeting with Team',
        content: 'Discuss the new project timeline and milestones.',
        userId: 'user-1',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        tags: ['work', 'meeting'],
        isJournal: false
      },
      {
        id: '3',
        title: 'Daily Journal - Reflections',
        content: 'Today I made progress on the new feature. I faced some challenges with the implementation but managed to find solutions. Tomorrow I plan to finish the documentation.',
        userId: 'user-1',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
        color: '#e6ccff',
        isJournal: true
      }
    ];
  }

  return {
    notes,
    filteredNotes,
    journalEntries,
    activeNote,
    setActiveNote,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    createNote,
    createJournalEntry,
    updateNote,
    deleteNote,
    shareNote,
    setupJournalReminder,
    isCreating: createNoteMutation.isPending,
    isUpdating: updateNoteMutation.isPending,
    isDeleting: deleteNoteMutation.isPending
  };
}
