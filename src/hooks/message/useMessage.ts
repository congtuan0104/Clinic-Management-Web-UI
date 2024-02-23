import { GroupChatType } from '@/enums';
import { IGroupChat } from '@/types';
import { useAppSelector } from '..';
import { userInfoSelector } from '@/store';

export const useMessage = () => {
  const userInfo = useAppSelector(userInfoSelector);

  const groupChatName = (group: IGroupChat) => {
    // nếu là nhóm chat thì hiển thị tên nhóm lưu trong db,
    // nếu là chat 1-1 thì hiển thị tên của thành viên còn lại trong nhóm chat
    if (group.type === GroupChatType.GROUP) {
      return group.groupName;
    }
    const member = group.groupChatMember?.find(member => member.userId !== userInfo?.id);
    return `${member?.firstName} ${member?.lastName}`;
  };

  const logoSrc = (group: IGroupChat) => {
    if (group.type === GroupChatType.GROUP) {
      return undefined;
    }
    const member = group.groupChatMember?.find(member => member.userId !== userInfo?.id);
    return member?.avatar;
  };

  return {
    groupChatName,
    logoSrc,
  };
};
