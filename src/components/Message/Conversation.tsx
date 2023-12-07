import React, { useEffect, useRef, useState } from "react";
import { ref, onValue, set, push, child, update } from "firebase/database";
import { useAuth } from "@/hooks";

import "./conversation.css";
import { IGroupChat, IGroupChatMessage } from "@/types"
import {
  FaCommentAlt,
  FaComments,
  FaImage,
  FaInfoCircle,
  FaPhone,
  FaPlusCircle,
  FaStickyNote,
  FaVideo,
  FaPaperPlane
} from "react-icons/fa";
import { realtimeDB } from "@/config";
import { Avatar, Input } from "@mantine/core";

interface ConversationProps {
  groupChat: IGroupChat;
}

export default function Conversation({ groupChat }: ConversationProps) {
  const [messages, setMessages] = useState<IGroupChatMessage[]>([]);
  const { userInfo } = useAuth();

  const [inputMessage, setInputMessage] = useState<string>("");

  // onValue(ref(realtimeDB, groupChat?.id), (snapshot) => {
  //   const data: IGroupChatMessage[] | undefined = snapshot.val();
  //   console.log(data);
  //   setMessages(data || []);
  // })

  useEffect(() => {
    let groupRef = ref(realtimeDB, groupChat.id);
    return onValue(groupRef, (snapshot) => {
      const data = snapshot.val();
      if (snapshot.exists()) {
        setMessages(data || [])
      }
      else setMessages([])
    })

  }, [groupChat.id])



  const currentMessage = useRef(null);
  const chatBodyRef = useRef(null);

  // handle sending the messages
  function sendMessage() {
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
    console.log('newMessage', updates);
    setInputMessage("");
    update(ref(realtimeDB, groupChat.id), updates);
  }

  // add and save message to realtime db

  // append message to existing conversation

  // create a new conversation

  return (
    <div>

      <div className="flex justify-between border-b border-solid border-gray-300">
        <div className="flex">
          <Avatar color="primary.5" radius="xl" >
            {groupChat.groupName.slice(0, 1)}
          </Avatar>

          <p className="text-black-90">{groupChat.groupName}</p>
        </div>

        <div className="flex items-center">
          <FaPhone color="dodgerblue" size="20px" />
          <FaVideo color="dodgerblue" size="20px" />
          <FaInfoCircle color="dodgerblue" size="20px" />
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
                style={{ textAlign: message.senderId === userInfo?.id ? "right" : "left" }}>
                <div style={{ display: "flex", marginTop: "0.5rem", transform: "translateX(2.5rem)", fontSize: "14px", color: "#8a8d91" }}>

                  <div className="message-senderName" >{message.senderName}</div>
                </div>
                <div style={{ display: "flex", marginTop: "0.5rem" }}>
                  <div className="user-profile-pic-container" style={{ marginTop: "0.3rem", marginRight: "0.7rem" }}>
                    <p className="user-profile-pic-text" style={{ color: "black" }}>{message.senderName.slice(0, 1)}</p>
                  </div>
                  <div className="message-bubble">{message.content}</div>
                </div>
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
        <Input
          value={inputMessage}
          placeholder="Nhập nội dung tin nhắn"
          radius='lg'
          onChange={(e) => setInputMessage(e.target.value)}
          w={'100%'}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          ref={currentMessage}
        />

        <button disabled={inputMessage.length === 0} onClick={sendMessage}><FaPaperPlane /></button>
      </div>
    </div>


  );
}
