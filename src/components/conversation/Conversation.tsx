import React, { useRef, useState } from "react";

import { ChatHeadsUser } from "@/types"
import "./conversation.css";
import {
  FaCommentAlt,
  FaComments,
  FaImage,
  FaInfoCircle,
  FaPhone,
  FaPlusCircle,
  FaStickyNote,
  FaThumbsUp,
  FaVideo,
} from "react-icons/fa";

export default function Conversation({receiver, user} : any) {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);

  const currentMessage = useRef(null);
  const chatBodyRef = useRef(null);

  // handle sending the messages
  
  // add and save message to realtime db
    
  // append message to existing conversation
    
  // create a new conversation

  return (
    <div>
      {receiver ? (
        <div>
          <div className="user-conversation-header">
            <div className="user-conv-header-container">
              <div className="user-profile-pic-container">
                <p className="user-profile-pic-text">{receiver.email[0]}</p>
              </div>
              <p>{receiver.email}</p>
            </div>

            <div className="user-conv-header-container">
              <FaPhone color="dodgerblue" size="2vh" />
              <FaVideo color="dodgerblue" size="2vh" />
              <FaInfoCircle color="dodgerblue" size="2vh" />
            </div>
          </div>

          {/* Conversation messages */}
          <div className="conversation-messages" ref={chatBodyRef}>
            {messages.length > 0 ? (
               /*  Xử lý khi có tin nhắn tại đây */
              <></>
            ) : (
              <div className="no-conversation">
                <div>
                  <FaComments />
                </div>
                <p>Bắt đầu cuộc hội thoại với {receiver.email}</p>
              </div>
            )}
          </div>

          {/* Input bar */}
          <div className="input-container">
            <FaPlusCircle />
            <FaImage />
            <FaStickyNote />
            <div className="input-message">
              <input placeholder="Hi.." ref={currentMessage}  />
            </div>
            <button>Send</button>
            <FaThumbsUp />
          </div>
        </div>
      ) : (
        <div className="no-conversation">
          <div>
            <FaCommentAlt />
          </div>
          <p>Hãy chọn một ai đó để bắt đầu cuộc trò chuyện.</p>
        </div>
      )}
    </div>
  );
}
