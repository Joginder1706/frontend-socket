import React, { useState, useEffect } from "react";
import MessageList from "../components/MessageList";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
function Sent({ success, setSuccess, loading, setSelectedUserList, socket, fetchDataById, isReceiverOnline, loggedInUser }) {

  if (loading) {
    return (<div style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingTop: "30px" }}>
      <FontAwesomeIcon icon={faSpinner} spin style={{ color: 'rgb(188, 0, 47)', fontSize: '25px' }} />
    </div>);
  }

  return <MessageList tab="Sent" success={success} setSuccess={setSuccess} setSelectedUserList={setSelectedUserList} socket={socket} fetchDataById={fetchDataById} isReceiverOnline={isReceiverOnline} loggedInUser={loggedInUser} />;
}

export default Sent;
