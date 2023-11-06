<template>
  <VWindow v-model="articleCatId">
    <VWindowItem
      v-for="articleCat in articleStore.navArticleCats"
      :key="articleCat.id"
      :value="articleCat.id"
    >
      <ArticleList
        :provider="
          articleCat.id
            ? createArtilePagesProviderByArticleCatId(articleCat.id)
            : createArtilePagesProvider()
        "
      />
    </VWindowItem>
  </VWindow>
</template>

<script lang="ts" setup>
import {
  createArtilePagesProvider,
  createArtilePagesProviderByArticleCatId,
} from '@/providers/article';
import ArticleList from '@/components/ArticleList.vue';
import { useArticleStore } from '@/store/article';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const articleStore = useArticleStore();

const articleCatId = ref(parseInt(route.params.id as string));
watch(articleCatId, () => {
  router.push({
    name: 'articleCat',
    params: {
      id: articleCatId.value,
    },
  });
});
watch(
  () => route.params.id,
  (value) => {
    if (route.name != 'articleCat') {
      return;
    }
    const id = parseInt(value as string);
    articleCatId.value = id;
  },
);
</script>
