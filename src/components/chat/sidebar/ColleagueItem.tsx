
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ColleagueItemProps {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl?: string;
  jobTitle?: string;
  isPartner?: boolean;
  onClick: (id: string) => void;
}

export function ColleagueItem({
  id,
  firstName,
  lastName,
  avatarUrl,
  jobTitle,
  isPartner = false,
  onClick,
}: ColleagueItemProps) {
  return (
    <Button
      key={id}
      variant="ghost"
      className="w-full justify-start"
      onClick={() => onClick(id)}
    >
      <div className="flex items-center w-full">
        <Avatar className={`h-9 w-9 mr-2 ${isPartner ? 'border-2 border-amber-200' : ''}`}>
          <AvatarImage src={avatarUrl || ''} />
          <AvatarFallback className={isPartner ? "bg-amber-50 text-amber-700" : undefined}>
            {firstName?.[0]}{lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <span className="font-medium">
            {firstName} {lastName}
          </span>
          {jobTitle && (
            <span className="text-xs text-muted-foreground">
              {jobTitle}
            </span>
          )}
        </div>
      </div>
    </Button>
  );
}
