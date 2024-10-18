import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import calculateActiveTime from "../utils/calculateActiveTime";
import { notification } from "antd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FaReadme } from "react-icons/fa";
import pic from "../images/photo.jfif";
import getCookie from "../utils/getCookie";
import { CheckOutlined } from "@ant-design/icons";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

const API_URL = "https://backend-socket-7gmk.onrender.com/api";
// const API_URL = "http://localhost:5000/api";

const MessageItem = ({ data, index, deleteUser, loading, message, tab, isReceiverOnline, loggedInUser }) => {
  const { id: userId } = getCookie("loggedin");
  const logourl = "https://www.fansmaps.com/pictures/logo/";
  const navigate = useNavigate();

  const [restore, setRestore] = useState(false);

  const handleDelete = async (selectedUserId) => {
    let { id } = getCookie("loggedin");
    if (!id || !selectedUserId) return;

    try {
      const response = await fetch(`${API_URL}/delete-conversation/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: selectedUserId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();

      // deleteUser(selectedUserId, "");
      // openNotification("success", "Message Deleted!");
      setRestore(true)

    } catch (error) {
      openNotification("error", "Error deleting message");
    }

  }
  const openNotification = (type, message) => {
    notification[type]({
      message: message,
      placement: "topRight",
    });
  };

  const handleRead = async (id) => {
    if (!id) return;
    try {
      const res = await axios.put(`${API_URL}/mark-as-unread/${id}`)
      if (res.status == 200) {
        openNotification("success", "Message is unread!");
      }
      deleteUser("unread", id);
    } catch (error) {
      openNotification("error", "Something went wrong!");
    }
  }

  const handleRestore = async (selectedUserId) => {
    let { id } = getCookie("loggedin");
    if (!id || !selectedUserId) return;
    let time = "";
    if (loggedInUser?.deleted_users?.length > 0) {
      let findDetail = loggedInUser.deleted_users.find(item => item.id == selectedUserId);
      if (findDetail) {
        time = findDetail.timestamp;
      }
    }

    try {
      const response = await fetch(`${API_URL}/restore-conversation/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: selectedUserId, timestamp: time }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setRestore(false)

    } catch (error) {
      openNotification("error", "Error restoring message");
    }
  }

  return (<>

    {message?.id != userId && <div>

      {!restore ? <div
        onClick={() => navigate(`/${tab}/${message.id}`)}
        className="flex items-center justify-between py-[10px] bg-white border-b border-gray-200 cursor-pointer">

        <div className="flex items-center"
        >
          {message?.message?.sender_id == userId ? message?.message?.is_read == 0 ? <CheckOutlined style={{
            fontSize: "15px",
            padding: "6px",
            margin: "0 3px",
            color: "gray"
          }} /> : <div className="w-[15px] mx-[10px]"><svg viewBox="0 0 1024 1024" className="text-gray-400" fill="currentColor"><path d="M777.3,421.5C714.6,376.6,620,345,544.7,345l-98.7,0.1V124.7c0-18.5-22.5-27.8-35.6-14.7l-319,318.9
      c-8.1,8.1-8.1,21.3,0,29.4l319,318.9c13.1,13.1,35.6,3.8,35.6-14.7V531.4c0,0,83.4-0.2,122-0.2c60.9,0,102.3,7.9,142.8,35.4
      c55,37.3,80,94.2,85.4,141.2c7.4,85.1-19.2,119.1-62.1,167.7c-31.8,35.9,8,71.6,45.5,46.3c51.3-34.7,119-112.6,126.1-225.7
      C912.3,589.4,868.2,486.7,777.3,421.5z"></path></svg></div> : (message?.message?.is_pinned == 1 && message?.message?.is_read == 1) ? (
            <span className="mx-[10px] p-[6px] rounded-full bg-[#EBA00E]"></span>
          ) : message?.message?.is_read == 1 ? (
            <span className="mx-[10px] p-[6px] rounded-full bg-gray-400"></span>
          ) : <span className="mx-[10px] p-[6px] rounded-full bg-white"></span>}

          <img
            src={
              message?.logo
                ? `${logourl}${message.logo.slice(0, 2)}/${message.logo}`
                : pic
            }
            alt="user"
            className="w-[85px] h-[100px] rounded-md mr-4"
          />
          <div className="flex-1">
            <div className="font-bold">
              {isReceiverOnline?.includes(message.id.toString()) && (
                <span className="px-1 w-2 h-2 rounded-full bg-green-400 inline-block"></span>
              )}
              <span className="text-[.9rem] sm:text-[1rem]">
                {" "}
                {message?.place_name}
                {/* {message.id} */}
              </span>

              <span className="text-gray-400 font-normal text-[.7rem] sm:text-[1rem]">
                {" "}
                {calculateActiveTime(message?.message.timestamp)}
              </span>
            </div>
            <div className="text-gray-400 text-[.8rem] sm:text-[1rem]">
              {message?.place_city_name && (
                <>
                  {message.place_city_name}
                  {message?.place_state_name || message?.place_country_name ? ', ' : ''}
                </>
              )}
              {message?.place_state_name && (
                <>
                  {message.place_state_name}
                  {message?.place_country_name ? ', ' : ''}
                </>
              )}
              {message?.place_country_name && message.place_country_name}
            </div>

            <div className="text-[.9rem] sm:text-[1rem]">
              {message?.last_message_text}
            </div>
          </div>

        </div>
        <div className="flex gap-1 justify-center items-center p-3">
          <span onClick={(e) => { e.stopPropagation(); handleRead(message?.message?.id); }}> <FaReadme /></span>
          <span onClick={(e) => { e.stopPropagation(); handleDelete(message.id); }} className="ml-4 text-gray-500 ">X</span>
        </div>


      </div> :
        <div onClick={() => navigate(`/${tab}/${message.id}`)} className="flex justify-between items-center p-[10px] bg-white border-b border-gray-200 h-[100px] cursor-pointer">
          <p>Message has been deleted.</p>
          <span onClick={(e) => { e.stopPropagation(); handleRestore(message.id); }} className="cursor-pointer">Restore</span>
        </div>}

      {(loading && data.length - 1 == index) && (
        <div className="flex justify-center p-4">
          <FontAwesomeIcon icon={faSpinner} spin style={{ color: 'rgb(188, 0, 47)', fontSize: '25px' }} />
        </div>
      )}
    </div>}
  </>
  );
};

export default MessageItem;
