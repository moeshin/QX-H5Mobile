<template>
  <VTabs v-model="currentItem" mandatory center-active>
    <VTab
      value="all"
      text="全部"
      :to="{
        name: 'articles',
      }"
    />
    <VTab
      v-for="item in navArticleCats"
      :key="item.id"
      :value="item.id"
      :text="item.catName"
      :to="{
        name: 'articleCat',
        params: {
          id: item.id,
        },
      }"
    />
  </VTabs>
  <VSpacer />
  <VDialog transition="dialog-top-transition" class="popNav">
    <template v-slot:activator="{ props }">
      <VBtn v-bind="props" icon="mdi-view-module" />
    </template>
    <template v-slot:default="{ isActive }">
      <VCard>
        <VToolbar color="transparent" title="选择频道">
          <VSpacer />
          <VBtn icon="mdi-close" @click="isActive.value = false" />
        </VToolbar>
        <VCardText>
          <VRow>
            <VCol cols="4">
              <VBtnToggle v-model="currentItem" mandatory>
                <VBtn
                  value="all"
                  text="全部"
                  :to="{
                    name: 'articles',
                  }"
                />
              </VBtnToggle>
            </VCol>
            <template v-for="item in navArticleCats" :key="item.id">
              <VCol cols="4">
                <VBtnToggle v-model="currentItem" mandatory>
                  <VBtn
                    :value="item.id"
                    :text="item.catName"
                    :to="{
                      name: 'articleCat',
                      params: {
                        id: item.id,
                      },
                    }"
                  />
                </VBtnToggle>
              </VCol>
            </template>
          </VRow>
        </VCardText>
      </VCard>
    </template>
  </VDialog>
</template>

<script lang="ts" setup>
import { useArticleStore } from '@/store/article';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const $route = useRoute();

const currentItem = ref<number | 'all'>();

const articleStore = useArticleStore();
const { navArticleCats } = storeToRefs(articleStore);

watch(
  () => $route.name,
  (name) => {
    if (!['articles', 'articleCat'].includes(name as any)) {
      currentItem.value = undefined;
    }
  },
);
watch(
  () => $route.params.id,
  (id) => {
    if ($route.name === 'articleCat') {
      const catId = parseInt(id as string);
      articleStore.articleCats.then(() => {
        if (!articleStore.articleCatMap.has(catId)) {
          currentItem.value = undefined;
        }
      });
    }
  },
);
</script>

<style lang="less" scoped>
.popNav.v-dialog {
  align-items: start;

  :deep(> .v-overlay__content) {
    width: 100%;
    max-width: calc(100% - 16px);

    .v-card-text {
      padding-bottom: 24px;

      .v-col {
        padding: 4px;

        > .v-btn-group {
          width: 100%;
          text-align: center;

          > .v-btn {
            width: 100%;

            > .v-btn__content {
              word-wrap: normal;
            }
          }
        }
      }
    }
  }
}
</style>
