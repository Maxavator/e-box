
import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Note } from '@/types/chat';
import { Save, X, Trash2, Pin, PinOff, Share } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface NoteEditorProps {
  note: Note | null;
  onSave: (note: Partial<Note> & { id?: string }) => void;
  onCancel: () => void;
  onDelete?: (noteId: string) => void;
  onShare?: (note: Note) => void;
  isNew?: boolean;
}

export function NoteEditor({ note, onSave, onCancel, onDelete, onShare, isNew = false }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [color, setColor] = useState(note?.color || '');
  const [isPinned, setIsPinned] = useState(note?.isPinned || false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setColor(note.color || '');
      setIsPinned(note.isPinned || false);
    } else {
      setTitle('');
      setContent('');
      setColor('');
      setIsPinned(false);
    }
  }, [note]);

  const handleSave = () => {
    if (!title.trim()) return;
    
    const updatedNote = {
      ...(note?.id ? { id: note.id } : {}),
      title,
      content,
      color,
      isPinned
    };
    
    onSave(updatedNote);
  };

  const handleDelete = () => {
    if (note?.id && onDelete) {
      onDelete(note.id);
    }
  };

  const handleShare = () => {
    if (note && onShare) {
      onShare(note);
    }
  };

  const noteColors = [
    { value: '', label: 'Default' },
    { value: '#f9d5e5', label: 'Pink' },
    { value: '#d0f0c0', label: 'Green' },
    { value: '#b5e3ff', label: 'Blue' },
    { value: '#ffffb5', label: 'Yellow' },
    { value: '#e6ccff', label: 'Purple' }
  ];

  return (
    <Card className="h-full flex flex-col" style={{ backgroundColor: color || undefined }}>
      <CardHeader className="pb-2 space-y-0">
        <div className="flex items-center space-x-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="border-0 border-b bg-transparent text-lg font-medium focus-visible:ring-0 focus-visible:border-primary px-1"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsPinned(!isPinned)}
            title={isPinned ? "Unpin note" : "Pin note"}
          >
            {isPinned ? <PinOff size={16} /> : <Pin size={16} />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-3">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here..."
          className="h-full w-full resize-none border-0 bg-transparent focus-visible:ring-0"
        />
      </CardContent>
      <CardFooter className="border-t p-3 flex justify-between">
        <div className="flex items-center space-x-2">
          <Select value={color} onValueChange={setColor}>
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue placeholder="Color" />
            </SelectTrigger>
            <SelectContent>
              {noteColors.map(color => (
                <SelectItem key={color.value} value={color.value}>
                  <div className="flex items-center">
                    {color.value && (
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: color.value }}
                      />
                    )}
                    <span>{color.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {!isNew && onDelete && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleDelete}
              className="text-destructive"
              title="Delete note"
            >
              <Trash2 size={16} />
            </Button>
          )}
          
          {!isNew && onShare && note && !note.isJournal && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              title="Share note"
            >
              <Share size={16} />
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="mr-1 h-4 w-4" />
            Cancel
          </Button>
          <Button variant="default" size="sm" onClick={handleSave}>
            <Save className="mr-1 h-4 w-4" />
            Save
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
