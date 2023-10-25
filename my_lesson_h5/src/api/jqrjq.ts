import {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  default as axios,
} from 'axios';

export interface ApiResponse<T = any> {
  code: number;
  data: T;
  msg: string;
  success: boolean;
}

export interface ApiAxios extends AxiosInstance {
  request<R = any, D = any>(config: AxiosRequestConfig<D>): Promise<R>;
  get<R = any, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>;
  delete<R = any, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>;
  head<R = any, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>;
  options<R = any, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>;
  post<R = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>;
  put<R = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>;
  patch<R = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>;
  postForm<R = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>;
  putForm<R = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>;
  patchForm<R = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>;
}

export const apiAxios: ApiAxios = axios.create({
  baseURL: 'https://api.jqrjq.cn/',
  headers: {
    token:
      'eyJhbGciOiJIUzUxMiJ9.eyJleHAiOjE3MDAyOTA1OTcsInN1YiI6ImFkbWluMTIzNCIsI' +
      'mlhdCI6MTY5NzY5ODU5NzY1N30.JMK3jD5VlxtS7bKGBPijuGEea6sYuOTWufgsWVT9QeD' +
      'ZPDGv_PjEwmiU-7KrXsT-mosmFJoWK2GIwgtVKxUHdQ',
  },
});

apiAxios.interceptors.response.use((resp: AxiosResponse<ApiResponse>) => {
  const { data } = resp;
  if (data.success && data.code === 1) {
    return data.data;
  }
  return Promise.reject([data.code, data.msg]);
});

export interface ArticleCat {
  id: number;
  catName: string;
  parentId: number;
  showInNav: boolean;
  sortOrder: number;
  createTime: string;
  updateTime: string;
  deleted: boolean;
}

export function getArticleCatAll() {
  return apiAxios.get<{
    articleCats: ArticleCat[];
  }>('/api/articleCat/all');
}

export function getArticleCat(id: number | string) {
  return apiAxios.get<{
    articleCat: ArticleCat;
  }>('/api/articleCat/one', {
    params: {
      id,
    },
  });
}
