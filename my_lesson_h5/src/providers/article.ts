import * as api from '@/api/jqrjq';

export type ArtilePagesProvider = () => Promise<api.ResponsePages<api.Article>>;

export function createArtilePagesProvider(
  current: number = 0,
  size: number = 2,
): ArtilePagesProvider {
  return () => api.getArticlePages(++current, size).then((data) => data.pages);
}

export function createArtilePagesProviderByArticleCatId(
  articleCatId: number,
): ArtilePagesProvider {
  return () =>
    api
      .getArrIgnoreNoData(api.getArticlesByCatId(articleCatId), 'articles')
      .then((data) => api.warpPages(data));
}
