import React, { useState } from "react";

import ChatHeads from "@/components/chatheads/ChatHeads";
import Conversation from "@/components/conversation/Conversation";

import { ChatHeadsUser } from "@/types"
//import { db } from "../../firebase";

import "./chat-screen.css";

// get user from redux

const arr = Array.from({ length: 5 }, () => ({ uid: "abcd", email: "Công Tuấn Phan" }));


export default function ChatScreen() {
  const [user, setUser] = useState("nhatminhpro2001@gmail.com");

  const [chatHeads, setChatHeads] = useState<ChatHeadsUser[]>([]);
  const [receiver, setReceiver] = useState(null);

  React.useEffect(() => {
    

    // if no user -> redirect
    if (user) setUser(user);
    
    
  }, [setUser, setReceiver]);

  React.useEffect(() => {
    if (!user) return;

    (async () => {
      
      setChatHeads(arr);
    })();
  }, [user]);

  return (
    <div className="chat-screen">
      {/* ChatHeads */}
      <div className="half-screen chat-heads">
        <ChatHeads items={chatHeads} setReceiver={setReceiver} />
      </div>

      {/* Conversation */}
      <div className="half-screen">
        <Conversation receiver={receiver} user={user} />
      </div>
    </div>
  );
}
