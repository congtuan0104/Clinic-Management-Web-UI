import React, { useEffect, useState } from "react";

import GroupChatList from "@/components/Message/GroupChatList";
import Conversation from "@/components/Message/Conversation";

import { IGroupChat } from "@/types";
// import { db } from "../../firebase";

import "./chat-screen.css";
import { useAuth } from "@/hooks";
import { GroupChatType } from "@/enums";

import { Button, Text, Modal, TextInput, Select, MultiSelect, Avatar, ModalRoot, ModalHeader, ModalCloseButton, ModalBody } from "@mantine/core";
import { useDocumentTitle, useDisclosure } from "@mantine/hooks";
import { chatApi } from "@/services";

export default function ChatScreen() {
  const { userInfo } = useAuth();
  useDocumentTitle("Clinus - Nhắn tin");

  const [groupChats, setGroupChats] = useState<IGroupChat[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<IGroupChat | undefined>(undefined);
  const [opened, { open, close }] = useDisclosure(false);

  const fetchGroupChatsByUser = async () => {
    const userId = userInfo?.id as string;
    try {
      const response = await chatApi.getGroupChatByUser(userId);
      if (response.data) {
        setGroupChats(response.data);
      } else {
        console.error("Lỗi không thể nhận được dữ liệu");
      }
    } catch (error) {
      console.log(error);
    }
  };
  


  useEffect(() => {
    fetchGroupChatsByUser();
  }, []);

  const changeGroup = (group: IGroupChat) => {
    setSelectedGroup(group);
  };

  return (
    <div className="p-5 h-screen overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <Text size={"22px"} fw={700}>
          Tin nhắn
        </Text>

        <Button variant="filled" onClick={open}>
          Tạo nhóm chat
        </Button>
      </div>
      <div className="bg-white p-4 rounded-xl flex border border-solid border-gray-300 h-[94%]">
        <div className="w-[25%] border-r border-0 border-solid border-gray-300 pr-3 bg-white max-h-full overflow-auto">
          <GroupChatList groups={groupChats} changeGroup={changeGroup} selectedGroup={selectedGroup} />
        </div>

        <div className="flex-1 flex flex-col">
          {selectedGroup ? (
            <Conversation groupChat={selectedGroup} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-2xl text-gray-400">Chọn một nhóm chat để bắt đầu trò chuyện</p>
            </div>
          )}
        </div>
      </div>



      <Modal.Root opened={opened} onClose={close} centered size={'lg'}>
        <Modal.Overlay />
        <Modal.Content>
          <ModalHeader>
            <Modal.Title fz={22} fw={700}>Tạo nhóm</Modal.Title>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <TextInput label="Tên nhóm" placeholder="Nhập vào tên nhóm" />

            <MultiSelect
              label="Thành viên"
              data={['Võ Hoài An', 'Phan Tài Nhật Minh', 'Nguyễn Nhật Khang', 'Phan Công Tuấn', 'Nguyễn Sơn Bão', 'Nguyễn Hải Nhật Minh']}
              searchable
              hidePickedOptions
              pt={10}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', }}>
              <Button mt="lg" radius="sm" size="md" type="submit">
                Xác nhận
              </Button>
              <Button mt="lg" ml="sm" radius="sm" size="md" variant='outline' color='red.5'
                onClick={() => {
                  close();
                }}>
                Hủy
              </Button>
            </div>

          </ModalBody>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
}