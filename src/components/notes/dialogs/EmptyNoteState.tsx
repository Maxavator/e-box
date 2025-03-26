
import { Button } from '@/components/ui/button';
import { Book, FileText } from 'lucide-react';

interface EmptyNoteStateProps {
  handleNewNote: () => void;
  handleNewJournal?: () => void; // Made optional with the ? operator
}

export function EmptyNoteState({ handleNewNote, handleNewJournal }: EmptyNoteStateProps) {
  return (
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
        {handleNewJournal && (
          <Button
            onClick={handleNewJournal}
            variant="outline"
            className="px-4 py-2 rounded-md"
          >
            <Book className="h-4 w-4 mr-2" />
            New journal entry
          </Button>
        )}
      </div>
    </div>
  );
}
