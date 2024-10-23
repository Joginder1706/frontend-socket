import React, { useState, useEffect, useRef } from "react";
import "./App.css"
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
  Link,
  useNavigate
} from "react-router-dom";
import io from "socket.io-client";
import Sidebar from "./Layouts/Sidebar";
import InboxPage from "./pages/Inbox";
import FilteredPage from "./pages/Filtered";
import RightSection from "./components/RightSection";
import ProfilePage from "./pages/ProfilePage";
import SentPage from "./pages/Sent";
import ArchivePage from "./pages/Archive";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useMediaQuery } from "react-responsive";
import getCookie from "./utils/getCookie";
import axios from "axios";

const API_URL = "https://backend-socket-7gmk.onrender.com";
// const API_URL = "http://localhost:5000";

const logginId = getCookie("loggedin");
const queryParams = { userId: logginId ? logginId.id : null };

const socket = io(`${API_URL}`, {
  transports: ["websocket", "polling"],
  query: queryParams,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});


function AppContent() {
  const { id: loggedId } = getCookie("loggedin");

  // Check if the socket is already connected or reconnecting
  const isSocketConnected = useRef(false);
  const [isSocketReady, setIsSocketReady] = useState(false);
  const [userDetail, setUserDetail] = useState([]);
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false);
  const [selectedUserList, setSelectedUserList] = useState([]);
  const [countUnRead, setCountUnRead] = useState(0);
  const [fetchDataById, setFetchDataById] = useState("");
  const [fetchUserOnlineId, setFetchUserOnlineId] = useState("")
  const [isReceiverOnline, setIsReceiverOnline] = useState([]);
  const [restoreMessage, setRestoreMessage] = useState({
    status: false,
    id: "",
    path: "",
    timestamp: ""
  })
  const location = useLocation();
  const navigate = useNavigate();
  const isChatWindow = [
    /^\/inbox\/[^/]+$/,
    /^\/filtered\/[^/]+$/,
    /^\/sent\/[^/]+$/,
    /^\/archive\/[^/]+$/,
  ].some((pattern) => pattern.test(location.pathname));

  const isUserProfile = location.pathname.startsWith("/member");
  const isMobile = useMediaQuery({ query: "(max-width: 639px)" });
  const path = location.pathname.split("/");
  const pathArray = location.pathname.split("/");



  // const joinRoom = () => {
  //   if (loggedId && socket?.connected) {
  //     console.log("Socket is connected, joining room");
  //     socket.emit("joinRoom", { userId: loggedId });
  //   } else {
  //     console.log("Socket is not connected yet");
  //   }
  // };

  // useEffect(() => {
  //   const handleSocketConnect = () => {
  //     if (!isSocketConnected.current) {
  //       isSocketConnected.current = true;
  //       setIsSocketReady(true);
  //       joinRoom();
  //     }
  //   };
  //   const handleSocketReconnect = () => {
  //     if (isSocketReady && loggedId) {
  //       joinRoom();
  //     }
  //   };
  //   socket.on("connect", handleSocketConnect);
  //   socket.on("reconnect", handleSocketReconnect);

  //   if (loggedId && socket?.connected) {
  //     joinRoom();
  //   }

  //   return () => {
  //     socket.off("connect", handleSocketConnect);
  //     socket.off("reconnect", handleSocketReconnect);
  //   };

  // }, [socket?.connected, loggedId]);


  useEffect(() => {
    const handleOnlineUsers = (users) => {
      console.log(users, "all")
      setIsReceiverOnline(users);
    };

    const handleUserOnline = async ({ userId }) => {
      console.log(userId, "single")
      setIsReceiverOnline((prevUsers) => {
        if (!prevUsers.includes(userId)) {
          return [...prevUsers, userId];
        }
        return prevUsers;
      });

    };

    const handleUserOffline = async ({ userId }) => {
      console.log(userId, "remove")
      setIsReceiverOnline((prevUsers) =>
        prevUsers.filter((id) => id !== userId)
      );
    };

    // Attach socket listeners
    if (socket) {
      socket.on("onlineUsers", handleOnlineUsers);
      socket.on("userOnline", handleUserOnline);
      socket.on("userOffline", handleUserOffline);
      socket.on("sendForOfflineUsers", (message) => {
        if (loggedId === message?.receiver_id) {
          if (message.is_read === 1 && message?.receiver_online === 0) {
            setFetchDataById(message.id);
          }

          if (message.is_read === 1 && message?.receiver_online === 1) {
            setFetchUserOnlineId(message.id);
          }
        }
      });

      // Handle total disconnect (optional)
      socket.on("disconnect", () => {
        console.log("Disconnected from the server");
      });
    }


    return () => {

      if (socket) {
        socket.off("sendForOfflineUsers");
        socket.off("onlineUsers", handleOnlineUsers);
        socket.off("userOnline", handleUserOnline);
        socket.off("userOffline", handleUserOffline);
        socket.off("disconnect");
      }
    };
  }, [socket]);



  useEffect(() => {
    if (path[1] != "inbox" || path?.length > 2) {
      setRestoreMessage((prev) => (
        {
          ...prev,
          status: false,
          id: "",
          path: "",
          timestamp: ""
        }
      ))
    }
  }, [path[1], path?.length])

  const Auth = async () => {
    let { id, token } = getCookie("loggedin");
    if (!id || !token) return;
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/${id}`, { token }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response?.status == 201) {
        window.location.href = "https://www.fansmaps.com/user/sign-out"
      }
      setLoading(false);

    } catch (error) {
      setLoading(false);
      // Log more detailed error information
      if (error.response) {
        console.log('Error Response:', error.response.data);
      } else {
        console.log('Error:', error?.message);
      }
    }
  };


  const fetchUserData = async () => {
    let { id } = getCookie("loggedin");
    if (!id) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/user/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          // If you have a token
          // 'Authorization': `Bearer ${yourToken}`
        }
      });
      const parsedetails = response.data[0]?.details ? JSON.parse(response.data[0]?.details) : null;
      const parseArchive = response.data[0]?.archived_users ? JSON.parse(response.data[0]?.archived_users) : null;
      const parseBlockedUser = response.data[0]?.block_users ? JSON.parse(response.data[0]?.block_users) : null;
      const parseDeletedUser = response.data[0]?.deleted_users ? JSON.parse(response.data[0]?.deleted_users) : null;
      const data = {
        ...response.data[0],
        details: parsedetails,
        archived_users: parseArchive,
        block_users: parseBlockedUser,
        deleted_users: parseDeletedUser
      };
      setUserDetail(data);
      // console.log(data)
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleRestore = async () => {
    let { id } = getCookie("loggedin");
    if (!id || !restoreMessage.id) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/restore-conversation/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: restoreMessage.id, timestamp: restoreMessage.timestamp }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      navigate(`${restoreMessage.path}/${restoreMessage.id}`)
      setRestoreMessage((prev) => (
        {
          ...prev,
          status: false,
          id: "",
          path: "",
          timestamp: ""
        }
      ))

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    fetchUserData();
  }, [pathArray?.length]);

  useEffect(() => {
    if (loggedId && pathArray?.length == 3) {
      if (pathArray[2] == loggedId) {
        navigate('/inbox')
      }
    }
    // Auth();
  }, [loggedId])

  // console.log(isReceiverOnline, socket)

  return (
    <div>
      <div className={`${isMobile && isChatWindow ? "hidden" : ""}`}><Header userDetail={userDetail} selectedUserList={selectedUserList} countUnRead={countUnRead} setCountUnRead={setCountUnRead} socket={socket} /></div>

      {restoreMessage.status === true && <div className="bg-[#E6F7F7] p-2 md:pl-[16%] md:pr-[15%]">Message has been deleted. <span onClick={handleRestore} className="underline cursor-pointer">Restore?</span></div>}

      <div style={{ minHeight: "calc(85vh - 64px)" }} className="main-container px-1 box-border flex flex-col md:flex-row pb-5 sm:mt-2 md:pl-[15%] md:pr-[15%]">
        <div
          className={`w-full md:w-1/4  p-1 md:p-4 ${isMobile && isChatWindow ? "hidden" : ""
            }`}
        >
          <Sidebar userDetail={userDetail} success={success} setSuccess={setSuccess} selectedUserList={selectedUserList} setCountUnRead={setCountUnRead} fetchDataById={fetchDataById} fetchUserOnlineId={fetchUserOnlineId} />
        </div>

        <div
          className={`content ${isUserProfile ? "w-full" : "w-full md:w-3/4"}`}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/inbox" />} />
            <Route path="/inbox" element={<InboxPage setSelectedUserList={setSelectedUserList} success={success} setSuccess={setSuccess} loading={loading} socket={socket} fetchDataById={fetchDataById} isReceiverOnline={isReceiverOnline} loggedInUser={userDetail} />} />
            <Route path="/inbox/:id" element={<RightSection userData={selectedUserList} loggedInUser={userDetail} socket={socket} setRestoreMessage={setRestoreMessage} isReceiverOnline={isReceiverOnline} setSelectedUserList={setSelectedUserList} />} />
            <Route path="/filtered" element={<FilteredPage setSelectedUserList={setSelectedUserList} success={success} setSuccess={setSuccess} loading={loading} socket={socket} fetchDataById={fetchDataById} isReceiverOnline={isReceiverOnline} loggedInUser={userDetail} />} />
            <Route path="/filtered/:id" element={<RightSection userData={selectedUserList} loggedInUser={userDetail} socket={socket} setRestoreMessage={setRestoreMessage} isReceiverOnline={isReceiverOnline} setSelectedUserList={setSelectedUserList} />} />
            <Route path="/sent" element={<SentPage setSelectedUserList={setSelectedUserList} success={success} setSuccess={setSuccess} loading={loading} socket={socket} fetchDataById={fetchDataById} isReceiverOnline={isReceiverOnline} loggedInUser={userDetail} />} />
            <Route path="/sent/:id" element={<RightSection userData={selectedUserList} loggedInUser={userDetail} socket={socket} setRestoreMessage={setRestoreMessage} isReceiverOnline={isReceiverOnline} setSelectedUserList={setSelectedUserList} />} />
            <Route path="/archive" element={<ArchivePage setSelectedUserList={setSelectedUserList} success={success} setSuccess={setSuccess} loading={loading} socket={socket} fetchDataById={fetchDataById} isReceiverOnline={isReceiverOnline} loggedInUser={userDetail} />} />
            <Route path="/archive/:id" element={<RightSection userData={selectedUserList} loggedInUser={userDetail} socket={socket} setRestoreMessage={setRestoreMessage} isReceiverOnline={isReceiverOnline} setSelectedUserList={setSelectedUserList} />} />
            <Route path="/member/:id" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
      {!isChatWindow && <Footer />}
      <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600&display=swap" rel="stylesheet" />
    </div>
  );
}

function App() {
  const loginUser = getCookie("loggedin");
  let loggedId = undefined;
  if (loginUser) {
    loggedId = loginUser?.id;
  }
  return (
    <Router basename="/messages">
      {loggedId === null || loggedId === undefined ? (
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <div className="text-center">
            <p className="mb-4 text-lg md:text-[30px] font-bold text-gray-700">
              Please login to access this page.
            </p>
            <Link to="https://www.fansmaps.com/user/sign-in">
              <button className="px-4 py-2 bg-[#4e4e4e] text-white font-bold rounded-lg shadow-md transition duration-300">
                Go to Login Page
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <AppContent />
      )}
    </Router>
  );
}

export default App;
