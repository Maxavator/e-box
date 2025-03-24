
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Trash } from "lucide-react";
import { Note } from "@/types/notes";
import { useNotes } from "@/hooks/useNotes";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

interface NoteEditorProps {
  note?: Note | null;
  onSave?: () => void;
  onCancel?: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onSave,
  onCancel
}) => {
  const { createNote, updateNote, deleteNote, isCreating, isUpdating, isDeleting } = useNotes();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content || "");
    } else {
      setTitle("");
      setContent("");
    }
  }, [note]);

  const handleSave = () => {
    if (!title.trim()) {
      return;
    }

    if (note && note.id) {
      updateNote({
        id: note.id,
        title,
        content
      }, {
        onSuccess: () => {
          if (onSave) onSave();
        }
      });
    } else {
      createNote({
        title,
        content
      }, {
        onSuccess: () => {
          setTitle("");
          setContent("");
          if (onSave) onSave();
        }
      });
    }
  };

  const handleDelete = () => {
    if (note && note.id) {
      deleteNote(note.id, {
        onSuccess: () => {
          setShowDeleteDialog(false);
          if (onCancel) onCancel();
        }
      });
    }
  };

  const isLoading = isCreating || isUpdating || isDeleting;
  const isEditMode = !!note;

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle>
          <Input 
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-bold border-none bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <Textarea 
          placeholder="Write your note content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[200px] h-full resize-none border-none focus-visible:ring-0"
        />
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-3">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          {isEditMode && (
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  disabled={isLoading}
                >
                  {isDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash className="h-4 w-4 mr-2" />}
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this note. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        <Button 
          onClick={handleSave}
          disabled={isLoading || !title.trim()}
        >
          {isCreating || isUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save
        </Button>
      </CardFooter>
    </Card>
  );
};
