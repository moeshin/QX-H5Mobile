<template>
  <VContainer>
    <VCard>
      <VCardTitle style="white-space: unset">
        {{ article?.title }}
      </VCardTitle>
      <VCardSubtitle>
        <div class="pb-2">
          <VChip
            class="default-avatar"
            color="primary"
            :prepend-avatar="consts.DEFAULT_AVATAR"
            :text="article && userStore.get(article.userinfoId).value?.userName"
            :to="{
              name: 'user',
              params: {
                id: article?.userinfoId,
              },
            }"
          />
        </div>
        <div style="display: flex">
          <VChip
            color="pink"
            prepend-icon="mdi-label"
            :text="
              article && articleStore.getArticleCatName(article.articleCatId)
            "
            :to="{
              name: 'articleCat',
              params: {
                id: article?.articleCatId,
              },
            }"
          />
          <VSpacer />
          <VChip
            prepend-icon="mdi-clock"
            :text="article && new Date(article.createTime).toLocaleDateString()"
          />
        </div>
      </VCardSubtitle>
      <VCardText>{{ article?.content }}</VCardText>
    </VCard>
  </VContainer>
</template>
<script lang="ts" setup>
import * as api from '@/api/jqrjq';
import { useArticleStore } from '@/store/article';
import { useUserStore } from '@/store/user';
import * as consts from '@/utils/constants';
import { ref, watch } from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';

const $route = useRoute();

const articleStore = useArticleStore();
const userStore = useUserStore();

const article = ref<api.Article | undefined>(undefined);

(() => {
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
