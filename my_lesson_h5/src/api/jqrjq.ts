import {
  AxiosError,
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

export enum ApiCode {
  success = 1,
  validatedError = 1005,
  custom = 2000,
}

export class ApiDataError extends Error {
  resp: AxiosResponse<ApiResponse>;
  cause?: Error;
  constructor(resp: AxiosResponse<ApiResponse>, cause?: Error) {
    super(
      (({ code, data, msg }) => {
        if (code === ApiCode.validatedError) {
          const { validated_error } = data;
          if (Array.isArray(validated_error)) {
            msg += '：' + validated_error.join('\n');
          }
        }
        return msg;
      })(resp.data),
      cause && { cause },
    );
    this.resp = resp;
    this.cause = cause;
  }
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

apiAxios.interceptors.response.use(
  (resp: AxiosResponse<ApiResponse>) => {
    const { data } = resp;
    if (data.success && data.code === ApiCode.success) {
      return data.data;
    }
    return Promise.reject(new ApiDataError(resp));
  },
  (error) => {
    if (error instanceof AxiosError && error.response?.status === 400) {
      const data: ApiResponse = error.response.data;
      if (!data.success && data.code !== ApiCode.success) {
        return Promise.reject(new ApiDataError(error.response));
      }
    }
    return Promise.reject(error);
  },
);

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

export function register(email: string, username: string, password: string) {
  return apiAxios.post<undefined>('/api/mobile/eregister', {
    email,
    userName: username,
    password,
  });
}
