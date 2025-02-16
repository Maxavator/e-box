
import { MessageSquare, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Chat = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="flex-1 flex flex-col">
      <header className="h-16 border-b flex items-center justify-between px-6 bg-white">
        <h1 className="text-xl font-semibold">Enterprise Chat</h1>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          className="text-gray-500 hover:text-gray-700"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
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
