
import { useState, useEffect } from 'react';
import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Check, Clock, AlertCircle, Edit2, Trash, Heart, ThumbsUp, ThumbsDown } from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface MessageItemProps {
  message: Message;
  onEdit: (messageId: string, newText: string) => void;
  onDelete: (messageId: string) => void;
  onReact: (messageId: string, emoji: string) => void;
}

const EDIT_TIME_LIMIT = 60000; // 60 seconds in milliseconds

export default function MessageItem({ message, onEdit, onDelete, onReact }: MessageItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.text);
  const [canEdit, setCanEdit] = useState(false);
  const isMine = message.senderId === 'me';

  useEffect(() => {
    if (isMine && message.status === 'sent') {
      const timeSinceMessage = Date.now() - new Date(message.timestamp).getTime();
      setCanEdit(timeSinceMessage < EDIT_TIME_LIMIT);
    }
  }, [message, isMine]);

  const handleEdit = () => {
    if (editedText !== message.text) {
      onEdit(message.id, editedText);
    }
    setIsEditing(false);
  };

  const StatusIcon = () => {
    if (!isMine) return null;
    
    switch (message.status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-gray-400" />;
      case 'sent':
        return <Check className="h-3 w-3 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  const reactions = [
    { emoji: "❤️", icon: Heart },
    { emoji: "👍", icon: ThumbsUp },
    { emoji: "👎", icon: ThumbsDown },
    { emoji: "🙏", icon: Heart, label: "Thank you" },
  ];

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className={cn(
          "group flex",
          isMine ? "justify-end" : "justify-start"
        )}>
          <div className={cn(
            "max-w-[70%] rounded-lg p-3",
            isMine ? "bg-primary text-primary-foreground" : "bg-muted",
            "hover:shadow-md transition-shadow"
          )}>
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="bg-white text-black rounded px-2 py-1"
                  autoFocus
                  onBlur={handleEdit}
                  onKeyPress={(e) => e.key === 'Enter' && handleEdit()}
                />
              </div>
            ) : (
              <>
                <p>{message.text}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className={cn(
                    "text-xs",
                    isMine ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {message.timestamp}
                    {message.edited && " (edited)"}
                  </span>
                  <StatusIcon />
                </div>
                {message.reactions && message.reactions.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {message.reactions.map((reaction, index) => (
                      <span
                        key={index}
                        className="bg-white/10 rounded px-1 text-xs"
                      >
                        {reaction.emoji} {reaction.users.length}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {isMine && canEdit && (
          <ContextMenuItem
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </ContextMenuItem>
        )}
        {isMine && (
          <ContextMenuItem
            onClick={() => onDelete(message.id)}
            className="text-red-600"
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </ContextMenuItem>
        )}
        <ContextMenuItem>
          <div className="flex gap-2">
            {reactions.map((reaction) => (
              <button
                key={reaction.emoji + (reaction.label || '')}
                onClick={() => onReact(message.id, reaction.emoji)}
                className="hover:bg-gray-100 p-1 rounded"
                title={reaction.label}
              >
                {reaction.emoji}
              </button>
            ))}
          </div>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
