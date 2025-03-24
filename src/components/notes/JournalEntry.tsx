
import { useState } from 'react';
import { Note } from '@/types/chat';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { Book, Save, X } from 'lucide-react';

interface JournalEntryProps {
  onSave: (title: string, content: string) => void;
  onCancel: () => void;
}

export function JournalEntry({ onSave, onCancel }: JournalEntryProps) {
  const today = format(new Date(), 'MMMM d, yyyy');
  const [title, setTitle] = useState(`Journal Entry - ${today}`);
  const [content, setContent] = useState('');

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    onSave(title, content);
  };

  const journalPrompts = [
    "What made you feel grateful today?",
    "What challenges did you overcome?",
    "What are your goals for tomorrow?",
    "What did you learn today?",
    "How did you take care of yourself today?"
  ];

  const addPrompt = (prompt: string) => {
    setContent(prev => prev + (prev ? '\n\n' : '') + `${prompt}\n`);
  };

  return (
    <Card className="h-full flex flex-col" style={{ backgroundColor: '#e6ccff30' }}>
      <CardHeader className="pb-2 space-y-0">
        <div className="flex items-center space-x-2">
          <Book className="h-5 w-5 text-purple-500" />
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Journal title"
            className="border-0 border-b bg-transparent text-lg font-medium focus-visible:ring-0 focus-visible:border-primary px-1"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-3">
        <div className="mb-3">
          <p className="text-sm text-muted-foreground mb-2">Writing prompts:</p>
          <div className="flex flex-wrap gap-2">
            {journalPrompts.map((prompt, index) => (
              <Button 
                key={index} 
                variant="outline" 
                size="sm" 
                className="text-xs" 
                onClick={() => addPrompt(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your journal entry here..."
          className="h-[calc(100%-45px)] w-full resize-none border-0 bg-transparent focus-visible:ring-0"
        />
      </CardContent>
      <CardFooter className="border-t p-3 flex justify-between">
        <div></div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="mr-1 h-4 w-4" />
            Cancel
          </Button>
          <Button variant="default" size="sm" onClick={handleSave}>
            <Save className="mr-1 h-4 w-4" />
            Save Entry
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
