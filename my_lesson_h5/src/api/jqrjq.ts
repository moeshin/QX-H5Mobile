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
  failed = 0,
  success = 1,
  noData = 2,
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

export interface ResponsePages<T = any> {
  records: T[];
  total: number;
  size: number;
  current: number;
  orders: unknown[];
  optimizeCountSql: boolean;
  searchCount: boolean;
  pages: number;
}

export const wrapPages = <T = any>(records: T[]): ResponsePages<T> => ({
  records,
  total: records.length,
  size: records.length,
  current: 1,
  orders: [],
  optimizeCountSql: true,
  searchCount: true,
  pages: 1,
});

export const isLatestPages = <T = any>(pages: ResponsePages<T>) => {
  if (pages.searchCount) {
    return pages.current >= pages.pages;
  }
  return pages.size > pages.records.length;
};

// export type ItemOf<A> = A extends (infer I)[] ? I : never;
//
// export const getArrIgnoreNoData = <
//   T,
//   K extends keyof T,
//   I extends ItemOf<T[K]>,
// >(
//   promise: Promise<
//     T & {
//       [key in K]: I[];
//     }
//   >,
//   key: K,
// ): Promise<I[]> =>
//   promise.then(
//     (data) => data[key],
//     (reason) => {
//       if (
//         reason instanceof ApiDataError &&
//         reason.resp.data.code === ApiCode.noData
//       ) {
//         return [] as I[];
//       }
//       return Promise.reject(reason);
//     },
//   );

export const getArrIgnoreNoData = <T, K extends keyof T, V = any>(
  promise: Promise<
    T & {
      [key in K]: V[];
    }
  >,
  key: K,
): Promise<T[K]> =>
  promise.then(
    (data) => data[key],
    (reason) => {
      if (
        reason instanceof ApiDataError &&
        reason.resp.data.code === ApiCode.noData
      ) {
        return [] as T[K];
      }
      return Promise.reject(reason);
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

export const getArticleCatAll = () =>
  apiAxios.get<{
    articleCats: ArticleCat[];
  }>('/api/articleCat/all');

export const getArticleCat = (id: number | string) =>
  apiAxios.get<{
    articleCat: ArticleCat;
  }>('/api/articleCat/one', {
    params: {
      id,
    },
  });

export const register = (email: string, username: string, password: string) =>
  apiAxios.post<undefined>('/api/mobile/eregister', {
    email,
    userName: username,
    password,
  });

export interface UserInfo {
  state: number;
  id: number;
  userName: string;
  userType: string;
  token: string;
  binding: number;
  createTime: string;
  updateTime: string;
  email: string;
}

export const login = (email: string, password: string) =>
  apiAxios.post<{
    userinfo: UserInfo;
  }>('/api/mobile/elogin', {
    email,
    password,
  });

export const getUserInfo = (id: number) =>
  apiAxios.get<{
    userinfo: UserInfo;
  }>('/api/userinfo/one', {
    params: {
      id,
    },
  });

export interface Article {
  id: number;
  articleCatId: number;
  title: string;
  content: string;
  updateTime: string;
  createTime: string;
  open: number;
  deleted: number;
  userinfoId: number;
}

export const getArticlesByCatId = (id: number) =>
  apiAxios.get<{
    articles: Article[];
  }>('/api/article/' + id);

export const getArticle = (id: number) =>
  apiAxios.get<{
    article: Article;
  }>('/api/article/one', {
    params: {
      id,
    },
  });

export const getArticles = () =>
  apiAxios.get<{
    articles: Article[];
  }>('/api/article/all');

export const getArticlePages = (
  current: number,
  size: number,
  colums?: string[],
) =>
  apiAxios.post<{
    pages: ResponsePages<Article>;
  }>('/api/article/page', {
    current,
    size,
    colums,
  });
