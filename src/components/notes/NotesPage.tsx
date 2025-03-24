
import { useNotes } from '@/hooks/useNotes';
import { NotesContainer } from './NotesContainer';

export function NotesPage() {
  const {
    filteredNotes,
    journalEntries,
    activeNote,
    setActiveNote,
    searchQuery,
    setSearchQuery,
    isLoading,
    createNote,
    createJournalEntry,
    updateNote,
    deleteNote,
    shareNote,
    setupJournalReminder
  } = useNotes();
  
  return (
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
  );
}
