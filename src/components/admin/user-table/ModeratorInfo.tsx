
interface ModeratorInfoProps {
  roleValue: string;
}

export const ModeratorInfo = ({ roleValue }: ModeratorInfoProps) => {
  if (!['hr_moderator', 'comm_moderator', 'stakeholder_moderator'].includes(roleValue)) {
    return null;
  }

  return (
    <div className="mt-1 text-xs text-muted-foreground">
      {roleValue === 'hr_moderator' && 'Manages HR, leave requests, vacancies'}
      {roleValue === 'comm_moderator' && 'Manages internal & external communications'}
      {roleValue === 'stakeholder_moderator' && 'Manages stakeholder communications'}
    </div>
  );
};
