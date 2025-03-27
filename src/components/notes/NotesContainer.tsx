
import { useState } from 'react';
import { Note } from '@/types/chat';
import { NoteEditor } from './NoteEditor';
import { JournalEntry } from './JournalEntry';
import { NoteTabs } from './NoteTabs';
import { DeleteNoteDialog, EmptyNoteState } from './dialogs';
import { ShareNoteDialog } from './ShareNoteDialog';
import { JournalReminderDialog } from './JournalReminderDialog';
import { NotesLoadingState } from './LoadingState';

interface NotesContainerProps {
  filteredNotes: Note[];
  journalEntries: Note[];
  activeNote: Note | null;
  setActiveNote: (note: Note | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  createNote: (note: any) => Promise<Note>;
  createJournalEntry: (title: string, content: string) => Promise<Note>;
  updateNote: (note: Partial<Note> & { id: string }) => Promise<Note>;
  deleteNote: (noteId: string) => Promise<void>;
  shareNote: (noteId: string, emails: string[]) => Promise<boolean>;
  setupJournalReminder: (enabled: boolean, dayOfWeek: number, time: string) => Promise<boolean>;
}

export function NotesContainer({
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
}: NotesContainerProps) {
  const [activeTab, setActiveTab] = useState<string>("notes");
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [isCreatingJournal, setIsCreatingJournal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [noteToShare, setNoteToShare] = useState<Note | null>(null);
  const [showReminderDialog, setShowReminderDialog] = useState(false);

  const handleNoteSelect = (note: Note) => {
    if (isCreatingNote || isCreatingJournal) {
      // Ask for confirmation if they're abandoning a new note
      if (window.confirm('Discard unsaved note?')) {
        setIsCreatingNote(false);
        setIsCreatingJournal(false);
        setActiveNote(note);
      }
    } else {
      setActiveNote(note);
    }
  };

  const handleNewNote = () => {
    setIsCreatingNote(true);
    setIsCreatingJournal(false);
    setActiveNote(null);
  };

  const handleNewJournal = () => {
    setIsCreatingJournal(true);
    setIsCreatingNote(false);
    setActiveNote(null);
  };

  const handleSaveNote = async (noteData: Partial<Note> & { id?: string }) => {
    try {
      if (isCreatingNote) {
        // Create new note
        const newNote = await createNote({
          title: noteData.title || 'Untitled',
          content: noteData.content || '',
          color: noteData.color,
          isPinned: noteData.isPinned,
          isJournal: false
        });
        setActiveNote(newNote);
        setIsCreatingNote(false);
      } else if (activeNote && noteData.id) {
        // Update existing note
        const updatedNote = await updateNote(noteData as (Partial<Note> & { id: string }));
        setActiveNote(updatedNote);
      }
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleSaveJournal = async (title: string, content: string) => {
    try {
      const newJournal = await createJournalEntry(title, content);
      setActiveNote(newJournal);
      setIsCreatingJournal(false);
      setActiveTab("journal");
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  };

  const handleDeleteClick = (noteId: string) => {
    setNoteToDelete(noteId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (noteToDelete) {
      await deleteNote(noteToDelete);
      setNoteToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  const handleShareClick = (note: Note) => {
    setNoteToShare(note);
    setShowShareDialog(true);
  };

  const handleShareNote = async (emails: string[]) => {
    if (noteToShare) {
      await shareNote(noteToShare.id, emails);
    }
  };

  const handleSaveReminder = async (enabled: boolean, dayOfWeek: number, time: string) => {
    await setupJournalReminder(enabled, dayOfWeek, time);
  };

  const handleCancelNote = () => {
    if (isCreatingNote) {
      setIsCreatingNote(false);
    }
    if (isCreatingJournal) {
      setIsCreatingJournal(false);
    }
  };

  if (isLoading) {
    return <NotesLoadingState />;
  }

  return (
    <div className="flex h-full">
      {/* Left sidebar for notes list */}
      <div className="w-72 border-r h-full">
        <NoteTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filteredNotes={filteredNotes}
          journalEntries={journalEntries}
          activeNoteId={activeNote?.id}
          onNoteSelect={handleNoteSelect}
          onNewNote={handleNewNote}
          onNewJournal={handleNewJournal}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onReminderClick={() => setShowReminderDialog(true)}
        />
      </div>
      
      {/* Note editor area */}
      <div className="flex-1 p-4 overflow-auto">
        {isCreatingNote ? (
          <NoteEditor
            note={null}
            onSave={handleSaveNote}
            onCancel={handleCancelNote}
            isNew={true}
          />
        ) : isCreatingJournal ? (
          <JournalEntry
            onSave={handleSaveJournal}
            onCancel={handleCancelNote}
          />
        ) : activeNote ? (
          <NoteEditor
            note={activeNote}
            onSave={handleSaveNote}
            onCancel={() => setActiveNote(null)}
            onDelete={handleDeleteClick}
            onShare={handleShareClick}
          />
        ) : (
          <EmptyNoteState
            handleNewNote={handleNewNote}
            handleNewJournal={handleNewJournal}
          />
        )}
      </div>
      
      {/* Dialogs */}
      <DeleteNoteDialog
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        handleConfirmDelete={handleConfirmDelete}
      />
      
      <ShareNoteDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        onShare={handleShareNote}
        noteTitle={noteToShare?.title || ''}
      />
      
      <JournalReminderDialog
        open={showReminderDialog}
        onOpenChange={setShowReminderDialog}
        onSave={handleSaveReminder}
      />
    </div>
  );
}
