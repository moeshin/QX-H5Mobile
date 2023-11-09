<template>
  <VList lines="three">
    <VInfiniteScroll
      :items="articles"
      @load="loadArticles"
      empty-text="没有更多了"
    >
      <template v-for="article in articles ?? []" :key="article">
        <VListItem
          :to="{
            name: 'article',
            params: {
              id: article.id,
            },
          }"
        >
          <template #prepend>
            <VAvatar class="default-avatar" :image="consts.DEFAULT_AVATAR" />
          </template>
          <VListItemTitle>
            {{ article.title }}
          </VListItemTitle>
          <VListItemSubtitle class="text-primary">
            {{ userStore.get(article.userinfoId).value?.userName }}
          </VListItemSubtitle>
          <VListItemSubtitle style="display: flex">
            {{ articleStore.getArticleCatName(article.articleCatId) }}
            <VSpacer />
            {{ new Date(article.createTime).toLocaleDateString() }}
          </VListItemSubtitle>
        </VListItem>
        <VDivider />
      </template>
      <template #error>{{ errorMessage }}</template>
    </VInfiniteScroll>
  </VList>
</template>

<script lang="ts" setup>
import * as api from '@/api/jqrjq';
import {
  ArticlePagesProvider,
  createArticlePagesProvider,
  createArticlePagesProviderByCatId,
  createArticlePagesProviderByUserId,
} from '@/providers/article';
import { useArticleStore } from '@/store/article';
import { useUserStore } from '@/store/user';
import * as consts from '@/utils/constants';
import { ref, watch } from 'vue';
import { VInfiniteScroll } from 'vuetify/labs/VInfiniteScroll';

const $props = defineProps<{
  src?: {
    type: 'cat' | 'user';
    id: number | undefined;
  };
}>();

const articleStore = useArticleStore();
const userStore = useUserStore();

const articles = ref<api.Article[]>();
const errorMessage = ref<string>();

let isDone = false;
let provider: ArticlePagesProvider | undefined;

watch(
  () => $props.src,
  (src, oldSrc) => {
    if (provider) {
      console.warn('src changed', src, oldSrc);
      return;
    }
    provider = (() => {
      if (src === undefined) {
        return createArticlePagesProvider();
      }
      const { id } = src;
      if (id === undefined) {
        return undefined;
      }
      switch (src.type) {
        case 'cat':
          return createArticlePagesProviderByCatId(id);
        case 'user':
          return createArticlePagesProviderByUserId(id);
        default:
          return undefined;
      }
    })();
  },
  {
    immediate: true,
  },
);

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
  if (provider === undefined) {
    done('ok');
    return;
  }
  provider().then(
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
    (
      reason:
        | {
            toString?: (...args: any) => string;
          }
        | Error
        | undefined,
    ) => {
      console.error(reason);
      errorMessage.value =
        reason instanceof Error
          ? reason.message
          : reason?.toString && reason.toString();
      done('error');
    },
  );
};
</script>
