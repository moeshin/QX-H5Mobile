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
import { ref } from 'vue';
import { VInfiniteScroll } from 'vuetify/labs/VInfiniteScroll';

type DataFrom = 'cat' | 'user';

const props = defineProps<
  | {
      dataFrom: DataFrom;
      dataId: number;
    }
  | {
      dataFrom?: undefined;
      dataId?: undefined;
    }
>();

const articleStore = useArticleStore();
const userStore = useUserStore();
const articles = ref<api.Article[]>();

let isDone = false;
let provider: ArticlePagesProvider | undefined;

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
  if (props.dataFrom && props.dataId === undefined) {
    done('ok');
    return;
  }
  (
    provider ||
    (provider = (() => {
      switch (props?.dataFrom) {
        case 'cat':
          return createArticlePagesProviderByCatId(props.dataId);
        case 'user':
          return createArticlePagesProviderByUserId(props.dataId);
        default:
          return createArticlePagesProvider();
      }
    })())
  )().then(
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
