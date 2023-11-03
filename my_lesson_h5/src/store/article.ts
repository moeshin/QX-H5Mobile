import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useAsyncState } from '@vueuse/core';
import * as api from '@/api/jqrjq';

export const useArticleStore = defineStore('article', () => {
  const { state: articleCats } = useAsyncState<api.ArticleCat[]>(
    api.getArticleCatAll().then((data) => data.articleCats),
    [],
  );
  return {
    articleCats,
    navArticleCats: computed(() => articleCats.value.filter(
      (v) => v.showInNav && !v.deleted,
    )),
    articleCatMap: computed(() => {
      const map = new Map<number, api.ArticleCat>();
      for (const articleCat of articleCats.value) {
        map.set(articleCat.id, articleCat);
      }
      return map;
    }),
  };
});
