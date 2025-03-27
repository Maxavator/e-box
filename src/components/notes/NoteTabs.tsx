
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, CalendarClock, FileText } from "lucide-react";
import { NotesList } from './NotesList';
import { Button } from "@/components/ui/button";
import { Note } from "@/types/chat";

interface NoteTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filteredNotes: Note[];
  journalEntries: Note[];
  activeNoteId: string | undefined;
  onNoteSelect: (note: Note) => void;
  onNewNote: () => void;
  onNewJournal: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onReminderClick: () => void;
}

export function NoteTabs({
  activeTab,
  setActiveTab,
  filteredNotes,
  journalEntries,
  activeNoteId,
  onNoteSelect,
  onNewNote,
  onNewJournal,
  searchQuery,
  onSearchChange,
  onReminderClick
}: NoteTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
      <div className="p-4 border-b">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="notes" className="flex-1">
            <FileText className="h-4 w-4 mr-2" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="journal" className="flex-1">
            <Book className="h-4 w-4 mr-2" />
            Journal
          </TabsTrigger>
        </TabsList>
        
        <div className="flex justify-end mb-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8"
            onClick={onReminderClick}
          >
            <CalendarClock className="h-4 w-4 mr-2" />
            Journal Reminder
          </Button>
        </div>
      </div>
      
      <TabsContent value="notes" className="flex-1 m-0 p-0">
        <NotesList
          notes={filteredNotes.filter(note => !note.isJournal)}
          activeNoteId={activeNoteId}
          onNoteSelect={onNoteSelect}
          onNewNote={onNewNote}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
      </TabsContent>
      
      <TabsContent value="journal" className="flex-1 m-0 p-0">
        <NotesList
          notes={journalEntries}
          activeNoteId={activeNoteId}
          onNoteSelect={onNoteSelect}
          onNewNote={onNewJournal}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          newButtonText="New Journal Entry"
        />
      </TabsContent>
    </Tabs>
  );
}
