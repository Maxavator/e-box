
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
    shareNote
  } = useNotes();

  // Filter notes based on search query
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full">
      <NotesContainer 
        filteredNotes={filteredNotes}
        activeNote={activeNote}
        setActiveNote={setActiveNote}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLoading={isLoading}
        createNote={createNote}
        updateNote={updateNote}
        deleteNote={deleteNote}
        shareNote={shareNote}
      />
    </div>
  );
}
