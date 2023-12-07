import React, { useEffect, useState } from "react";

import ChatHeads from "@/components/Message/ChatHeads";
import Conversation from "@/components/Message/Conversation";

import { IGroupChat } from "@/types"
//import { db } from "../../firebase";

import "./chat-screen.css";
import { useAuth } from "@/hooks";
import { GroupChatType } from "@/enums";

// get user from redux


export default function ChatScreen() {
  const { userInfo } = useAuth();

  const [groupChats, setGroupChats] = useState<IGroupChat[]>([]); // danh sách các nhóm chat của user hiện tại
  const [selectedGroup, setSelectedGroup] = useState<IGroupChat | undefined>(undefined);  // nhóm chat được chọn để hiển thị

  const fetchGroupChatsByUser = () => {
    const userId = userInfo?.id;
    // gọi api
    const fakeDataGroup: IGroupChat[] = [
      {
        id: "group_1",
        groupName: "Group 1",
        type: GroupChatType.PERSONAL,
      },
      {
        id: "group_2",
        groupName: "Group 2",
        type: GroupChatType.GROUP,
      },
      {
        id: "group_3",
        groupName: "Group 3",
        type: GroupChatType.PERSONAL,
      },
    ];

    setGroupChats(fakeDataGroup);
  }

  useEffect(() => {
    fetchGroupChatsByUser();
  }, []);

  const changeGroup = (group: IGroupChat) => {
    setSelectedGroup(group);
  }

  return (
    <div className="chat-screen">
      {/* ChatHeads */}
      <div className="half-screen chat-heads">
        <ChatHeads groups={groupChats} changeGroup={changeGroup} />
      </div>

      {/* Conversation */}
      <div className="half-screen">
        <Conversation groupChat={selectedGroup} />
      </div>
    </div>
  );
}
