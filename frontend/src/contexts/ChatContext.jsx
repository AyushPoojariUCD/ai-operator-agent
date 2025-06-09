// src/contexts/ChatContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
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

  // Update localStorage when conversations change
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

  const getOpenAIMessages = (messages) =>
    messages.map((msg) =>
      msg.type === "user"
        ? { role: "user", content: msg.content }
        : { role: "assistant", content: msg.content }
    );

  const sendMessage = async (userInput) => {
    if (conversations.length === 0 || !conversations[currentIndex]) {
      const defaultChat = { title: "Chat 1", messages: [] };
      setConversations([defaultChat]);
      setCurrentIndex(0);
      console.warn("⚠️ No chat session available. Created a new one.");
      return;
    }

    const currentMessages =
      conversations?.[currentIndex]?.messages ??
      conversations[0]?.messages ??
      [];

    addMessage("user", userInput);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/chat", {
        messages: [
          ...getOpenAIMessages(currentMessages),
          { role: "user", content: userInput },
        ],
        mcpEnabled,
      });

      const aiResponse = response.data.reply;
      addMessage("ai", aiResponse);
    } catch (err) {
      console.error("API error:", err);
      addMessage("ai", "❌ Failed to get response.");
    } finally {
      setLoading(false);
    }
  };

  const newChat = () => {
    const title = `Chat ${conversations.length + 1}`;
    const newConversation = { title, messages: [] };
    setConversations((prev) => [...prev, newConversation]);
    setCurrentIndex(conversations.length);
  };

  const renameChat = (index, newTitle) => {
    setConversations((prev) =>
      prev.map((c, i) => (i === index ? { ...c, title: newTitle } : c))
    );
  };

  const deleteChat = (index) => {
    const updated = conversations.filter((_, i) => i !== index);
    setConversations(updated);

    if (index === currentIndex) {
      setCurrentIndex(0);
    } else if (index < currentIndex) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const switchChat = (index) => {
    if (index >= 0 && index < conversations.length) {
      setCurrentIndex(index);
    }
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
