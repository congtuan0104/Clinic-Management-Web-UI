import React, { useEffect, useRef, useState } from "react";
import { ref, onValue, set, push, child, update } from "firebase/database";
import { useAuth } from "@/hooks";
import { v4 as uuidv4 } from 'uuid';
import { Tooltip, Image, ThemeIcon } from "@mantine/core";
import dayjs from "dayjs";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";

import { PATHS } from '@/config';
import { useNavigate } from 'react-router-dom';
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
import { TiDownload } from "react-icons/ti";
import { firebaseStorage, realtimeDB } from "@/config";
import { Avatar, Button, Flex, Input } from "@mantine/core";
import classNames from "classnames";
import { MessageType } from "@/enums";
import { Fancybox } from "@/components";
import { notifications } from "@mantine/notifications";

interface ConversationProps {
  groupChat: IGroupChat;
}

export default function Conversation({ groupChat }: ConversationProps) {
  const [messages, setMessages] = useState<IGroupChatMessage[]>([]);
  const { userInfo } = useAuth();

  const [inputMessage, setInputMessage] = useState<string>("");
  // const [fileUpload, setFileUpload] = useState<File | null>(null);
  const navigate = useNavigate();

  console.log(groupChat.id)

  useEffect(() => {
    let groupRef = ref(realtimeDB, 'chats/' + groupChat.id);
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
  const saveMessageToFirebase = (content: string, type: MessageType, link?: string) => {
    const newMessage = {
      messageId: uuidv4(),
      senderId: userInfo?.id,
      senderName: userInfo?.firstName + " " + userInfo?.lastName,
      content: content,
      timestamp: new Date().toISOString(),
      type: type,
      link: link || '',
    }

    console.log(newMessage);

    // thêm newMessage vào firebase
    const newPostKey = messages.length;

    const updates: any = {};
    updates[newPostKey] = newMessage;
    setInputMessage("");
    update(ref(realtimeDB, 'chats/' + groupChat.id), updates);
  }

  const sendMessage = () => {
    if (inputMessage.length > 0) {
      saveMessageToFirebase(inputMessage, MessageType.Text);
    }
  }

  const createVideoCall = () => {
    const groupID = groupChat.id; 
    navigate(PATHS.VIDEO_CALL, { state: { groupID } });
  }

  const uploadFile = async (fileUpload: File) => {
    try {
      if (fileUpload === null) {
        notifications.show({
          message: 'Vui lòng chọn file để tải lên',
          color: 'red',
        });
        return;
      }

      // kiểm tra dung lượng file
      if (fileUpload.size > 20 * 1024 * 1024) {
        notifications.show({
          message: 'Dung lượng file tối đa có thể tải lên là 20MB',
          color: 'red',
        });
        return;
      }

      const fileName = fileUpload.name;
      const fileType = fileUpload.type.split("/")[0];

      const imageRef = storageRef(firebaseStorage, `chats/${groupChat.id}/${fileName}`);
      const snapshot = await uploadBytes(imageRef, fileUpload);
      const url = await getDownloadURL(snapshot.ref);

      saveMessageToFirebase(fileName, fileType === "application" ? MessageType.File : fileType as MessageType, url);
    }
    catch (error) {
      console.log(error);
    }
  };

  const renderMessageContent = (message: IGroupChatMessage) => {
    switch (message.type) {
      case MessageType.Image:
        return (
          <Fancybox className={classNames(
            "flex",
            message.senderId === userInfo?.id ? "justify-end" : "justify-start"
          )}>
            <Image
              data-fancybox="images"
              radius="md"
              h='auto'
              w="40%"
              fit="contain"
              loading="lazy"
              src={message.link}
              alt={message.content}
              className={classNames(
                "cursor-pointer rounded-lg border-solid border",
                message.senderId === userInfo?.id ? "border-primary-100" : "border-gray-100"
              )}
            />
          </Fancybox>
        );
      case MessageType.Video:

        return (
          <Fancybox className={classNames(
            "flex",
            message.senderId === userInfo?.id ? "justify-end" : "justify-start"
          )}>
            <video
              data-fancybox="videos"
              controls
              width="100%"
              src={message.link}
              className="rounded-2xl"
            />
          </Fancybox>
        );
      case MessageType.File:
        return <div className={classNames(
          "rounded-2xl px-2 py-1 max-w-[70%] hover:opacity-80 cursor-pointer",
          message.senderId === userInfo?.id ? "bg-blue-500 text-white" : "bg-gray-100"
        )}>

          <a className={
            classNames("flex items-center",
              message.senderId === userInfo?.id ? "text-white" : "text-black-70"
            )
          } href={message.link} target="_blank" rel="noreferrer">
            <TiDownload size={70} />
            <span className="line-clamp-2 break-all ml-2 leading-5">{message.content}</span>
          </a>
        </div>;
      default:
        return <div className={classNames(
          "rounded-2xl px-2 py-1",
          message.senderId === userInfo?.id ? "bg-blue-500 text-white" : "bg-gray-100"
        )}>
          {message.content}
        </div>;
    }
  }

  return (
    <>
      <div className="flex justify-between border-0 px-2 pb-2 border-b border-solid border-gray-300">
        <div className="flex items-center">
          <Avatar color="primary.5" radius="xl" >
            {groupChat.groupName.slice(0, 1)}
          </Avatar>

          <p className="text-black-90 ml-2">{groupChat.groupName}</p>
        </div>

        <Flex gap={15} align='center'>
          <FaPhone color="dodgerblue" size="20px" />
          <Button
           color="rgba(255, 255, 255, 1)"
           onClick={createVideoCall}>
            <FaVideo color="dodgerblue" size="20px" />
          </Button>
          <FaInfoCircle color="dodgerblue" size="20px" />
        </Flex>
      </div>

      {/* Conversation messages */}
      <div className="flex-1 overflow-auto" ref={chatBodyRef}>
        {messages.length > 0 ? (
          <>
            {messages.map((message) => (
              <div
                key={message.messageId}
                className={classNames(
                  "flex items-end mt-2 justify-start",
                  message.senderId === userInfo?.id ? "flex-row-reverse" : ""
                )}
              >
                <Avatar mx={8} color={message.senderId === userInfo?.id ? 'primary.5' : 'teal.7'} radius="xl" >
                  {message.senderName.slice(0, 1)}
                </Avatar>

                <Tooltip
                  color="secondary.3"
                  position={message.senderId === userInfo?.id ? "bottom-end" : "bottom-start"}
                  label={`Gửi lúc ${dayjs(message.timestamp).format('HH:mm DD/MM/YYYY')}`}>
                  <div className={classNames(
                    "flex flex-col",
                    message.senderId === userInfo?.id ? "items-end" : "items-start"
                  )}>
                    <div className="text-10 text-gray-500 mx-1" >{message.senderName}</div>
                    {renderMessageContent(message)}
                  </div>
                </Tooltip>
              </div>

            ))}
          </>
        ) : (
          <div className="flex flex-col justify-center items-center h-full">
            <div>
              <FaComments size={50} className="text-gray-400" />
            </div>
            <p className="text-gray-400 text-15 font-bold">Bắt đầu cuộc hội thoại với {groupChat.groupName}</p>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="flex pl-3 gap-2 mt-3 border-0 border-t border-gray-300 border-solid pt-3">
        {/* <FaPlusCircle />
        <FaImage />
        <FaStickyNote /> */}
        <label className="cursor-pointer flex items-center justify-center" htmlFor="upload-file-chat">
          <ThemeIcon size='xl' variant="light" radius='xl'>
            <FaImage size={25} />
          </ThemeIcon>
        </label>
        <input
          className="hidden"
          id="upload-file-chat"
          name="upload-file-chat"
          type="file"
          accept="image/*, video/*, .pdf, .doc, .docx, .xls, .xlsx"
          multiple
          onChange={(e) => {
            e.target.files && e.target.files.length > 0 && uploadFile(e.target.files[0]);
          }} />
        <Input
          value={inputMessage}
          placeholder="Nhập nội dung tin nhắn"
          radius='xl'
          size="md"
          onChange={(e) => setInputMessage(e.target.value)}
          w={'100%'}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          ref={currentMessage}
        />

        <Button
          radius='xl'
          size="md"
          disabled={inputMessage.length === 0}
          onClick={sendMessage}>
          <FaPaperPlane />
        </Button>
      </div>
    </>


  );
}
