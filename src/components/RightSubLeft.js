import React, { useState } from "react";
import Header from "./chats/Header";
import ChatBoard from "./chats/ChatBoard";
import InputChat from "./chats/InputChat";
const RightSubLeft = ({
  width,
  updateWidth,
  selectedUserId,
  fetchMessages,
  messages,
  userId,
  selectedUserData,
  setMessages,
  checkRightSection,
  setCheckRightSection,
  setSelectedUserId,
  userData,
  loggedInUser,
  socket,
  setRestoreMessage,
  isReceiverOnline,
  setSelectedUserList
}) => {
  return (
    <div
      className={`w-[100%] bg-white shadow-[inset_0_-2px_0_0_rgb(231,231,231)]  relative h-[80h] sm:h-[72vh] sm:w-[${width}%] `}
      style={{
        transition: "width 0.3s ease-in-out",
      }}
    >
      <Header
        updateWidth={updateWidth}
        setSelectedUserId={setSelectedUserId}
        selectedUserId={selectedUserId}
        userData={userData}
        width={width}
        selectedUserData={selectedUserData}
        isReceiverOnline={isReceiverOnline}
        checkRightSection={checkRightSection}
        setCheckRightSection={setCheckRightSection}
        loggedInUser={loggedInUser}
        setRestoreMessage={setRestoreMessage}
      />
      {/* <ChatBoard
        messages={messages}
        userId={userId}
        selectedUserId={selectedUserId}
      /> */}
      <InputChat
        messages={messages}
        setMessages={setMessages}
        userId={userId}
        selectedUserId={selectedUserId}
        fetchMessages={fetchMessages}
        isReceiverOnline={isReceiverOnline}
        checkRightSection={checkRightSection}
        loggedInUser={loggedInUser}
        userData={userData}
        socket={socket}
        setSelectedUserList={setSelectedUserList}
      />
    </div>
  );
};

export default RightSubLeft;
