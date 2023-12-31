import * as api from '@/api/jqrjq';

export type ArticlePagesProvider = () => Promise<
  api.ResponsePages<api.Article>
>;

export function createArticlePagesProvider(
  current: number = 0,
  size: number = 10,
): ArticlePagesProvider {
  // console.warn('current-init', current);
  const provider = async () => {
    // console.warn('current', current);
    return api.getArticlePages(++current, size).then((data) => data.pages);
  };
  // return () =>
  //   new Promise((resolve) => setTimeout(resolve, 2000)).then(provider);
  return provider;
}

// export function createArticlePagesProvider(): ArticlePagesProvider {
//   return () =>
//     api
//       .getArrIgnoreNoData(api.getArticles(), 'articles')
//       .then((data) => api.wrapPages(data));
// }

export function createArticlePagesProviderByCatId(
  id: number,
): ArticlePagesProvider {
  return () =>
    api
      .getArrIgnoreNoData(api.getArticlesByCatId(id), 'articles')
      .then((data) => api.wrapPages(data));
}

export function createArticlePagesProviderByUserId(
  id: number,
): ArticlePagesProvider {
  return () =>
    api
      .getArrIgnoreNoData(api.getArticlesByUserId(id), 'articles', [
        api.ApiCode.failed,
      ])
      .then((data) => api.wrapPages(data));
}
