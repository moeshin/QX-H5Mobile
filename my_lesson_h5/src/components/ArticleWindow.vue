<template>
  <VWindow v-model="currentItem" mandatory class="fill-height">
    <VWindowItem value="" v-if="currentItem === ''">
      <div class="text-center py-8">没有该分类</div>
      <!-- <VAlert type="error" text="没有该分类" /> -->
    </VWindowItem>
    <VWindowItem value="all">
      <ArticleList />
    </VWindowItem>
    <VWindowItem
      v-for="articleCat in articleStore.articleCats.state"
      :key="articleCat.id"
      :value="articleCat.id"
    >
      <ArticleList
        :data="{
          type: 'cat',
          id: articleCat.id,
        }"
      />
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
const currentItem = ref<number | 'all' | ''>('');

watch(currentItem, (id) => {
  // console.log('watch articles', id);
  if (id === 'all') {
    $router.push({
      name: 'articles',
    });
    return;
  }
  if (id === '') {
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
  () => {
    switch ($route.name) {
      case 'articleCat': {
        const catId = parseInt($route.params.id as string);
        articleStore.articleCats.then(() => {
          currentItem.value = articleStore.articleCatMap.has(catId)
            ? catId
            : '';
        });
        break;
      }
      case 'articles':
        currentItem.value = 'all';
        break;
    }
  },
  {
    immediate: true,
  },
);
</script>
