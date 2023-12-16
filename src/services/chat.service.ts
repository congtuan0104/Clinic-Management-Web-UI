import {
    IApiResponse,
    IGroupChat,
    IAddGroupChatRequest,
  } from '@/types';

  import { axiosClient } from '@/utils';


export const chatApi = {
    getGroupChatByUser(userId: string): Promise<IApiResponse<IGroupChat[]>> {
        return axiosClient.get('/chats',
          {
            params: {
              userId: userId
            }
          });
      },

    addGroupChat(data: IAddGroupChatRequest): Promise<any> {
      return axiosClient.post('/chats', data);
    }
};
