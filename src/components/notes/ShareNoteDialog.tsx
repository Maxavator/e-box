
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Share, X, Plus, Mail } from 'lucide-react';

interface ShareNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShare: (emails: string[]) => void;
  noteTitle: string;
}

export function ShareNoteDialog({
  open,
  onOpenChange,
  onShare,
  noteTitle
}: ShareNoteDialogProps) {
  const [emails, setEmails] = useState<string[]>(['']);
  
  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };
  
  const addEmailField = () => {
    setEmails([...emails, '']);
  };
  
  const removeEmailField = (index: number) => {
    if (emails.length > 1) {
      const newEmails = [...emails];
      newEmails.splice(index, 1);
      setEmails(newEmails);
    }
  };
  
  const handleSubmit = () => {
    // Validate emails
    const validEmails = emails.filter(email => {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      return isValid && email.trim() !== '';
    });
    
    if (validEmails.length === 0) {
      toast.error('Please enter at least one valid email address');
      return;
    }
    
    onShare(validEmails);
    onOpenChange(false);
    // Reset form
    setEmails(['']);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Note</DialogTitle>
          <DialogDescription>
            Share "{noteTitle}" with other users by email
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {emails.map((email, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Input
                value={email}
                onChange={(e) => handleEmailChange(index, e.target.value)}
                placeholder="colleague@example.com"
                className="flex-1"
              />
              {emails.length > 1 && (
                <Button variant="ghost" size="icon" onClick={() => removeEmailField(index)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={addEmailField}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add another email
          </Button>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-primary">
            <Share className="h-4 w-4 mr-2" />
            Share Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
