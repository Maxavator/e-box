
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNotes } from "@/hooks/useNotes";
import { Note, CreateNoteInput } from "@/types/notes";
import { Save, X } from "lucide-react";

interface NoteEditorProps {
  note: Note | null;
  onSave: () => void;
  onCancel: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const { createNote, updateNote, isCreating, isUpdating } = useNotes();

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content || "");
    } else {
      setTitle("");
      setContent("");
    }
  }, [note]);

  const handleSave = async () => {
    if (title.trim() === "") {
      // Don't save notes without a title
      return;
    }

    if (note) {
      // Update existing note
      await updateNote({
        id: note.id,
        title: title.trim(),
        content: content.trim(),
      });
    } else {
      // Create new note
      const newNote: CreateNoteInput = {
        title: title.trim(),
        content: content.trim(),
      };
      await createNote(newNote);
    }

    onSave();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <Input
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-medium bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
        />
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
          >
            <X className="h-4 w-4 mr-2" /> Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={title.trim() === "" || isCreating || isUpdating}
            size="sm"
          >
            <Save className="h-4 w-4 mr-2" />
            {note ? "Update" : "Save"}
          </Button>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <Textarea
          placeholder="Write your note content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full min-h-[calc(100vh-280px)] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent p-0"
        />
      </div>
    </div>
  );
};
