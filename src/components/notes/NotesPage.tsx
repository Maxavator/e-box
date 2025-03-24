
import { useState } from 'react';
import { useNotes } from '@/hooks/useNotes';
import { NotesList } from './NotesList';
import { NoteEditor } from './NoteEditor';
import { JournalEntry } from './JournalEntry';
import { ShareNoteDialog } from './ShareNoteDialog';
import { JournalReminderDialog } from './JournalReminderDialog';
import { Note } from '@/types/chat';
import { Loader2, FileText, Book, CalendarClock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

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
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Left sidebar for notes list */}
      <div className="w-72 border-r h-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="p-4 border-b">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="notes" className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="journal" className="flex-1">
                <Book className="h-4 w-4 mr-2" />
                Journal
              </TabsTrigger>
            </TabsList>
            
            <div className="flex justify-end mb-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8"
                onClick={() => setShowReminderDialog(true)}
              >
                <CalendarClock className="h-4 w-4 mr-2" />
                Journal Reminder
              </Button>
            </div>
          </div>
          
          <TabsContent value="notes" className="flex-1 m-0 p-0">
            <NotesList
              notes={filteredNotes.filter(note => !note.isJournal)}
              activeNoteId={activeNote?.id}
              onNoteSelect={handleNoteSelect}
              onNewNote={handleNewNote}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </TabsContent>
          
          <TabsContent value="journal" className="flex-1 m-0 p-0">
            <NotesList
              notes={journalEntries}
              activeNoteId={activeNote?.id}
              onNoteSelect={handleNoteSelect}
              onNewNote={handleNewJournal}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              newButtonText="New Journal Entry"
            />
          </TabsContent>
        </Tabs>
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
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Select a note or create a new one</h2>
            <p className="text-muted-foreground max-w-md mb-4">
              Your personal notes are private and secure. Use this space to jot down ideas, reminders, or anything important.
            </p>
            <div className="flex gap-4">
              <Button
                onClick={handleNewNote}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <FileText className="h-4 w-4 mr-2" />
                Create a new note
              </Button>
              <Button
                onClick={handleNewJournal}
                variant="outline"
                className="px-4 py-2 rounded-md"
              >
                <Book className="h-4 w-4 mr-2" />
                New journal entry
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the note. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Share note dialog */}
      <ShareNoteDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        onShare={handleShareNote}
        noteTitle={noteToShare?.title || ''}
      />
      
      {/* Journal reminder dialog */}
      <JournalReminderDialog
        open={showReminderDialog}
        onOpenChange={setShowReminderDialog}
        onSave={handleSaveReminder}
      />
    </div>
  );
}
