import { IApiResponse, INews, INewsQueryParams, IPagination, IUpdateNewsRequest } from '@/types';
import { axiosClient } from '@/utils';

export const newsApi = {
    getNews(params: INewsQueryParams): Promise<IApiResponse<IPagination<INews>>> {
        return axiosClient.get(`/news`, { params: params });
      },
    getNewsDetail(newsId: string): Promise<IApiResponse<INews>> {
      return axiosClient.get(`/news/${newsId}`);
    },
    updateNewsInfo(newsId: string, updateInfo: IUpdateNewsRequest): Promise<IApiResponse<INews>> {
      return axiosClient.put(`/news/${newsId}`, updateInfo);
    },
    deleteNews(newsId: string): Promise<IApiResponse<any>>{
      return axiosClient.delete(`/news/${newsId}`);
    }
};
