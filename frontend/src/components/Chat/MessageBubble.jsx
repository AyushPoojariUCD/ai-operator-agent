import React from "react";

const MessageBubble = ({ type, content, timestamp }) => {
  const isUser = type === "user";

  const formatTime = (iso) => {
    const date = new Date(iso);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs sm:max-w-md p-3 rounded-lg ${
          isUser ? "bg-orange-500 text-white" : "bg-[#2b2b45] text-gray-200"
        }`}
      >
        <div>{content}</div>
        {timestamp && (
          <div className="text-[0.7rem] text-gray-400 mt-1 text-right">
            {formatTime(timestamp)}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
