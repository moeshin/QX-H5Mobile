import * as api from '@/api/jqrjq';

export type ArtilePagesProvider = () => Promise<api.ResponsePages<api.Article>>;

export function createArtilePagesProvider(
  current: number = 0,
  size: number = 10,
): ArtilePagesProvider {
  const provider = () =>
    api.getArticlePages(++current, size).then((data) => data.pages);
  // return () =>
  //   new Promise((resolve) => setTimeout(resolve, 2000)).then(provider);
  return provider;
}

export function createArtilePagesProviderByArticleCatId(
  articleCatId: number,
): ArtilePagesProvider {
  return () =>
    api
      .getArrIgnoreNoData(api.getArticlesByCatId(articleCatId), 'articles')
      .then((data) => api.wrapPages(data));
}
