<template>
  <VWindow v-model="navCurrent" mandatory class="fill-height">
    <VWindowItem value="none" v-if="navCurrent === 'none'">
      <div class="text-center py-8">没有该分类</div>
    </VWindowItem>
    <VWindowItem value="all">
      <WArticleList />
    </VWindowItem>
    <VWindowItem
      v-for="articleCat in articleStore.articleCats.state"
      :key="articleCat.id"
      :value="articleCat.id"
    >
      <WArticleList
        :data="{
          type: 'cat',
          id: articleCat.id,
        }"
      />
    </VWindowItem>
  </VWindow>
</template>

<script lang="ts" setup>
import WArticleList from '@/components/WArticleList.vue';
import { useArticleStore } from '@/store/article';
import { storeToRefs } from 'pinia';

const articleStore = useArticleStore();
const { navCurrent } = storeToRefs(articleStore);
</script>
