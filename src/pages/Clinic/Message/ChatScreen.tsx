import React, { useEffect, useState } from "react";

import GroupChatList from "@/components/Message/GroupChatList";
import Conversation from "@/components/Message/Conversation";
import { TbMessagePlus } from "react-icons/tb";

import { IGroupChat } from "@/types";

import { useAuth } from "@/hooks";

import { Button, Text, Modal, TextInput, Select, MultiSelect, Avatar, ModalRoot, ModalHeader, ModalCloseButton, ModalBody, LoadingOverlay } from "@mantine/core";
import { useDocumentTitle, useDisclosure } from "@mantine/hooks";
import { chatApi } from "@/services";
import { ModalCreateGroupChat } from "@/components";
import { useSearchParams } from "react-router-dom";
import classNames from "classnames";
import { AuthModule } from "@/enums";
import { useQuery } from "react-query";

export default function ChatScreen() {
  const { userInfo } = useAuth();
  useDocumentTitle("Clinus - Nhắn tin");
  const [searchParams, setSearchParams] = useSearchParams();
  const groupId = searchParams.get("group");

  // const [groupChats, setGroupChats] = useState<IGroupChat[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<IGroupChat | undefined>(undefined);
  const [opened, { open, close }] = useDisclosure(false);

  const { data: groupChats, isLoading, refetch } = useQuery(
    ['groupChats', userInfo?.id],
    () => chatApi.getGroupChatByUser(userInfo!.id).then(res => res.data), {
    enabled: !!userInfo,
  });

  useEffect(() => {
    if (groupId && groupChats) {
      const group = groupChats.find((group) => group.id == groupId);
      if (group) {
        setSelectedGroup(group);
      }
    }
  }, [groupChats]);


  // const fetchGroupChatsByUser = async () => {
  //   try {
  //     if (!userInfo) return;
  //     const response = await chatApi.getGroupChatByUser(userInfo.id);
  //     if (response.data) {
  //       setGroupChats(response.data);
  //     } else {
  //       console.error("Lỗi không thể nhận được dữ liệu");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   fetchGroupChatsByUser();
  // }, []);

  const changeGroup = (group: IGroupChat) => {
    setSelectedGroup(group);
    setSearchParams({ group: group.id });
  };


  return (
    <>
      <div className={classNames(
        "mx-5 h-[calc(100vh-60px)] overflow-hidden",
        userInfo?.moduleId === AuthModule.Patient && 'max-w-screen-xl mx-auto mb-10 mt-3'
      )}>
        <div className="flex justify-between items-center mt-2 mb-3">
          <Text size={"22px"} fw={700}>
            Tin nhắn
          </Text>

          {
            userInfo?.moduleId !== AuthModule.Patient && (
              <Button color="secondary" variant="filled" onClick={open} leftSection={<TbMessagePlus size={20} />}>
                Tạo nhóm chat
              </Button>
            )
          }

        </div>
        <div className="relative bg-white p-4 rounded-xl flex border border-solid border-gray-300 h-[calc(100vh-116px)]">
          <LoadingOverlay visible={isLoading} loaderProps={{ size: 'xl' }} overlayProps={{ blur: 10 }} />
          <div className="w-[25%] border-r border-0 border-solid border-gray-300 pr-3 bg-white max-h-full overflow-auto">
            <GroupChatList groups={groupChats || []} changeGroup={changeGroup} selectedGroup={selectedGroup} />
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
      </div>

      <ModalCreateGroupChat
        isOpen={opened}
        onClose={close}
        onSuccess={refetch}
      />
    </>
  );
}