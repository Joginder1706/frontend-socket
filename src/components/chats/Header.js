import React, { useState, useEffect } from "react";
import {
  LeftOutlined,
  RightOutlined,
  VideoCameraOutlined,
  EllipsisOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import pic from "../../images/photo.jfif";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import RightSubRight from "../RightSubRight";
import { useLocation } from "react-router-dom";
import ReportProfileModal from "../Report";
import BlockUser from "../BlockUser";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import getCookie from "../../utils/getCookie";
const Header = ({
  updateWidth,
  width,
  selectedUserData,
  isReceiverOnline,
  checkRightSection,
  setCheckRightSection,
  setSelectedUserId,
  userData,
  selectedUserId,
  loggedInUser,
  setRestoreMessage
}) => {

  const API_URL = "https://fansmaps-node-ygset.ondigitalocean.app/api"
  // const API_URL = "http://localhost:5000/api";

  const location = useLocation();
  const logourl = "https://www.fansmaps.com/pictures/logo/";
  const path = location.pathname.split("/")[1];
  const isMobile = useMediaQuery({ query: "(max-width: 639px)" });
  const [isVisible, setIsVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [blockVisible, setblockVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toggleOptions = () => {
    setIsVisible(!isVisible);
  };

  // Handle increment
  const handleIncrement = () => {
    const currentIndex = userData.findIndex((obj) => obj.id === parseInt(selectedUserId));
    if (currentIndex < userData.length - 1) {
      setSelectedUserId(userData[currentIndex + 1].id);
      navigate(`/${path}/${userData[currentIndex + 1].id}`)
    }
  };

  // Handle decrement
  const handleDecrement = () => {
    const currentIndex = userData.findIndex((obj) => obj.id === parseInt(selectedUserId));
    if (currentIndex > 0) {
      setSelectedUserId(userData[currentIndex - 1].id);
      navigate(`/${path}/${userData[currentIndex - 1].id}`)
    }
  };

  const handleArchive = async () => {
    let { id } = getCookie("loggedin");
    if (!id || !selectedUserId) return;
    let currPath = "";
    if (path === "sent") {
      currPath = loggedInUser?.archived_users?.includes(selectedUserId) ? "archive" : "inbox";
    } else {
      currPath = path;
    }

    if (currPath === "inbox" || currPath === "archive" || currPath === "filtered") {
      setLoading(true)
      try {
        const response = await fetch(`${API_URL}/archive/${id}-${currPath}`, {
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
        navigate("/inbox")
      } catch (error) {
        console.error('Error saving filters:', error);
      } finally {
        setIsVisible(false)
        setLoading(false)
      }
    }
    setIsVisible(false)
  }
  const handleDeleteChats = async () => {
    let { id } = getCookie("loggedin");
    if (!id || !selectedUserId) return;
    let time = "";
    if (loggedInUser?.deleted_users?.length > 0) {
      let findDetail = loggedInUser.deleted_users.find(item => item.id == selectedUserId);
      if (findDetail) {
        time = findDetail.timestamp;
      }
    }

    setLoading(true)
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
      setRestoreMessage((prev) => (
        {
          ...prev,
          status: true,
          id: selectedUserId,
          path: path,
          timestamp: time
        }
      ))
      navigate("/inbox")
    } catch (error) {
      console.error('Error saving filters:', error);
    } finally {
      setIsVisible(false)
      setLoading(false)
    }
  }

  return (
    <>
      <div
        style={{ backgroundColor: isMobile ? "#333333" : "#ffffff" }}
        className="flex justify-between p-3 "
      >
        <ReportProfileModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          selectedUserData={selectedUserData}
        />
        <BlockUser
          visible={blockVisible}
          onClose={() => setblockVisible(false)}
          selectedUserId={selectedUserId}
          loggedInUser={loggedInUser}
        />
        <div className="flex items-center gap-0">
          {isMobile && (
            <div onClick={() => navigate(`/${path}`)}>
              <ArrowLeftOutlined
                style={{
                  fontSize: "20px",
                  color: "#ffffff",
                  padding: "3px",
                }}
              />
            </div>
          )}
          {isReceiverOnline?.includes(selectedUserId) ? (
            <span className="m-1 p-1 rounded-full bg-green-400"></span>
          ) : (
            <span className="m-1 p-1 rounded-full bg-[#333333] md:bg-white"></span>
          )}
          <img
            // onClick={() => navigate("/member/1")}
            src={
              selectedUserData?.logo
                ? `${logourl}${selectedUserData.logo.slice(0, 2)}/${selectedUserData.logo
                }`
                : pic
            }
            alt="logo"
            className="w-12 h-14 rounded-md mr-4 cursor-pointer"
          />
          <div className="text-[#ffffff] sm:text-black space-y-1">
            <div>{selectedUserData?.place_name}</div>
            <div>
              {selectedUserData?.city_name && (
                <>
                  {selectedUserData.city_name}
                  {selectedUserData?.state_name || selectedUserData?.country_name ? ', ' : ''}
                </>
              )}
              {selectedUserData?.state_name && (
                <>
                  {selectedUserData.state_name}
                  {selectedUserData?.country_name ? ', ' : ''}
                </>
              )}
              {selectedUserData?.country_name && selectedUserData.country_name}
            </div>
          </div>
        </div>
        {!isMobile ? (
          <div className="pl-4">
            <div className="flex gap-1">
              <div className="border-2  border-gray-400 bg-slate-100 cursor-pointer">
                <LeftOutlined
                  onClick={() => handleDecrement()}
                  style={{
                    fontSize: "20px",
                    color: "gray",
                    padding: "3px",
                    borderRight: "2px solid gray",
                  }}
                />
                <RightOutlined
                  onClick={() => handleIncrement()}
                  style={{ fontSize: "20px", color: "gray", padding: "3px" }}
                />
              </div>
              <div className="relative">
                <div
                  className="border-2   border-gray-400 bg-slate-100 cursor-pointer"
                  onClick={toggleOptions}
                >
                  <EllipsisOutlined
                    style={{
                      fontSize: "20px",
                      color: "gray",
                      padding: "3px",
                    }}
                  />
                </div>
                {isVisible && (
                  <div
                    style={{ width: "170px" }}
                    className="absolute mt-2 right-2 bg-white shadow-lg shadow-white-500/50"
                  >
                    <ul>
                      <li onClick={() => handleArchive()} className="p-3 hover:bg-gray-200 cursor-pointer text-sm border-b hover:text-red-600">
                        {path === "archive" ? "Move to Inbox" : (path === "sent" && loggedInUser?.archived_users?.includes(selectedUserId)) ? "Move to Inbox" : path === "filtered" ? "Move to Inbox" : "Archive Conversation"}
                      </li>
                      <li onClick={handleDeleteChats} className="p-3 hover:bg-gray-200 cursor-pointer text-sm border-b hover:text-red-600">
                        Delete Conversation
                      </li>
                      <li onClick={() => {
                        setIsModalVisible(true)
                        setIsVisible(false)
                      }} className="p-3 hover:bg-gray-200 cursor-pointer text-sm border-b hover:text-red-600">
                        Report User
                      </li>
                      <li onClick={() => {
                        setblockVisible(true)
                        setIsVisible(false)
                      }} className="p-3 hover:bg-gray-200 cursor-pointer text-sm hover:text-red-600">
                        Block User
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="border-2   border-gray-400 bg-slate-100 cursor-pointer">
                {width === 65 ? (
                  <FullscreenOutlined
                    onClick={() => updateWidth(100)}
                    style={{
                      fontSize: "20px",
                      color: "gray",
                      padding: "3px",
                    }}
                  />
                ) : (
                  <FullscreenExitOutlined
                    onClick={() => updateWidth(65)}
                    style={{
                      fontSize: "20px",
                      color: "gray",
                      padding: "3px",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div onClick={() => toggleOptions()}>
              <EllipsisOutlined
                style={{
                  fontSize: "20px",
                  color: "#ffffff",
                  padding: "3px",
                }}
              />
              {isVisible && (
                <div
                  style={{ width: "170px" }}
                  className="absolute mt-2 right-2 bg-white shadow-lg shadow-white-500/50"
                >
                  <ul onClick={() => setIsVisible(!isVisible)}>
                    <li onClick={() => handleArchive()} className="p-3 hover:bg-gray-200 cursor-pointer text-sm border-b">
                      {path === "archive" ? "Move to Inbox" : (path === "sent" && loggedInUser?.archived_users?.includes(selectedUserId)) ? "Move to Inbox" : path === "filtered" ? "Move to Inbox" : "Archive Conversation"}
                    </li>
                    <li onClick={handleDeleteChats} className="p-3 hover:bg-gray-200 cursor-pointer text-sm border-b">
                      Delete Conversation
                    </li>
                    <li onClick={() => {
                      setIsModalVisible(true)
                      setIsVisible(false)
                    }} className="p-3 hover:bg-gray-200 cursor-pointer text-sm border-b">
                      Report User
                    </li>
                    <li onClick={() => {
                      setblockVisible(true)
                      setIsVisible(false)
                    }} className="p-3 hover:bg-gray-200 cursor-pointer text-sm">
                      Block User
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="block sm:hidden text-center bg-gray-200 pt-1 pb-1 border-b ">
        <span
          onClick={() => setCheckRightSection(!checkRightSection)}
          className="text-gray-400 text-[13px] underline cursor-pointer "
        >
          {!checkRightSection ? "QuickProfileView" : "Close QuickProfileView"}
        </span>
      </div>
      {checkRightSection && (
        <div className="block sm:hidden h-[61vh] overflow-auto">
          <RightSubRight
            width={"50"}
            selectedUserData={selectedUserData}
            checkRightSection={checkRightSection}
          />
        </div>
      )}

      {loading && <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <FontAwesomeIcon icon={faSpinner} spin style={{ color: 'rgb(188, 0, 47)', fontSize: '25px' }} />
      </div>}
    </>
  );
};

export default Header;
