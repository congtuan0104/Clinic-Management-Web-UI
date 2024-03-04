import { IApiResponse, IGroupChat, IAddGroupChatRequest } from '@/types';

import { axiosClient } from '@/utils';

export const chatApi = {
  getGroupChatByUser(userId: string): Promise<IApiResponse<IGroupChat[]>> {
    return axiosClient.get('/chats', {
      params: {
        userId: userId,
      },
    });
  },

  addGroupChat(data: IAddGroupChatRequest): Promise<IApiResponse<IGroupChat>> {
    return axiosClient.post('/chats', data);
  },

  removeMember(groupId: string, userId: string): Promise<IApiResponse<IGroupChat>> {
    return axiosClient.delete(`/chats/${groupId}/user`, { data: { userList: [userId] } });
  },

  deleteGroupChat(groupId: string): Promise<IApiResponse<any>> {
    return axiosClient.delete(`/chats/${groupId}`);
  },
};
