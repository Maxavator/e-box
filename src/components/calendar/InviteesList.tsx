
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Check, UserPlus } from "lucide-react";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

interface InviteesListProps {
  organizationMembers: Profile[] | undefined;
  selectedInvitees: string[];
  onToggleInvitee: (userId: string) => void;
}

export function InviteesList({ 
  organizationMembers, 
  selectedInvitees, 
  onToggleInvitee 
}: InviteesListProps) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <UserPlus className="h-4 w-4" />
        Invite Members
      </Label>
      <ScrollArea className="h-[200px] border rounded-md p-2">
        {organizationMembers?.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md cursor-pointer"
            onClick={() => onToggleInvitee(member.id)}
          >
            <span>
              {member.first_name} {member.last_name}
            </span>
            {selectedInvitees.includes(member.id) ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <UserPlus className="h-4 w-4 text-gray-400" />
            )}
          </div>
        ))}
        {!organizationMembers?.length && (
          <p className="text-gray-500 text-center p-4">
            No other members in your organization
          </p>
        )}
      </ScrollArea>
    </div>
  );
}
