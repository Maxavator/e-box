
import { useState, useEffect } from 'react';
import { useNotes } from '@/hooks/useNotes';
import { Note } from '@/types/chat';
import { NotesContainer } from './NotesContainer';

export function NotesPage() {
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { 
    notes, 
    isLoading, 
    createNote, 
    updateNote, 
    deleteNote, 
    shareNote,
    setupJournalReminder
  } = useNotes();

  // Filter notes based on search query
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter journal entries
  const journalEntries = notes.filter(note => note.isJournal);

  // Create a new journal entry
  const createJournalEntry = async (title: string, content: string) => {
    return await createNote({
      title,
      content,
      isJournal: true,
      color: '#f3e8ff', // Light purple
      isPinned: false,
      category: 'Journal',
      tags: ['journal'],
      isFavorite: false,
      owner: ''
    });
  };

  return (
    <div className="h-full">
      <NotesContainer 
        filteredNotes={filteredNotes}
        journalEntries={journalEntries}
        activeNote={activeNote}
        setActiveNote={setActiveNote}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLoading={isLoading}
        createNote={createNote}
        createJournalEntry={createJournalEntry}
        updateNote={updateNote}
        deleteNote={deleteNote}
        shareNote={shareNote}
        setupJournalReminder={setupJournalReminder}
      />
    </div>
  );
}
