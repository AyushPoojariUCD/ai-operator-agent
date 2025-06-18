import React, { useState, useEffect } from "react";
import {
  FileEdit,
  Edit,
  Trash,
  LogOut,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useChat } from "../../contexts/ChatContext";
import { useFirebaseAuth } from "../../hooks/useFirebaseAuth";
import axios from "axios";

const Sidebar = ({ closeSidebar }) => {
  const { logout } = useFirebaseAuth();
  const {
    conversations,
    switchChat,
    currentIndex,
    newChat,
    renameChat,
    deleteChat,
    modelType,
    setModelType,
    temperature,
    setTemperature,
    mcpEnabled,
    toggleMCP,
  } = useChat();

  const [editingIndex, setEditingIndex] = useState(null);
  const [tempTitle, setTempTitle] = useState("");
  const [showDevSettings, setShowDevSettings] = useState(false);
  const [configContent, setConfigContent] = useState("{}");
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await axios.get("/api/mcp/config");
        const content = Object.keys(res.data).length ? res.data : {};
        setConfigContent(JSON.stringify(content, null, 2));
      } catch (err) {
        setConfigContent("{}");
        console.error("Failed to load mcp_config.json:", err);
      }
    };
    loadConfig();
  }, []);

  const handleSaveConfig = async () => {
    try {
      const parsed = JSON.parse(configContent);
      await axios.post("/api/mcp/config", parsed);
      setSaveStatus("✅ Saved successfully");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch {
      setSaveStatus("❌ Failed to save: Invalid JSON or server error");
    }
  };

  return (
    <aside className="w-64 bg-[#1f1f3a] p-4 border-r border-gray-700 flex flex-col justify-between">
      <div>
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

        <h4 className="text-lg font-semibold flex items-center gap-1 mb-4">
          <span className="animate-flicker text-orange-500 drop-shadow text-2xl">
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

        <div className="space-y-2 overflow-y-auto max-h-[45vh] pr-2">
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

        {/* 🔧 MCP toggle, agent & temperature settings */}
        <div className="pt-4 border-t border-gray-600 mt-4 space-y-2">
          <div>
            <label className="text-sm text-gray-300">LLM Provider</label>
            <select
              value={modelType}
              onChange={(e) => setModelType(e.target.value)}
              className="w-full p-1 rounded bg-[#2b2b45] text-white text-sm"
            >
              {/* OpenAI */}
              <option value="gpt-4o">GPT-4o (OpenAI)</option>
              <option value="gpt-4">GPT-4 (OpenAI)</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo (OpenAI)</option>

              {/* Anthropic */}
              <option value="claude-3-sonnet-20240229">
                Claude 3 Sonnet (Anthropic)
              </option>
              <option value="claude-3-haiku-20240307">
                Claude 3 Haiku (Anthropic)
              </option>
              <option value="claude-3-opus-20240229">
                Claude 3 Opus (Anthropic)
              </option>

              {/* Mistral (via official SDK) */}
              <option value="mistral-small-latest">
                Mistral Small (Mistral AI)
              </option>
              <option value="mistral-medium-latest">
                Mistral Medium (Mistral AI)
              </option>
              <option value="mistral-large-latest">
                Mistral Large (Mistral AI)
              </option>

              {/* Meta LLaMA (via Together API or Groq) */}
              <option value="llama3-8b-8192">LLaMA 3 (8B)</option>
              <option value="llama3-70b-8192">LLaMA 3 (70B)</option>

              {/* Google Gemini */}
              <option value="gemini-1.5-pro-latest">
                Gemini 1.5 Pro (Google)
              </option>

              {/* Cohere (Command R models) */}
              <option value="command-r">Command R (Cohere)</option>
              <option value="command-r-plus">Command R+ (Cohere)</option>

              {/* Groq (Mixtral) */}
              <option value="mixtral-8x7b-32768">Mixtral (Groq)</option>

              {/* Perplexity (if supported through LLM router) */}
              <option value="perplexity">Perplexity</option>
            </select>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-300">
            <span>Temperature</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="ml-2 flex-1"
            />
            <span className="ml-2 text-white">{temperature}</span>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-300">
            <label htmlFor="mcp-toggle">Enable MCP Tools</label>
            <button
              id="mcp-toggle"
              onClick={toggleMCP}
              aria-pressed={mcpEnabled}
              className={`px-3 py-1 rounded text-white text-xs font-semibold transition-colors ${
                mcpEnabled
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-600 hover:bg-gray-500"
              }`}
            >
              {mcpEnabled ? "Enabled" : "Disabled"}
            </button>
          </div>
        </div>

        {/* 🛠️ Developer Settings */}
        <div className="pt-4 border-t border-gray-600 mt-4">
          <button
            onClick={() => setShowDevSettings(!showDevSettings)}
            className="text-sm text-gray-300 flex items-center justify-between w-full"
          >
            Developer Settings
            {showDevSettings ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showDevSettings && (
            <div className="mt-2 space-y-2">
              <textarea
                rows={10}
                className="w-full p-2 text-sm bg-[#2b2b45] text-white rounded font-mono resize-y"
                value={configContent}
                onChange={(e) => setConfigContent(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    try {
                      const res = await axios.get("/api/mcp/config");
                      setConfigContent(JSON.stringify(res.data, null, 2));
                      setSaveStatus("✅ Reloaded");
                      setTimeout(() => setSaveStatus(""), 1500);
                    } catch {
                      setSaveStatus("❌ Reload failed");
                    }
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 text-sm rounded"
                >
                  Reload
                </button>
                <button
                  onClick={handleSaveConfig}
                  className="bg-orange-600 hover:bg-orange-700 text-white py-1 px-3 text-sm rounded"
                >
                  Save mcp_config.json
                </button>
              </div>
              {saveStatus && (
                <p
                  className={`text-xs ${
                    saveStatus.includes("❌")
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  {saveStatus}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={logout}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-2 rounded transition mt-4"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
