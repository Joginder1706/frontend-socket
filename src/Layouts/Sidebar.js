import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input, Tabs } from "antd";
import pic from "../images/photo.jfif";
import { SearchOutlined } from "@ant-design/icons";
import InboxFilterModal from "../components/InboxFilterModal";
import logo from "../images/favicon-96.png";
import axios from "axios";
import getCookie from "../utils/getCookie";
const { TabPane } = Tabs;
const Sidebar = ({ userDetail, success, setSuccess, selectedUserList, setCountUnRead, fetchDataById, fetchUserOnlineId }) => {
  const { id: userId } = getCookie("loggedin")
  const logourl = "https://www.fansmaps.com/pictures/logo/";

  const API_URL = "https://backend-socket-7gmk.onrender.com/api";
  // const API_URL = "http://localhost:5000/api";

  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.split("/")[1];
  const pathArray = location.pathname.split("/");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false)
  const [countInbox, setCountInbox] = useState(0);
  const [countFiltered, setCountFiltered] = useState(0);
  const [countArchive, setCountArchive] = useState(0);
  const [countSent, setCountSent] = useState(0);

  const fetchFilter = async () => {
    let { id } = getCookie("loggedin");
    if (!id) return;

    try {
      const response = await axios.get(`${API_URL}/filtered?userid=${id}&page=1&limit=500`);

      if (response?.data?.length > 0) {
        let count = 0;
        response.data.forEach(element => {
          if (element?.message.is_read == 1 && element?.message?.receiver_id == id && element?.id != id) {
            count++;
          }
        });
        setCountFiltered(count);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchArchive = async () => {
    let { id } = getCookie("loggedin");
    if (!id) return;

    try {
      const response = await axios.get(`${API_URL}/archive?userid=${id}&page=1&limit=500`);
      if (response?.data?.length > 0) {
        let count = 0;
        response.data.forEach(element => {
          if (element?.message.is_read == 1 && element?.message?.receiver_id == id && element?.id != id) {
            count++;
          }
        });
        setCountArchive(count);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchInbox = async () => {
    let { id } = getCookie("loggedin");
    if (!id) return;

    try {
      const response = await axios.get(`${API_URL}/inbox?userid=${id}&page=1&limit=500`);
      if (response?.data?.length > 0) {
        let count = 0;
        response.data.forEach(element => {
          if (element?.message.is_read == 1 && element?.message?.receiver_id == id && element?.id != id) {
            count++;
          }
        });
        setCountInbox(count);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };


  useEffect(() => {
    fetchInbox();
    fetchFilter();
    fetchArchive();
  }, [fetchDataById, fetchUserOnlineId])
  // }, [pathArray?.length, fetchDataById, fetchUserOnlineId])


  useEffect(() => {
    let count = countArchive + countFiltered + countInbox;
    setCountUnRead(count)
  }, [countArchive, countFiltered, countInbox])

  useEffect(() => {
    setSuccess(successMessage)
  }, [successMessage])

  useEffect(() => {
    setSuccessMessage(success)
  }, [success])

  useEffect(() => {
    if (path === "inbox") {
      if (selectedUserList?.length > 0) {
        let count = 0;
        selectedUserList.forEach(element => {
          if (element?.message.is_read == 1 && element?.message?.receiver_id == userId && element?.id != userId) {
            count++;
          }
        });
        setCountInbox(count);
      } else {
        setCountInbox(0);
      }
    }
    if (path === "filtered") {
      if (selectedUserList?.length > 0) {
        let count = 0;
        selectedUserList.forEach(element => {
          if (element?.message.is_read == 1 && element?.message?.receiver_id == userId && element?.id != userId) {
            count++;
          }
        });
        setCountFiltered(count);
      } else {
        setCountFiltered(0);
      }
    }

    if (path === "archive") {
      if (selectedUserList?.length > 0) {
        let count = 0;
        selectedUserList.forEach(element => {
          if (element?.message.is_read == 1 && element?.message?.receiver_id == userId && element?.id != userId) {
            count++;
          }
        });
        setCountArchive(count);
      } else {
        setCountArchive(0)
      }
    }

  }, [pathArray?.length, path, selectedUserList])

  const menuItems = [
    { key: "inbox", label: "Inbox" },
    { key: "filtered", label: "Filtered Out" },
    { key: "sent", label: "Sent" },
    { key: "archive", label: "Archive" },
  ];

  const handleClick = (item) => {
    navigate(`/${item}`);
  };

  const getPath = (key) => {
    if (key === 'inbox') {
      return countInbox;
    }
    else if (key === 'filtered') {
      return countFiltered
    }
    else if (key === 'archive') {
      return countArchive
    }
    else if (key === 'sent') {
      return 0
    }
    else {
      return 0;
    }
  }

  return (
    <div>
      <div className="hidden md:block ">
        <InboxFilterModal
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          setSuccessMessage={setSuccessMessage}
        />
      </div>

      <div className="md:hidden block w-full bg-[#FFFFFF] pb-2 border-b">

        <div className="flex justify-center mt-4">
          <Tabs
            defaultActiveKey="inbox"
            onChange={handleClick}
            activeKey={path}
            className="flex justify-center w-full"
            tabBarStyle={{
              display: "flex",
              justifyContent: "center",
              borderBottom: "none",
            }}
            centered
            moreIcon={null} // Remove the dropdown icon
          >
            {menuItems.map((item) => (
              <TabPane
                tab={
                  <span
                    className={`text-gray-500 ${path === item.key ? "font-bold" : ""
                      }`}
                  >
                    {item.label}&nbsp;<span className={`justify-center box-border items-center text-center max-w-full cursor-default px-1 h-4 text-xs font-semibold rounded-[4px] text-white 
  ${getPath(item.key) > 0
                        ? path === item.key
                          ? "bg-red-600 border border-solid"
                          : "bg-gray-600 border border-solid"
                        : ""
                      } `}>{getPath(item.key) > 0 ? getPath(item.key) : ""}</span>
                  </span>
                }
                key={item.key}
              />
            ))}
          </Tabs>
        </div>

        <div className="flex items-center justify-between mt-4 px-2">
          <span className="text-lg font-normal">
            {menuItems.find((item) => item.key === path)?.label} Messages
          </span>
          <SearchOutlined
            style={{ outline: "none", padding: "3px 4px" }}
            className="text-xl cursor-pointer hover:bg-gray-200"
            onClick={() => setIsSearchVisible(!isSearchVisible)}
          />
        </div>

        {isSearchVisible && (
          <div className="mt-2 px-2">
            <Input
              placeholder="Search Mail"
              suffix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
              style={{ height: "40px", padding: "0 12px" }}
            />
          </div>
        )}
      </div>

      <div className={`hidden mt-4 md:mt-0 md:block`}>
        <ul className="space-y-2 lg:block md:block flex flex-col sm:space-y-0 sm:flex sm:flex-wrap">
          {menuItems.map((item, id) => (
            <li
              key={id}
              onClick={() => handleClick(item.key)}
              className={`p-4 cursor-pointer flex justify-between items-center border-b border-gray-200 ${path === item.key
                ? "bg-white font-bold shadow-[inset_0_-2px_0_0_rgb(231,231,231)]"
                : "hover:no-underline"
                }`}
            >
              <span
                className={`underline hover:no-underline  ${path === item.key ? "no-underline" : ""}`}
              >
                {`${item.label}`}
              </span>
              <span
                className={`inline-flex justify-center box-border items-center text-center max-w-full cursor-default px-1 h-4  text-xs font-semibold rounded-[4px] text-white 
  ${getPath(item.key) > 0
                    ? path === item.key
                      ? "bg-red-600 border border-solid"
                      : "bg-gray-600 border border-solid"
                    : ""
                  } `}
              >
                {getPath(item.key) > 0 ? getPath(item.key) : ""}
              </span>
            </li>

          ))}
        </ul>
      </div>

      <div
        onClick={() => setIsModalVisible(true)}
        className={`p-4 cursor-pointer hidden md:block  ${isModalVisible === true
          ? "bg-white font-bold shadow-[inset_0_-2px_0_0_rgb(231,231,231)]"
          : "underline underline-offset-3 border-b border-gray-200 hover:no-underline"
          }`}
      >
        Message Filter Options
      </div>


      <div className="mt-4 hidden md:block">
        <Input
          placeholder="Search Mail"
          suffix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
          style={{ height: "40px", padding: "0 12px" }}
        />
      </div>
    </div>
  );
};

export default Sidebar;
