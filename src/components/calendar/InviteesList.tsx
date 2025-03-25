
import { Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  job_title?: string | null;
}

interface InviteesListProps {
  organizationMembers: Profile[];
  selectedInvitees: string[];
  onToggleInvitee: (userId: string) => void;
}

export function InviteesList({ 
  organizationMembers, 
  selectedInvitees, 
  onToggleInvitee 
}: InviteesListProps) {
  if (!organizationMembers || organizationMembers.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        No organization members found
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Invite Colleagues</h3>
      <ScrollArea className="h-[200px] border rounded-md p-2">
        <div className="space-y-2">
          {organizationMembers.map((member) => {
            const isSelected = selectedInvitees.includes(member.id);
            const displayName = `${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Unknown User';
            
            return (
              <div 
                key={member.id} 
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                  isSelected ? 'bg-primary/10' : 'hover:bg-gray-100'
                }`}
                onClick={() => onToggleInvitee(member.id)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar_url || undefined} alt={displayName} />
                    <AvatarFallback>
                      {displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{displayName}</p>
                    {member.job_title && (
                      <p className="text-xs text-gray-500">{member.job_title}</p>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
      <div className="text-xs text-gray-500">
        {selectedInvitees.length} colleague{selectedInvitees.length !== 1 ? 's' : ''} selected
      </div>
    </div>
  );
}
