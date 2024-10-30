import React, { useState, useEffect, useRef, useCallback } from "react";
import MessageItem from "./MessageItem";
import InboxFilterModal from "./InboxFilterModal";
import { FilterFilled } from "@ant-design/icons";
import { Checkbox } from "antd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import { MdDiamond } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import getCookie from "../utils/getCookie";
function MessageList({ tab, success, setSuccess, setSelectedUserList, socket, fetchDataById, isReceiverOnline, loggedInUser }) {

  const logourl = "https://www.fansmaps.com/pictures/logo/";

  // const API_URL = "https://backend-socket-7gmk.onrender.com/api";
  const API_URL = "http://localhost:5000/api";

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false)
  const [isRead, setIsRead] = useState(false)
  const [isReadData, setIsReadData] = useState([])
  const [getPaid, setGetPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const previousIdRef = useRef(0);
  const location = useLocation();
  const path = location.pathname.split("/");
  const { id: loggedId } = getCookie("loggedin");
  const resetState = () => {
    setPage(1);
    setUserList([]);
    setHasMore(true);
  };

  useEffect(() => {
    setSelectedUserList(userList)
  }, [userList])

  const fetchData = async () => {
    let { id } = getCookie("loggedin");
    if (!id) return;
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/${path[1]}?userid=${id}&page=${page}&limit=20`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response?.data?.length > 0) {
        let updateArray = response.data.sort((a, b) => b.is_read - a.is_read);
        let newArray = updateArray.sort((a, b) => b.is_pinned - a.is_pinned);
        setUserList((prevMessages) => {
          const combinedMessages = [...prevMessages, ...newArray];

          const uniqueMessages = Array.from(
            new Map(combinedMessages.map(item => [item.id, item])).values()
          );

          return uniqueMessages;
        });

        if (path === "archive") {
          // Add logic for archive path if needed
        }
      } else {
        setHasMore(false);
      }
      
    } catch (error) {
      console.error("Error fetching messages:", error);
      setUserList([]);
    } finally {
      setLoading(false);
    }
  };

  const lastMessageRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          if (userList?.length >= page * 4) {
            setPage((prevPage) => prevPage + 1);
            fetchData();
          }
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, page, userList?.length]
  );


  useEffect(() => {
    setSuccessMessage(success)
  }, [success])

  useEffect(() => {
    setSuccess(successMessage)
  }, [successMessage])

  useEffect(() => {
    let { id } = getCookie("loggedin");
    if (id && socket) {
      socket.emit("removeSelectedUser", id);
    }
    resetState();
    fetchData();

  }, [path[1], path?.length])

  useEffect(() => {
    let prevId = localStorage.getItem('previousId');

    if (!loggedInUser || !fetchDataById || fetchDataById.id == prevId) return;

    let isArchive = false;
    if (loggedInUser.archived_users) {
      isArchive = loggedInUser.archived_users.includes(fetchDataById.user_detail.id.toString());
    }

    let updateList = {
      id: fetchDataById.user_detail.id,
      message: fetchDataById,
      logo: fetchDataById.user_detail.logo,
      place_name: fetchDataById.user_detail.place_name,
      place_city_name: fetchDataById.user_detail.city_name,
      place_state_name: fetchDataById.user_detail.state_name,
      place_country_name: fetchDataById.user_detail.country_name,
      last_message_text: fetchDataById.message_text,
    }
    let isPresent = userList?.some((item) => item.id == updateList.id);

    if (fetchDataById.is_restricted == 1) {
      if (path[1] == 'filtered') {
        if (userList?.length > 0 && isPresent) {
          let data = userList.map((item) => {
            if (item.id == updateList.id) {
              return updateList;
            }
            return item
          })
          setUserList(data)
        }
        if (userList?.length > 0 && !isPresent) {
          let data = [...userList];
          data.unshift(updateList);
          setUserList(data)
        }
        if (userList?.length == 0) {
          let data = []
          data.push(updateList)
          setUserList(data)
        }
      }
    }
    else if (isArchive) {
      if (path[1] == 'archive') {
        if (userList?.length > 0 && isPresent) {
          let data = userList.map((item) => {
            if (item.id == updateList.id) {
              return updateList;
            }
            return item
          })
          setUserList(data)
        }
        if (userList?.length > 0 && !isPresent) {
          let data = [...userList];
          data.unshift(updateList);
          setUserList(data)
        }
        if (userList?.length == 0) {
          let data = []
          data.push(updateList)
          setUserList(data)
        }
      }
    }
    else {
      if (path[1] == 'inbox') {
        if (userList?.length > 0 && isPresent) {
          let data = userList.map((item) => {
            if (item.id == updateList.id) {
              return updateList;
            }
            return item
          })
          setUserList(data)
        }
        if (userList?.length > 0 && !isPresent) {
          let data = [...userList];
          data.unshift(updateList);
          setUserList(data)
        }
        if (userList?.length == 0) {
          let data = []
          data.push(updateList)
          setUserList(data)
        }
      }
    }
    localStorage.setItem('previousId', fetchDataById.id);

  }, [fetchDataById, loggedInUser])



  const checkSession = () => {
    const hideBannerUntil = localStorage.getItem('hideBannerUntil');

    if (hideBannerUntil) {
      const now = new Date().getTime();
      if (now < hideBannerUntil) {
        setGetPaid(true);
      }
    }
  };

  const hideBanner = () => {
    const oneDayInMilliseconds = 6 * 60 * 60 * 1000;
    const expirationTime = new Date().getTime() + oneDayInMilliseconds;

    localStorage.setItem('hideBannerUntil', expirationTime);  // Store timestamp for 1 day
    setGetPaid(true);
  }

  useEffect(() => {
    checkSession();
  }, []);

  const handleChange = (e) => {
    setIsRead(e.target.checked)
    if (e.target.checked && userList?.length > 0) {
      let filtered = userList.filter(item => item?.message.is_read == 1 && item?.message.receiver_id == loggedId);
      setIsReadData(filtered);
    }
  };
  const deleteUser = (id, messageId) => {
    if (id === "unread") {
      let updateList = userList?.map((item) => {
        if (item?.message.id == messageId) {
          return {
            ...item,
            message: {
              ...item.message,
              is_read: 1
            }
          };
        } else {
          return item;
        }
      })
      // console.log(updateList)
      setUserList(updateList);
    }
    // else {
    //   let list = userList?.filter((item) => item.id != id)
    //   setUserList(list)
    // }
  }

  if (loading && parseInt(page) === 1) {
    return (<div style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingTop: "30px" }}>
      <FontAwesomeIcon icon={faSpinner} spin style={{ color: 'rgb(188, 0, 47)', fontSize: '25px' }} />
    </div>);
  }
  // console.log(userList)

  return (
    <div className="message-list flex-1 p-1 md:p-4 items-center">
      <div className="block sm:hidden"><InboxFilterModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        setSuccessMessage={setSuccessMessage}
      /></div>


      {successMessage && <div
        style={{ backgroundColor: "#DFF0D8" }}
        className="flex justify-between items-center mb-2 p-4 pt-2 pb-2 text-md border-2 border-green-500"
      >
        <div className="flex items-center gap-1">
          <p className="text-green-500 text-[.800rem] sm:text-[.850rem]">
            Success! You just saved your filters for all newly received messages.
          </p>
        </div>
        <span onClick={() => setSuccessMessage(false)} className="ml-4 text-green-500 cursor-pointer">X</span>
      </div>}


      <div className="flex justify-between items-center mb-4">
        <div className=" text-lg hidden sm:block">{tab} Messages</div>
        <div className="flex items-center gap-3 text-gray-500">
          <Checkbox
            style={{ fontSize: "16px", color: "gray", fontWeight: 400 }}
            onChange={handleChange}
          >
            Show Unread Only
          </Checkbox>
          <div
            onClick={() => setIsModalVisible(true)}
            className="flex items-center cursor-pointer sm:hidden"
          >
            <FilterFilled
              style={{
                fontSize: "15px",
                color: "gray",
              }}
            />
            <button className="ml-[7px] text-[16px]">Filters</button>
          </div>

        </div>
      </div>
      {!getPaid && <div
        style={{ backgroundColor: "#E8E8E8" }}
        className="flex justify-between items-center p-4 pt-6 pb-6 text-md"
      >
        <div className="flex items-center gap-1">
          <div className="text-[50px] sm:text-[40px]">
            <MdDiamond color="#fff" />
          </div>
          <p className="text-black text-[.800rem] sm:text-[1rem]">
            Paid members get 30x more responses on average. {" "}
            <span
              onClick={() =>
              (window.location.href =
                "https://www.fansmaps.com/user/select-plan")
              }
              className="text-red-700 cursor-pointer underline"
            >
              Learn more
            </span>
          </p>
        </div>
        <span onClick={() => hideBanner()} className="ml-4 text-gray-500 cursor-pointer">X</span>
      </div>}

      {
        !isRead ? (
          <>
            {userList?.length > 0 ? (
              userList.map((msg, index) => {
                if (userList.length === index + 1) {
                  // Last message ref for infinite scrolling
                  return (
                    <div ref={lastMessageRef} key={msg.id}>
                      <MessageItem data={userList} index={index} deleteUser={deleteUser} loading={loading} message={msg} tab={tab.charAt(0).toLowerCase() + tab.slice(1)} isReceiverOnline={isReceiverOnline} loggedInUser={loggedInUser} />
                    </div>
                  );
                } else {
                  return <MessageItem data={userList} index={index} deleteUser={deleteUser} loading={loading} key={msg.id} message={msg} tab={tab.charAt(0).toLowerCase() + tab.slice(1)} isReceiverOnline={isReceiverOnline} loggedInUser={loggedInUser} />;
                }
              }
              )
            ) : (
              <div className="flex justify-center items-center text-red-600 bg-white h-20 shadow-lg shadow-white-500/50">No result found !</div>
            )}
          </>
        ) : (
          <>
            {isReadData?.length > 0 ? (
              isReadData.map((msg, index) => {
                if (isReadData.length === index + 1) {
                  // Last message ref for infinite scrolling
                  return (
                    <div ref={lastMessageRef} key={msg.id}>
                      <MessageItem data={isReadData} index={index} deleteUser={deleteUser} loading={loading} message={msg} tab={tab.charAt(0).toLowerCase() + tab.slice(1)} isReceiverOnline={isReceiverOnline} loggedInUser={loggedInUser} />
                    </div>
                  );
                } else {
                  return <MessageItem data={isReadData} index={index} deleteUser={deleteUser} loading={loading} key={msg.id} message={msg} tab={tab.charAt(0).toLowerCase() + tab.slice(1)} isReceiverOnline={isReceiverOnline} loggedInUser={loggedInUser} />;
                }
              }
              )
            ) : (
              <div className="flex justify-center items-center text-red-600 bg-white h-20 shadow-lg shadow-white-500/50">No result found !</div>
            )}

          </>
        )
      }
    </div>
  );
}

export default MessageList;
