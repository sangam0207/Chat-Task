import React, { useState, useEffect } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const { loading, sendMessage } = useSendMessage();
  const { socket } = useSocketContext();
  const { selectedConversation } = useConversation();
  const [isTyping, setIsTyping] = useState(false);

  // Typing Indicator
  useEffect(() => {
    if (message && !isTyping) {
      socket.emit("typing", { receiverId: selectedConversation?.userId });
      setIsTyping(true);
    }

    const timeoutId = setTimeout(() => {
      socket.emit("stopTyping", { receiverId: selectedConversation?.userId });
      setIsTyping(false);
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [message, socket, selectedConversation, isTyping]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message) {
      return;
    }

    await sendMessage(message);
    setMessage("");
  };

  return (
    <form className="px-4 my-3" onSubmit={handleSubmit}>
      <div className="w-full relative">
        <input
          type="text"
          className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white"
          placeholder="Enter your text..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="absolute inset-y-0 end-0 flex items-center pe-3"
        >
          {loading ? <div className="loading loading-spinner"></div> : <BsSend />}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
