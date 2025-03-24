
// This file is deprecated - use src/layouts/MainLayout.tsx instead
import { MainLayout as ActualMainLayout } from "@/layouts/MainLayout";

export const MainLayout = ActualMainLayout;
export const withMainLayout = (Component: React.ComponentType<any>) => {
  return function WrappedComponent(props: any) {
    return (
      <ActualMainLayout>
        <Component {...props} />
      </ActualMainLayout>
    );
  };
};
