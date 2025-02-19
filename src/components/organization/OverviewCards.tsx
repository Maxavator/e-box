
import { QuickStatsCard } from "./cards/QuickStatsCard";
import { CalendarCard } from "./cards/CalendarCard";
import { DocumentsCard } from "./cards/DocumentsCard";
import { ActivityCard } from "./cards/ActivityCard";
import { PerformanceCard, SecurityCard } from "./cards/AdminCards";

interface OverviewCardsProps {
  isAdmin: boolean;
}

export const OverviewCards = ({ isAdmin }: OverviewCardsProps) => {
  return (
    <>
      <QuickStatsCard />
      <CalendarCard />
      <DocumentsCard />
      <ActivityCard />
      {isAdmin && (
        <>
          <PerformanceCard />
          <SecurityCard />
        </>
      )}
    </>
  );
};
