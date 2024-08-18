import React, { useContext, useEffect, useState } from "react"
import { createContext } from "react"
import { useAuthContext } from "./AuthContext"
import { io } from "socket.io-client"

export const SocketContext = createContext()

export const useSocketContext = () => {
  return useContext(SocketContext)
}

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null); // Added typing state
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser) {
      const socket = io("http://localhost:3000", {
        query: {
          userId: authUser._id,
        },
      });

      setSocket(socket);

      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      socket.on("typing", ({ senderId }) => {
        setTypingUser(senderId); // Set typing user when typing event is received
      });

      socket.on("stopTyping", () => {
        setTypingUser(null); // Reset typing user when stopTyping event is received
      });

      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, typingUser }}>
      {children}
    </SocketContext.Provider>
  );
};
