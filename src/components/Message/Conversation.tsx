import React, { useEffect, useRef, useState } from "react";
import { ref, onValue, set, push, child, update } from "firebase/database";
import { useAuth } from "@/hooks";

import { IGroupChat, IGroupChatMessage } from "@/types"
import "./conversation.css";
import {
  FaCommentAlt,
  FaComments,
  FaImage,
  FaInfoCircle,
  FaPhone,
  FaPlusCircle,
  FaStickyNote,
  FaVideo,
} from "react-icons/fa";
import { realtimeDB } from "@/config";

interface ConversationProps {
  groupChat?: IGroupChat;
}

export default function Conversation({ groupChat }: ConversationProps) {
  const [messages, setMessages] = useState<IGroupChatMessage[]>([]);
  const { userInfo } = useAuth();

  const [inputMessage, setInputMessage] = useState<string>("");

  useEffect(() => {
    let groupRef = ref(realtimeDB, groupChat?.id);
    onValue(groupRef, (snapshot) => {
      const data: IGroupChatMessage[] | undefined = snapshot.val();
      console.log(data);
      setMessages(data || []);
    })

    return () => {
      // cleanup
    }
  }, [groupChat])



  const currentMessage = useRef(null);
  const chatBodyRef = useRef(null);

  // handle sending the messages
  function sendMessage() {
    if (!groupChat?.id) return;

    const newMessage = {
      messageId: new Date().toISOString(),
      senderId: "user_test",
      senderName: "User test",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    }

    // thêm newMessage vào firebase
    const newPostKey = messages.length;

    const updates: any = {};
    updates[newPostKey] = newMessage;
    setInputMessage("");
    update(ref(realtimeDB, groupChat.id), updates);

    // set(ref(realtimeDB, groupChat?.id), {
    //   messageId: new Date().toISOString(),
    //   senderId: "user_test",
    //   senderName: "User test",
    //   content: inputMessage,
    //   timestamp: new Date().toISOString(),
    // });

  }

  // add and save message to realtime db

  // append message to existing conversation

  // create a new conversation

  return (
    <div>
      {groupChat ? (
        <div>
          <div className="user-conversation-header">
            <div className="user-conv-header-container">
              <div className="user-profile-pic-container">
                <p className="user-profile-pic-text">{groupChat.groupName.slice(0, 1)}</p>
              </div>
              <p>{groupChat.groupName}</p>
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
              <>
                {messages.map((message, i) => (
                  <div
                  key={i}
                  className="message-container"
                  style={{ textAlign: message.senderId === userInfo?.id ? "right" : "left"}}>
                    <div className="message-senderName">{message.senderName}</div> 
                    <div className="message-bubble">{message.content}</div>
                  </div>
                ))}
              </>
            ) : (
              <div className="no-conversation">
                <div>
                  <FaComments />
                </div>
                <p>Bắt đầu cuộc hội thoại với {groupChat.groupName}</p>
              </div>
            )}
          </div>

          {/* Input bar */}
          <div className="input-container">
            <FaPlusCircle />
            <FaImage />
            <FaStickyNote />
            <div className="input-message">
              <input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Nhập nội dung tin nhắn"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                ref={currentMessage} />
            </div>
            <button onClick={sendMessage}>Gửi</button>
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
