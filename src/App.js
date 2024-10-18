import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import './App.css';
import getCookie from "./getCookie";

const API_URL = "https://backend-socket-7gmk.onrender.com";
// const API_URL = "http://localhost:8000";

const logginId = getCookie();
const queryParams = { userId: logginId ? logginId : null };

const socket = io(`${API_URL}`, {
  transports: ["websocket", "polling"],
  query: queryParams,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});



function App() {
  const [isReceiverOnline, setIsReceiverOnline] = useState([]);
  useEffect(() => {
    const handleOnlineUsers = (users) => {
      console.log(users ,"all")
      setIsReceiverOnline(users);
    };

    const handleUserOnline = async ({ userId }) => {
      console.log(userId,"single")
      setIsReceiverOnline((prevUsers) => {
        if (!prevUsers.includes(userId)) {
          return [...prevUsers, userId];
        }
        return prevUsers;
      });

    };

    const handleUserOffline = async ({ userId }) => {
      console.log("remove")
      setIsReceiverOnline((prevUsers) =>
        prevUsers.filter((id) => id !== userId)
      );

    };

    // Attach socket listeners
    if (socket) {
      socket.on("onlineUsers", handleOnlineUsers);
      socket.on("userOnline", handleUserOnline);
      socket.on("userOffline", handleUserOffline);

      // Handle total disconnect (optional)
      socket.on("disconnect", () => {
        console.log("Disconnected from the server");
      });
    }


    return () => {

      if (socket) {
        socket.off("onlineUsers", handleOnlineUsers);
        socket.off("userOnline", handleUserOnline);
        socket.off("userOffline", handleUserOffline);
        socket.off("disconnect");
      }
    };
  }, [socket?.connected]);
  return (
    <div className="App">
      <h1>Chatting Application</h1>
      <div>
        {
          isReceiverOnline?.length > 0 ? isReceiverOnline.map((item, id) => (
            <div key={id} style={{display:"flex", flexDirection:'column'}}>
              <span>{item}</span>
            </div>
          )) : <h1>No result found</h1>
        }
      </div>
    </div>
  );
}

export default App;
