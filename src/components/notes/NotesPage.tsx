
import { useState } from 'react';
import { useNotes } from '@/hooks/useNotes';
import { NotesList } from './NotesList';
import { NoteEditor } from './NoteEditor';
import { Note } from '@/types/chat';
import { Loader2, FileText } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export function NotesPage() {
  const {
    filteredNotes,
    activeNote,
    setActiveNote,
    searchQuery,
    setSearchQuery,
    isLoading,
    createNote,
    updateNote,
    deleteNote
  } = useNotes();
  
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  const handleNoteSelect = (note: Note) => {
    if (isCreatingNote) {
      // Ask for confirmation if they're abandoning a new note
      if (window.confirm('Discard unsaved note?')) {
        setIsCreatingNote(false);
        setActiveNote(note);
      }
    } else {
      setActiveNote(note);
    }
  };

  const handleNewNote = () => {
    setIsCreatingNote(true);
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
          isPinned: noteData.isPinned
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

  const handleCancelNote = () => {
    if (isCreatingNote) {
      setIsCreatingNote(false);
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
    <div className="flex h-screen overflow-hidden">
      {/* Notes list sidebar */}
      <div className="w-full sm:w-80 md:w-96 h-full flex-shrink-0">
        <NotesList
          notes={filteredNotes}
          activeNoteId={activeNote?.id}
          onNoteSelect={handleNoteSelect}
          onNewNote={handleNewNote}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
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
        ) : activeNote ? (
          <NoteEditor
            note={activeNote}
            onSave={handleSaveNote}
            onCancel={() => setActiveNote(null)}
            onDelete={handleDeleteClick}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Select a note or create a new one</h2>
            <p className="text-muted-foreground max-w-md mb-4">
              Your personal notes are private and secure. Use this space to jot down ideas, reminders, or anything important.
            </p>
            <button
              onClick={handleNewNote}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Create a new note
            </button>
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
    </div>
  );
}
