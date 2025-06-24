// src/contexts/ChatContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ChatContext = createContext();

// 1️⃣ Simple site-URL extractor
const deriveUrl = (command) => {
  const cmd = command.toLowerCase();
  if (cmd.includes("tesco")) return "https://www.tesco.ie/groceries/en-IE";
  if (cmd.includes("amazon")) return "https://www.amazon.com/";
  if (cmd.includes("flipkart")) return "https://www.flipkart.com/";
  console.warn("⚠️ deriveUrl: no mapping for command:", command);
  return "";
};

export const ChatProvider = ({ children }) => {
  // Conversations state
  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem("conversations");
      const parsed = saved ? JSON.parse(saved) : [];
      return parsed.length > 0 ? parsed : [{ title: "Chat 1", messages: [] }];
    } catch {
      return [{ title: "Chat 1", messages: [] }];
    }
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mcpEnabled, setMcpEnabled] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }, [conversations]);

  const toggleMCP = () => setMcpEnabled((prev) => !prev);

  const addMessage = (type, content) => {
    if (!conversations[currentIndex]) return;
    const newMessage = {
      type,
      content,
      timestamp: new Date().toISOString(),
      userId: "guest",
    };
    setConversations((prev) => {
      const updated = [...prev];
      updated[currentIndex] = {
        ...updated[currentIndex],
        messages: [...updated[currentIndex].messages, newMessage],
      };
      return updated;
    });
  };

  const getOpenAIMessages = (msgs) =>
    msgs.map((msg) =>
      msg.type === "user"
        ? { role: "user", content: msg.content }
        : { role: "assistant", content: msg.content }
    );

  const sendMessage = async (userInput) => {
    // Ensure there is at least one conversation
    if (!conversations[currentIndex]) {
      setConversations([{ title: "Chat 1", messages: [] }]);
      setCurrentIndex(0);
    }

    const currentMessages = conversations[currentIndex].messages;
    addMessage("user", userInput);
    setLoading(true);

    let pageHTML = "";

    // 2️⃣ MCP navigation & scraping (if enabled)
    if (mcpEnabled && window.electronAPI?.openAgentURL) {
      console.log("[MCP] deriveUrl:", userInput);
      const targetUrl = deriveUrl(userInput);
      console.log("[MCP] targetUrl:", targetUrl);

      if (targetUrl) {
        try {
          console.log("[MCP] opening URL");
          const result = await window.electronAPI.openAgentURL(targetUrl);
          console.log("[MCP] openAgentURL result:", result);

          if (result.status === "success") {
            // optional delay for page load
            await new Promise((r) => setTimeout(r, 1000));
            console.log("[MCP] scraping HTML");
            pageHTML = await window.electronAPI.getAgentHTML();
            console.log("[MCP] HTML length:", pageHTML.length);
          } else {
            console.warn("[MCP] openAgentURL failed:", result.message);
          }
        } catch (err) {
          console.error("[MCP] error during navigation/scrape:", err);
        }
      } else {
        console.warn("[MCP] no URL derived; skipping navigation");
      }
    }

    // 3️⃣ Always send to backend
    try {
      const { data } = await axios.post("http://localhost:8000/api/chat", {
        messages: [
          ...getOpenAIMessages(currentMessages),
          { role: "user", content: userInput },
        ],
        mcpEnabled,
        html: pageHTML,
      });

      // 4️⃣ Add AI reply
      addMessage("ai", data.reply);

      // 5️⃣ If MCP used and actions returned, execute them
      if (mcpEnabled && Array.isArray(data.actions) && data.actions.length) {
        console.log("[MCP] executing actions:", data.actions);
        const execResult =
          window.electronAPI?.runActions &&
          (await window.electronAPI.runActions(data.actions));
        console.log("[MCP] runActions result:", execResult);
      }
    } catch (err) {
      console.error("❌ API error:", err);
      addMessage("ai", "❌ Failed to get response.");
    } finally {
      setLoading(false);
    }
  };

  const newChat = () => {
    setConversations((prev) => [...prev, { title: `Chat ${prev.length + 1}`, messages: [] }]);
    setCurrentIndex(conversations.length);
  };

  const renameChat = (idx, newTitle) =>
    setConversations((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, title: newTitle } : c))
    );

  const deleteChat = (idx) => {
    const updated = conversations.filter((_, i) => i !== idx);
    setConversations(updated);
    setCurrentIndex((i) => (i === idx ? 0 : i > idx ? i - 1 : i));
  };

  const switchChat = (idx) => {
    if (idx >= 0 && idx < conversations.length) setCurrentIndex(idx);
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentMessages: conversations[currentIndex]?.messages || [],
        sendMessage,
        newChat,
        switchChat,
        currentIndex,
        renameChat,
        deleteChat,
        loading,
        mcpEnabled,
        toggleMCP,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
