
import { StatisticsCards } from "./StatisticsCards";
import { AlertsCard } from "./AlertsCard";
import { QuickActionsCard } from "./QuickActionsCard";

export const DashboardView = () => {
  return (
    <>
      <StatisticsCards />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <AlertsCard />
        <QuickActionsCard />
      </div>
    </>
  );
};
