
import { MessageSquare } from "lucide-react";

const Chat = () => {
  return (
    <div className="flex-1 flex flex-col">
      <header className="h-16 border-b flex items-center px-6 bg-white">
        <h1 className="text-xl font-semibold">Enterprise Chat</h1>
      </header>
      <div className="flex-1 flex">
        <aside className="w-80 border-r bg-white">
          <div className="p-4">
            <h2 className="font-semibold mb-4">Conversations</h2>
            {/* Conversation list will go here */}
          </div>
        </aside>
        <main className="flex-1 flex flex-col bg-gray-50">
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4" />
              <p>Select a conversation to start chatting</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chat;
