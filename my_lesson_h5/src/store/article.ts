import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { useAsyncState } from '@vueuse/core';
import * as api from '@/api/jqrjq';

export const useArticleStore = defineStore('article', () => {
  const articleCats = useAsyncState<api.ArticleCat[]>(
    api.getArticleCatAll().then((data) => data.articleCats),
    [],
  );
  const articleCatMap = computed(() => {
    const map = new Map<number, api.ArticleCat>();
    for (const articleCat of articleCats.state.value) {
      map.set(articleCat.id, articleCat);
    }
    return map;
  });
  return {
    articleCats,
    navArticleCats: computed(() =>
      articleCats.state.value.filter((v) => v.showInNav && !v.deleted),
    ),
    articleCatMap,
    getArticleCatName(id: number) {
      return articleCatMap.value.get(id)?.catName;
    },
    navCurrent: ref<number | 'all' | 'none' | undefined>(),
  };
});
