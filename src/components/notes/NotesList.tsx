
import { Note } from '@/types/chat';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';

interface NotesListProps {
  notes: Note[];
  activeNoteId?: string;
  onNoteSelect: (note: Note) => void;
  onNewNote: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  newButtonText?: string;
}

export function NotesList({
  notes,
  activeNoteId,
  onNoteSelect,
  onNewNote,
  searchQuery,
  onSearchChange,
  newButtonText = "New Note"
}: NotesListProps) {
  // Sort notes with pinned ones first, then by updatedAt date
  const sortedNotes = [...notes].sort((a, b) => {
    // First sort by pin status
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    // Then sort by date
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button onClick={onNewNote}>
            <Plus className="h-4 w-4 mr-2" />
            {newButtonText}
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-1">
        {sortedNotes.length > 0 ? (
          <div className="space-y-1 p-2">
            {sortedNotes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                isActive={activeNoteId === note.id}
                onClick={() => onNoteSelect(note)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <p className="text-muted-foreground mb-2">No notes found</p>
            <Button variant="outline" onClick={onNewNote}>
              <Plus className="h-4 w-4 mr-2" />
              {newButtonText}
            </Button>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

interface NoteItemProps {
  note: Note;
  isActive: boolean;
  onClick: () => void;
}

function NoteItem({ note, isActive, onClick }: NoteItemProps) {
  const timeAgo = formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true });
  
  // Get the first 50 characters of content for preview
  const contentPreview = note.content.length > 50 
    ? `${note.content.substring(0, 50)}...` 
    : note.content;
  
  return (
    <div
      className={`rounded-md p-3 cursor-pointer transition-colors ${
        isActive ? 'bg-primary/10' : 'hover:bg-muted'
      }`}
      onClick={onClick}
      style={note.color ? { backgroundColor: `${note.color}${isActive ? '50' : '30'}` } : {}}
    >
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-medium line-clamp-1 flex-1">
          {note.isPinned && <span className="mr-1">📌</span>}
          {note.isJournal && <span className="mr-1">📓</span>}
          {note.isShared && <span className="mr-1">🔗</span>}
          {note.title}
        </h3>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2">{contentPreview}</p>
      <div className="text-xs text-muted-foreground mt-2">{timeAgo}</div>
    </div>
  );
}
