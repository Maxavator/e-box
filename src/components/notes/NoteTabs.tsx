
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText } from "lucide-react";
import { NotesList } from './NotesList';
import { Note } from "@/types/chat";

interface NoteTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filteredNotes: Note[];
  activeNoteId: string | undefined;
  onNoteSelect: (note: Note) => void;
  onNewNote: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function NoteTabs({
  activeTab,
  setActiveTab,
  filteredNotes,
  activeNoteId,
  onNoteSelect,
  onNewNote,
  searchQuery,
  onSearchChange
}: NoteTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
      <div className="p-4 border-b">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="notes" className="flex-1">
            <FileText className="h-4 w-4 mr-2" />
            Notes
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="notes" className="flex-1 m-0 p-0">
        <NotesList
          notes={filteredNotes}
          activeNoteId={activeNoteId}
          onNoteSelect={onNoteSelect}
          onNewNote={onNewNote}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
      </TabsContent>
    </Tabs>
  );
}
