<template>
  <VContainer>
    <div v-if="article === undefined" class="text-center text-h6">
      文章不存在
    </div>
    <VCard v-else>
      <VCardTitle style="white-space: unset">
        {{ article?.title }}
      </VCardTitle>
      <VCardItem class="pt-0">
        <VChip
          class="default-avatar"
          color="primary"
          :prepend-avatar="consts.DEFAULT_AVATAR"
          :text="
            article && userStore.get(article.userinfoId).state.value?.userName
          "
          :to="{
            name: 'user',
            params: {
              id: article?.userinfoId,
            },
          }"
        />
      </VCardItem>
      <VCardSubtitle style="display: flex">
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
import { ref, watch, computed } from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';

const $route = useRoute();

const articleStore = useArticleStore();
const userStore = useUserStore();

const article = ref<api.Article>();

(() => {
  watch(
    () => $route.params.id,
    (id) => {
      if ($route.name === 'article') {
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
