<template>
  <VContainer>
    <VCard>
      <VCardTitle style="white-space: unset">
        <div class="my-2">
          <VChip
            color="primary"
            prepend-icon="mdi-account-circle"
            :text="
              article && userInfoStore.get(article.userinfoId).value?.userName
            "
          />
        </div>
        {{ article?.title }}
      </VCardTitle>
      <VCardSubtitle class="">
        <div style="display: flex;">
          <VChip
            color="pink"
            prepend-icon="mdi-label"
            :text="
              article && articleStore.getArticleCatName(article.articleCatId)
            "
            :to="`/articleCat/${article?.articleCatId}`"
          />
          <VSpacer />
          <VChip
            prepend-icon="mdi-clock"
            :text="article && new Date(article.createTime).toLocaleDateString()"
          />
        </div>
      </VCardSubtitle>
      <VCardItem>{{ article?.content }}</VCardItem>
    </VCard>
  </VContainer>
</template>
<script lang="ts" setup>
import * as api from '@/api/jqrjq';
import { useArticleStore } from '@/store/article';
import { useUserInfoStore } from '@/store/userinfo';
import { ref, watch } from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';

const articleStore = useArticleStore();
const userInfoStore = useUserInfoStore();

const article = ref<api.Article | undefined>(undefined);

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
        api.getArticle(parseInt(id as string)).then(
          (data) => {
            article.value = data.article;
          },
          (reason) => {
            console.warn(reason);
            article.value = undefined;
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
