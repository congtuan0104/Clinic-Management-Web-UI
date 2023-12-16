import React, { useEffect, useState } from "react";

import GroupChatList from "@/components/Message/GroupChatList";
import Conversation from "@/components/Message/Conversation";

import { IGroupChat } from "@/types"
//import { db } from "../../firebase";

import "./chat-screen.css";
import { useAuth } from "@/hooks";
import { GroupChatType } from "@/enums";

import { Button, Text } from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";

// get user from redux


export default function ChatScreen() {
  const { userInfo } = useAuth();
  useDocumentTitle('Clinus - Nhắn tin');


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
      {
        id: "group_4",
        groupName: "Group 4",
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
    <div className="p-5 h-screen overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <Text size={'22px'} fw={700}>Tin nhắn</Text>

        <Button variant="filled">Tạo nhóm chat</Button>
      </div>
      <div className="bg-white p-4 rounded-xl flex border border-solid border-gray-300 h-[94%]">
        {/* Danh sách nhóm chat */}
        <div className="w-[25%] border-r border-0 border-solid border-gray-300 pr-3 bg-white max-h-full overflow-auto">
          <GroupChatList groups={groupChats} changeGroup={changeGroup} selectedGroup={selectedGroup} />
        </div>

        {/* Nội dung đoạn chat*/}
        <div className="flex-1 flex flex-col">
          {selectedGroup ? <Conversation groupChat={selectedGroup} /> :
            <div className="flex items-center justify-center h-full">
              <p className="text-2xl text-gray-400">Chọn một nhóm chat để bắt đầu trò chuyện</p>
            </div>
          }
        </div>
      </div>

    </div>
  );
}
