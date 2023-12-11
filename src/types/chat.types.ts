import { GroupChatType, MessageType } from '@/enums';

/**
 * Thông tin nhóm chat
 */
export interface IGroupChat {
  id: string;
  groupName: string;
  maxMember?: number;
  type: GroupChatType;
  member?: IGroupChatMember[];
}

/**
 * Thành viên trong nhóm chat
 */
export interface IGroupChatMember {
  id: string;
  userId: string;
  groupId: string;
  groupAdmin: boolean;
  joinAt: Date;
}

/**
 * Nội dung tin nhắn trong nhóm chat
 */
export interface IGroupChatMessage {
  content: string; // url
  messageId: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  type: MessageType;
}
