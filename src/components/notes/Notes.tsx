import React, { useEffect, useState } from "react";
import { useNotes } from "@/hooks/useNotes";
import { Note } from "@/types/notes";
import { NotesList } from "./NotesList";
import { NoteEditor } from "./NoteEditor";
import { StickyNote, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Notes() {
  const { 
    notes, 
    isLoadingNotes, 
    activeNoteId, 
    setActiveNoteId, 
    getNote
  } = useNotes();

  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    const loadActiveNote = async () => {
      if (activeNoteId) {
        const note = await getNote(activeNoteId);
        setActiveNote(note);
        setShowEditor(true);
      } else {
        setActiveNote(null);
      }
    };

    loadActiveNote();
  }, [activeNoteId, getNote]);

  const handleNoteSelect = (note: Note) => {
    setActiveNoteId(note.id);
  };

  const handleNewNote = () => {
    setActiveNote(null);
    setActiveNoteId(null);
    setShowEditor(true);
  };

  const handleCancel = () => {
    setShowEditor(false);
    setActiveNoteId(null);
  };

  const handleSave = () => {
    // For new notes, we'll keep the editor open
    if (!activeNoteId) {
      setShowEditor(true);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center gap-2 mb-6">
        <StickyNote className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Notes</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-[calc(100vh-160px)]">
        <div className="border rounded-lg overflow-hidden md:col-span-1">
          <NotesList
            notes={notes || []}
            isLoading={isLoadingNotes}
            activeNoteId={activeNoteId}
            onNoteSelect={handleNoteSelect}
            onNewNote={handleNewNote}
          />
        </div>

        <div className="border rounded-lg md:col-span-2 lg:col-span-3">
          {showEditor ? (
            <NoteEditor
              note={activeNote}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <StickyNote className="h-16 w-16 mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">No note selected</h2>
              <p className="text-muted-foreground mb-4">
                Select a note from the list or create a new one
              </p>
              <Button onClick={handleNewNote}>
                <Plus className="mr-2 h-4 w-4" /> Create New Note
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
