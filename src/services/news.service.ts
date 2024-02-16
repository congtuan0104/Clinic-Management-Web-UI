import { IApiResponse, INews, INewsQueryParams, IPagination } from '@/types';
import { axiosClient } from '@/utils';

export const newsApi = {
    getNews(params: INewsQueryParams): Promise<IApiResponse<IPagination<INews>>> {
        return axiosClient.get(`/news`, { params: params });
      },
    getNewsDetail(newsId: string): Promise<IApiResponse<INews>> {
      return axiosClient.get(`/news/${newsId}`);
    },
};
