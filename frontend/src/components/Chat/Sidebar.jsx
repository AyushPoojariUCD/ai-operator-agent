import React, { useState } from "react";
import { useChat } from "../../contexts/ChatContext";
import { useFirebaseAuth } from "../../hooks/useFirebaseAuth";
import {
  LogOut,
  Menu,
  FileEdit,
  Edit,
  Trash,
  Settings,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

const Sidebar = ({ closeSidebar }) => {
  const { logout } = useFirebaseAuth();

  const {
    conversations,
    switchChat,
    currentIndex,
    newChat,
    renameChat,
    deleteChat,
    mcpEnabled,
    toggleMCP,
  } = useChat();

  const [editingIndex, setEditingIndex] = useState(null);
  const [tempTitle, setTempTitle] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  return (
    <aside className="w-64 bg-[#1f1f3a] p-4 border-r border-gray-700 flex flex-col justify-between">
      <div>
        {/* ✅ Close button for mobile */}
        {closeSidebar && (
          <div className="flex justify-end md:hidden mb-4">
            <button
              onClick={closeSidebar}
              className="text-gray-400 hover:text-orange-500 text-xl"
            >
              ✖
            </button>
          </div>
        )}

        {/* ✅ Branding */}
        <h4 className="text-lg font-semibold flex items-center gap-1 mb-4">
          <span className="animate-flicker text-orange-500 drop-shadow-[0_0_6px_#f97316] text-2xl">
            ⚡
          </span>
          <span className="bg-gradient-to-r from-orange-500 to-purple-500 text-transparent bg-clip-text animate-pulse text-base">
            AI-Browser-Agent
          </span>
        </h4>

        <button
          onClick={newChat}
          className="w-full flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white p-2 rounded mb-4"
        >
          <FileEdit className="w-4 h-4" />
          New Chat
        </button>

        <div className="space-y-2 overflow-y-auto max-h-[55vh] pr-2">
          {conversations.map((c, i) => (
            <div
              key={i}
              className={`flex items-center justify-between group p-2 rounded ${
                i === currentIndex
                  ? "bg-orange-500 text-white"
                  : "bg-[#2b2b45] text-gray-200 hover:bg-gray-700"
              }`}
            >
              {editingIndex === i ? (
                <input
                  value={tempTitle}
                  autoFocus
                  onChange={(e) => setTempTitle(e.target.value)}
                  onBlur={() => {
                    renameChat(i, tempTitle);
                    setEditingIndex(null);
                  }}
                  className="bg-transparent border-b border-gray-500 text-white flex-1 mr-2 outline-none"
                />
              ) : (
                <button
                  className="flex-1 text-left truncate"
                  onClick={() => switchChat(i)}
                >
                  {c.title}
                </button>
              )}

              <div className="flex gap-1 text-xs opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => {
                    setTempTitle(c.title);
                    setEditingIndex(i);
                  }}
                  className="hover:text-white"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteChat(i)}
                  className="hover:text-white"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MCP Settings */}
      <div className="pt-4 border-t border-gray-600">
        <button
          onClick={() => setShowSettings((prev) => !prev)}
          className="w-full flex items-center gap-2 text-sm text-gray-300 hover:text-white"
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>

        {showSettings && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">Enable MCP</span>
              <button
                onClick={toggleMCP}
                className="hover:scale-110 transition"
              >
                {mcpEnabled ? (
                  <ToggleRight className="text-green-400 w-6 h-6" />
                ) : (
                  <ToggleLeft className="text-gray-400 w-6 h-6" />
                )}
              </button>
            </div>
            {mcpEnabled && (
              <p className="text-xs text-green-400 mt-1">
                ✅ Model Context Protocol is enabled
              </p>
            )}
          </div>
        )}
      </div>
      {/* ✅ Logout Button */}
      <div className="mt-6">
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-2 rounded transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
