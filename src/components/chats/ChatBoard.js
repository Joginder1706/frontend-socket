import React from "react";
import calculateActiveTime from "../../utils/calculateActiveTime";
const ChatBoard = ({ messages, userId, selectedUserId }) => {
  return (
    <div className="chat h-[720px] overflow-auto p-3 ">
      <div>
        {messages?.length > 0 && (
          <div className="mt-4">
            {messages.map((msg) => (
              <React.Fragment key={msg.id}>
                {
                  <div
                    className={`flex ${
                      msg.sender_id != userId ? "justify-start" : "justify-end"
                    } mb-4`}
                  >
                    <div
                      className={`p-3 rounded-lg ${
                        msg.sender_id != userId
                          ? "bg-gray-300 text-black"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      <div>{msg.message_text}</div>
                      <div className="text-gray-400 text-sm">
                        {/* {timeAgo(msg?.timestamp)} */}
                        {calculateActiveTime(msg?.timestamp)}
                      </div>
                    </div>
                  </div>
                }
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBoard;
