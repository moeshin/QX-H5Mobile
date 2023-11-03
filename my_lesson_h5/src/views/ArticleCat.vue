<template>
  <VContainer>
    <VCode class="overflow-auto" tag="pre" v-text="articleCat" />
  </VContainer>
</template>

<script lang="ts" setup>
import * as api from '@/api/jqrjq';
import { ref, watch } from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';

const articleCat = ref<api.ArticleCat | undefined>(undefined);
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
        api.getArticleCat(id as string).then((data) => {
          articleCat.value = data.articleCat;
        });
      }
    },
    {
      immediate: true,
    },
  );
})();
</script>
