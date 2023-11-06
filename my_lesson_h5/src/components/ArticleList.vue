<template>
  <VList lines="two">
    <VInfiniteScroll
      :items="articles"
      @load="loadArticles"
      empty-text="没有更多了"
    >
      <template v-for="article in articles ?? []" :key="article">
        <VListItem :to="`/article/${article.id}`">
          <template #default>
            <VListItemTitle style="display: flex">
              <VIcon icon="mdi-account-circle-outline" />
              <span class="mx-2">
                {{ userInfoStore.get(article.userinfoId).value?.userName }}
              </span>
              <VSpacer />
              more
            </VListItemTitle>
            <VListItemSubtitle
              class="my-2"
              style="opacity: inherit; font-size: 1rem; line-height: 1.2rem"
            >
              {{ article.title }}
            </VListItemSubtitle>
            <VListItemSubtitle style="display: flex">
              {{ articleStore.getArticleCatName(article.articleCatId) }}
              <VSpacer />
              {{ new Date(article.createTime).toLocaleDateString() }}
            </VListItemSubtitle>
          </template>
        </VListItem>
        <VDivider />
      </template>
    </VInfiniteScroll>
  </VList>
</template>

<script lang="ts" setup>
import * as api from '@/api/jqrjq';
import { ArtilePagesProvider } from '@/providers/article';
import { useArticleStore } from '@/store/article';
import { useUserInfoStore } from '@/store/userinfo';
import { defineProps, ref } from 'vue';
import { VInfiniteScroll } from 'vuetify/labs/VInfiniteScroll';

const props = defineProps<{
  provider: ArtilePagesProvider;
}>();

const articleStore = useArticleStore();
const userInfoStore = useUserInfoStore();
const articles = ref<api.Article[]>();

let isDone = false;

const loadArticles: VInfiniteScroll['$props']['onLoad'] = ({ done }) => {
  // const _done = done;
  // done = (...args) => {
  //   console.log('done', args, isDone);
  //   _done(...args);
  // }
  if (isDone) {
    done('empty');
    return;
  }
  props.provider().then(
    (pages) => {
      if (pages.records.length < 1) {
        done('empty');
        isDone = true;
        return;
      }
      if (articles.value) {
        articles.value.push(...pages.records);
      } else {
        articles.value = pages.records;
      }
      isDone = api.isLatestPages(pages);
      done('ok');
    },
    (reason) => {
      console.error(reason);
      done('error');
    },
  );
};
</script>
