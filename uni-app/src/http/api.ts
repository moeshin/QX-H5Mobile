import { request as baseRequest } from './request';

export enum ApiCode {
  failed = 0,
  success = 1,
  noData = 2,
  validatedError = 1005,
  custom = 2000,
  tokenError = 2005,
}

export interface ApiResponse<T = any> {
  code: number;
  data: T;
  msg: string;
  success: boolean;
}

export class ApiDataError extends Error {
  resp: UniApp.RequestSuccessCallbackResult;
  data: ApiResponse;
  cause?: Error;
  constructor(resp: UniApp.RequestSuccessCallbackResult, cause?: Error) {
    super(
      (({ code, data, msg }) => {
        if (code === ApiCode.validatedError) {
          const { validated_error } = data;
          if (Array.isArray(validated_error)) {
            msg += '：' + validated_error.join('\n');
          }
        }
        return msg;
      })(resp.data as ApiResponse),
      cause && { cause },
    );
    this.resp = resp;
    this.data = resp.data as ApiResponse;
    this.cause = cause;
  }
}

export const request = async <T = any>(
  options: UniNamespace.RequestOptions,
): Promise<T> =>
  baseRequest(options).then((resp) => {
    const data = resp.data as ApiResponse<T>;
    if (data.success && data.code === ApiCode.success) {
      return data.data;
    }
    return Promise.reject(new ApiDataError(resp));
  });

export const get = async <T = any>(url: string, params?: object) =>
  request<T>({
    url,
    data: params,
  });

export const post = async <T = any>(
  url: string,
  data?: UniNamespace.RequestOptions['data'],
) =>
  request<T>({
    url,
    data,
    method: 'POST',
  });

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

export const getArrIgnoreNoData = <T, K extends keyof T, V = any>(
  promise: Promise<
    T & {
      [key in K]: V[];
    }
  >,
  key: K,
  apiCodes: number[] = [ApiCode.noData],
): Promise<T[K]> =>
  promise.then(
    (data) => data[key],
    (reason) => {
      if (
        reason instanceof ApiDataError &&
        apiCodes.includes(reason.data.code)
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
  get<{
    articleCats: ArticleCat[];
  }>('/api/articleCat/all');

export const getArticleCat = (id: number | string) =>
  get<{
    articleCat: ArticleCat;
  }>('/api/articleCat/one', {
    id,
  });

export const register = (email: string, username: string, password: string) =>
  post<undefined>('/api/mobile/eregister', {
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
  post<{
    userinfo: UserInfo;
  }>('/api/mobile/elogin', {
    email,
    password,
  });

export const getUserInfo = (id: number) =>
  get<{
    userinfo: UserInfo;
  }>('/api/userinfo/one', {
    id,
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
  get<{
    articles: Article[];
  }>('/api/article/' + id);

export const getArticlesByUserId = (id: number) =>
  get<{
    articles: Article[];
  }>('/api/article/getArticles/' + id);

export const getArticle = (id: number) =>
  get<{
    article: Article;
  }>('/api/article/one', {
    params: {
      id,
    },
  });

export const getArticles = () =>
  get<{
    articles: Article[];
  }>('/api/article/all');

export const getArticlePages = (
  current: number,
  size: number,
  colums?: string[],
) =>
  post<{
    pages: ResponsePages<Article>;
  }>('/api/article/page', {
    current,
    size,
    colums,
  });

export interface Memorabilia {
  id: number;
  userId: number;
  happenTime: string;
  createTime: string;
  updateTime: string;
  content: string;
}

export const getMemorabiliaAll = () =>
  get<{
    memorabilias: Memorabilia[];
  }>('/api/memorabilia/all');

export const getMemorabilia = (id: number) =>
  get<Memorabilia>(`/api/memorabilia/one/${id}`);

export interface MemorabiliaAddData {
  id?: number;
  userId: number;
  happenTime: string;
  createTime?: string;
  updateTime?: string;
  content: string;
}

export const addMemorabilia = (data: MemorabiliaAddData) =>
  post<undefined>('/api/memorabilia/add', data);
