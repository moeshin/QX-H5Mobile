<template>
  <VList v-if="articles.length > 0" lines="two">
    <template v-for="(article, index) in articles" :key="article">
      <VDivider v-if="index !== 0" />
      <VListItem :to="`/article/${article.id}`">
        <template v-slot:default>
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
            {{ article.content }}
          </VListItemSubtitle>
          <VListItemSubtitle style="display: flex">
            {{ articleStore.getArticleCatName(article.articleCatId) }}
            <VSpacer />
            {{ new Date(article.createTime).toLocaleDateString() }}
          </VListItemSubtitle>
        </template>
      </VListItem>
    </template>
  </VList>
  <div v-else class="py-4 text-center">空空如也<br>(*&gt;.&lt;*)</div>
</template>

<script lang="ts" setup>
import * as api from '@/api/jqrjq';
import { useArticleStore } from '@/store/article';
import { useUserInfoStore } from '@/store/userinfo';
import { ref, watch } from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';

const articleStore = useArticleStore();
const userInfoStore = useUserInfoStore();
const articles = ref<api.Article[]>([]);

(() => {
  const $route = useRoute();
  let isCurrentRoute = true;

  onBeforeRouteLeave(() => {
    isCurrentRoute = false;
  });

  watch(
    () => $route.params.id,
    (id) => {
      if (isCurrentRoute) {
        api.getArticlesByCatId(parseInt(id as string)).then(
          (data) => {
            articles.value = data.articles;
          },
          (reason) => {
            if (
              reason instanceof api.ApiDataError &&
              reason.resp.data.code === api.ApiCode.noData
            ) {
              articles.value = [];
              return;
            }
            console.error(reason);
          },
        );
      }
    },
    {
      immediate: true,
    },
  );
})();
</script>
