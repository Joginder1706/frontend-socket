import React, { useState, useEffect } from "react";
import RightSubLeft from "./RightSubLeft";
import RightSubRight from "./RightSubRight";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import getCookie from "../utils/getCookie";
const RightSection = ({ userData, loggedInUser, socket, setRestoreMessage, isReceiverOnline, setSelectedUserList }) => {
  const { id } = useParams();
  const [width, setWidth] = useState(65);
  const [selectedUserId, setSelectedUserId] = useState(id ?? "");
  const [userId, setUserId] = useState("");
  const [selectedUserData, setSelectedUserData] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkRightSection, setCheckRightSection] = useState(false);

  // const API_URL = "https://backend-socket-7gmk.onrender.com/api";
  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    const { id: userCookie } = getCookie("loggedin");
    setUserId(userCookie);
    fetchMessages();
    fetchUserData();
  }, [userId, selectedUserId]);

  const fetchMessages = async () => {
    const selectedId = selectedUserId ?? id;
    if (!userId || !selectedId) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/messages/${userId}/${selectedId}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const fetchUserData = async () => {
    const selectedId = selectedUserId ?? id;
    if (!userId || !selectedId) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/user/${selectedId}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const parsedetails = JSON.parse(response.data[0]?.details);
      const parsePhoto = JSON.parse(response.data[0]?.photos);
      const data = {
        ...response.data[0],
        details: parsedetails,
        photos: parsePhoto,
        id: parseInt(userId)
      };

      setSelectedUserData(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const updateWidth = (newWidth) => {
    setWidth(newWidth);
  };


  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingTop: "30px" }}>
        {loading && <FontAwesomeIcon icon={faSpinner} spin style={{ color: 'rgb(188, 0, 47)', fontSize: '25px' }} />}
      </div>
    )
  }
  // console.log(isReceiverOnline)
  return (
    <div className="flex justify-between">
      <RightSubLeft
        loggedInUser={loggedInUser}
        width={width}
        updateWidth={updateWidth}
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
        userData={userData}
        fetchMessages={fetchMessages}
        messages={messages}
        setMessages={setMessages}
        userId={userId}
        selectedUserData={selectedUserData}
        checkRightSection={checkRightSection}
        setCheckRightSection={setCheckRightSection}
        socket={socket}
        setRestoreMessage={setRestoreMessage}
        isReceiverOnline={isReceiverOnline}
        setSelectedUserList={setSelectedUserList}

      />
      <div className={`hidden sm:block w-[${100 - width}%]`}>
        <RightSubRight
          width={width}
          selectedUserData={selectedUserData}
          checkRightSection={checkRightSection}
        />
      </div>
    </div>
  );
};

export default RightSection;
