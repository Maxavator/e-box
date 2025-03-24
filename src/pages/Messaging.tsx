
import { MainLayout } from "@/components/shared/MainLayout";
import { MessagingSystem } from "@/components/chat/MessagingSystem";

const MessagingPage = () => {
  return (
    <MainLayout>
      <div className="flex-1">
        <MessagingSystem />
      </div>
    </MainLayout>
  );
};

export default MessagingPage;
