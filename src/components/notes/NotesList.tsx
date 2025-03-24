
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Note } from "@/types/notes";

interface NotesListProps {
  notes: Note[];
  isLoading: boolean;
  activeNoteId: string | null;
  onNoteSelect: (note: Note) => void;
  onNewNote: () => void;
}

export const NotesList: React.FC<NotesListProps> = ({
  notes,
  isLoading,
  activeNoteId,
  onNoteSelect,
  onNewNote
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <Button
          onClick={onNewNote}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" /> New Note
        </Button>
      </div>
      <ScrollArea className="flex-1">
        {notes && notes.length > 0 ? (
          <div className="p-2">
            {notes.map((note) => (
              <Button
                key={note.id}
                variant="ghost"
                className={`w-full justify-start mb-1 p-3 h-auto text-left ${
                  activeNoteId === note.id ? "bg-muted" : ""
                }`}
                onClick={() => onNoteSelect(note)}
              >
                <div className="flex items-start gap-3 w-full">
                  <FileText className="h-5 w-5 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  <div className="overflow-hidden flex-1">
                    <div className="font-medium truncate">{note.title}</div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
                      <span>
                        {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <FileText className="h-10 w-10 mb-4 text-muted-foreground" />
            <h3 className="font-medium">No notes yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first note to get started
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
