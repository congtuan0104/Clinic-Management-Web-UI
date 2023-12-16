import { GroupChatType, MessageType } from '@/enums';

/**
 * Thông tin nhóm chat
 */
export interface IGroupChat {
  id: string;
  groupName: string;
  maxMember?: number;
  type: GroupChatType;
  isActive: boolean;
  groupChatMember?: IGroupChatMember[];
}

/**
 * Thành viên trong nhóm chat
 */
export interface IGroupChatMember {
  id: string;
  userId: string;
  isAdmin: boolean;
  joinAt: Date;
  email: string;
  firstname: string;
  lastname: string;
}

/**
 * Nội dung tin nhắn trong nhóm chat
 */
export interface IGroupChatMessage {
  content: string;
  messageId: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  type: MessageType;
  link: string;
}

export interface IAddGroupChatRequest {
  groupName: string;
  maxMember?: number;
  type?: GroupChatType;
  userList: string[];
}
