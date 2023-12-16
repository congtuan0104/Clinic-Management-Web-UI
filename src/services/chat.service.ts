import {
    IApiResponse,
    IGroupChat
  } from '@/types';

  import { axiosClient } from '@/utils';


export const chatApi = {
    getAllGroupChat(): Promise<IApiResponse<IGroupChat[]>>{
        return axiosClient.get('/chats');
    }

};
