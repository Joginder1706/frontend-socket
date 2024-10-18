import React, { useState, useEffect, useRef } from "react";
import { CheckOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { Input, message as AntdMessage } from "antd";
import calculateActiveTime from "../../utils/calculateActiveTime";
import TypingIndicator from "../../utils/TypingIndigator";
import { ReactComponent as SendIcon } from "../../images/send-icon.svg";


const InputChat = ({
  messages,
  setMessages,
  userId,
  selectedUserId,
  fetchMessages,
  isReceiverOnline,
  setIsReceiverOnline,
  checkRightSection,
  loggedInUser,
  userData,
  socket,
  setSelectedUserList
}) => {
  const location = useLocation();
  const chatRef = useRef(null);
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [activeTimes, setActiveTimes] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const path = location.pathname.split("/")[1];

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      // behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    userData?.forEach((msg) => {
      if (
        // (path == "inbox" || path == "filtered" || path == "archive" || path == "sent") &&
        // msg.receiver_id == userId &&
        (msg?.message?.receiver_id == userId && msg.id == selectedUserId && socket) && (msg?.message?.is_pinned == 1 || msg?.message?.is_read == 1)
      ) {
        socket.emit("messageRead", msg.message?.id);
        // console.log(" outmsg.is_pinned", msg);
      } else {
        // console.log( msg);
      }
    });


    let updatedList = userData?.map((item) => {
      if (item.id == selectedUserId && item.message?.receiver_id == userId && (item.message?.is_pinned == 1 || item.message?.is_read == 1)) {
        return {
          ...item, message: { ...item.message, is_read: 0, is_pinned: 0 }
        }
      } else {
        return item;
      }
    })
    setSelectedUserList([...updatedList]);

  }, [userData?.length, selectedUserId, socket]);

  useEffect(() => {
    if (socket) {

      socket.on("typing", (data) => {
        if (!typingUsers.includes(data.senderId)) {
          setTypingUsers((prev) => [...prev, data.senderId]);
        }
      });

      socket.on("stopTyping", (data) => {
        setTypingUsers((prev) => prev.filter((id) => id !== data.senderId));
      });

      return () => {
        socket.off("typing");
        socket.off("stopTyping");
      };
    }
  }, [typingUsers]);

  useEffect(() => {
    if (socket) {
      socket.emit("joinRoomSelectedUser", { userId: userId, selectedUserId: selectedUserId });


      socket.on("receiveMessage", (message) => {
        // console.log(message)
        if (
          selectedUserId == message.receiver_id ||
          selectedUserId == message.sender_id
        ) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });


      socket.on("errorMessage", (error) => {
        AntdMessage.error(error.error); // Show error as notification
      });

      socket.on("senderRead", (data) => {
        setMessages((prevMessages) => {
          if (prevMessages?.length > 0) {
            let lastMessage = prevMessages[prevMessages.length - 1];
            if (lastMessage.id === data) {
              const updatedMessages = [...prevMessages];
              updatedMessages[updatedMessages.length - 1] = {
                ...lastMessage,
                is_read: 0,
              };
              return updatedMessages;
            }
          }
          return prevMessages;
        });
      });


      // Clean up the subscription on component unmount
      return () => {
        socket.off("receiveMessage");
        socket.off("errorMessage");
        socket.off("messageReadReceipt");
        socket.off("senderRead");
      };
    }
  }, [userId, selectedUserId, setMessages]);

  // Update active times every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      const updatedActiveTimes = {};
      messages?.forEach((msg) => {
        updatedActiveTimes[msg.id] = calculateActiveTime(msg.timestamp);
      });
      setActiveTimes(updatedActiveTimes);
    }, 60000); // 60000 ms = 1 minute

    return () => clearInterval(intervalId);
  }, [messages]);

  const handleSendMessage = () => {
    if (!message) return;
    const messageData = {
      sender_id: userId,
      receiver_id: selectedUserId,
      message_text: message,
      image_url: imageUrl,
      last_message_timestamp: new Date().toISOString(),
    };

    if (socket) {
      socket.emit("sendMessage", messageData);
    }
    setMessage("");
    setImageUrl("");
  };
  const handleTyping = () => {
    if (socket) {
      if (!isTyping) {
        setIsTyping(true);
        socket.emit("typing", { senderId: userId, receiverId: selectedUserId });
      }

      // Reset typing state after 2 seconds of no typing
      setTimeout(() => {
        setIsTyping(false);
        socket.emit("stopTyping", {
          senderId: userId,
          receiverId: selectedUserId,
        });
      }, 2000);
    }
  };
  return (
    <>
      {!checkRightSection && (
        <div
          className="chat overflow-auto p-3 h-[62vh] sm:h-[55vh]"
          ref={chatRef}
        >
          <div>
            {messages?.length > 0 && (
              <div className="mt-4">
                {messages.map((msg, index) => {
                  let shouldHideMessage = false;
                  if (loggedInUser?.deleted_users?.length > 0) {
                    let findDetail = loggedInUser.deleted_users.find(item => item.id == selectedUserId);
                    if (findDetail) {
                      const deletedTimestamp = new Date(findDetail.timestamp).getTime();
                      const messageTimestamp = new Date(msg.timestamp).getTime();
                      shouldHideMessage = deletedTimestamp > messageTimestamp;
                    }
                  }
                  if (shouldHideMessage) return null;
                  return (
                    <React.Fragment key={index}>
                      <div
                        className={`flex ${msg.sender_id != userId
                          ? "justify-start"
                          : "justify-end"
                          } mb-4`}
                      >
                        <div className="flex flex-col items-end">
                          <div
                            className={`p-2 text-md ${msg.sender_id != userId
                              ? "bg-gray-300 text-black rounded-t-[20px] rounded-br-[20px] rounded-bl-none"
                              : "bg-blue-500 text-white rounded-t-[20px] rounded-bl-[20px] rounded-br-none"
                              }`}
                            style={{ maxWidth: "250px" }} // Optional: limit the message width
                          >
                            {msg.message_text}
                          </div>

                          <div className="text-gray-400 text-[12px] flex">
                            {msg.sender_id == userId &&
                              messages?.length - 1 == index
                              ? msg.is_read == 0
                                ? <><CheckOutlined style={{
                                  fontSize: "9px",
                                  padding: "2px",
                                  margin: "0 1px",
                                  color: "gray"
                                }} /><span>read -&nbsp;</span></>
                                : <div className="flex items-center"><div className="w-[10px] mx-[5px]"><svg viewBox="0 0 1024 1024" className="text-gray-400" fill="currentColor"><path d="M777.3,421.5C714.6,376.6,620,345,544.7,345l-98.7,0.1V124.7c0-18.5-22.5-27.8-35.6-14.7l-319,318.9
      c-8.1,8.1-8.1,21.3,0,29.4l319,318.9c13.1,13.1,35.6,3.8,35.6-14.7V531.4c0,0,83.4-0.2,122-0.2c60.9,0,102.3,7.9,142.8,35.4
      c55,37.3,80,94.2,85.4,141.2c7.4,85.1-19.2,119.1-62.1,167.7c-31.8,35.9,8,71.6,45.5,46.3c51.3-34.7,119-112.6,126.1-225.7
      C912.3,589.4,868.2,486.7,777.3,421.5z"></path></svg> </div><span>delivered -&nbsp;</span></div>
                              : null}
                            {activeTimes[msg.id] ||
                              calculateActiveTime(msg?.timestamp)}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  )

                })}
                {typingUsers.includes(selectedUserId) && <TypingIndicator />}
              </div>
            )}
          </div>
        </div>
      )}
      <div
        // style={{ position: "absolute", bottom: "-80px", width: "100%" }}
        className="flex items-center gap-1 justify-between mt-5 p-2 bg-[#4e4e4e] py-5"
      >
        <Input
          placeholder="Message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          onPressEnter={() => handleSendMessage()}
          disabled={loggedInUser?.block_users?.includes(selectedUserId) ? true : false}
          autoFocus
        />
        <div className="px-[12px]"><SendIcon onClick={handleSendMessage} width="24" height="24" /></div>

      </div>
    </>
  );
};

export default InputChat;
