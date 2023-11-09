<template>
  <VWindow v-model="articlesId" mandatory class="fill-height">
    <VWindowItem value="all">
      <ArticleList />
    </VWindowItem>
    <VWindowItem
      v-for="articleCat in articleStore.articleCats"
      :key="articleCat.id"
      :value="articleCat.id"
    >
      <ArticleList :src="{
        type: 'user',
        id: articleCat.id,
      }" />
    </VWindowItem>
  </VWindow>
</template>

<script lang="ts" setup>
import ArticleList from '@/components/ArticleList.vue';
import { useArticleStore } from '@/store/article';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const $router = useRouter();
const $route = useRoute();

const articleStore = useArticleStore();
const articlesId = ref<number | 'all'>(
  $route.params.id ? parseInt($route.params.id as string) : 'all',
);

watch(articlesId, (id) => {
  // console.log('watch articles', id);
  if (id === 'all') {
    $router.push({
      name: 'articles',
    });
    return;
  }
  $router.push({
    name: 'articleCat',
    params: {
      id,
    },
  });
});
watch(
  () => $route.params.id,
  (id) => {
    // console.log('watch route.params.id', id);
    switch ($route.name) {
      case 'articleCat':
        articlesId.value = parseInt(id as string);
        break;
      case 'articles':
        articlesId.value = 'all';
        break;
    }
  },
);
</script>
