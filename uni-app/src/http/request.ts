import { useUserStore } from '@/store/user';

export const config = {
  baseURL: 'https://api.jqrjq.cn',
  timeout: 6000,
};

export async function request(
  options: UniNamespace.RequestOptions,
): Promise<UniNamespace.RequestSuccessCallbackResult> {
  const { method, url, data, timeout = config.timeout, header = {} } = options;
  const { token } = useUserStore();
  let contentType = 'application/json;charset=UTF-8';
  if (token && token.length > 0) {
    header.token = token;
  }
  header['Content-Type'] = contentType;
  return uni
    .request({
      header,
      method,
      timeout,
      url: config.baseURL + url,
      data,
    });
}
