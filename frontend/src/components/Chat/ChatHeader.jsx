import React from "react";
import { useFirebaseAuth } from "../../hooks/useFirebaseAuth";
import { LogOut, Menu } from "lucide-react";

const ChatHeader = ({ onToggleSidebar }) => {
  const { logout } = useFirebaseAuth();

  return (
    <header className="p-4 border-b border-gray-700 bg-[#131321] flex justify-between items-center">
      {/* Sidebar toggle button on small screens */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden text-gray-400 hover:text-orange-500 transition"
        >
          <Menu className="w-6 h-6" />
        </button>

        <h1 className="text-lg font-bold text-white">AI-Browser-Agent</h1>
      </div>

      <button
        onClick={logout}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-2 rounded transition"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </header>
  );
};

export default ChatHeader;
