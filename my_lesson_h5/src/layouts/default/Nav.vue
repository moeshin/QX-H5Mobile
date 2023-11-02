<template>
  <VTabs v-model="navCurrent" center-active>
    <template v-for="item in articleCats" :key="item.id">
      <VTab :value="item" :to="`${NAV_PREFIX}/${item.id}`">
        {{ item.catName }}
      </VTab>
    </template>
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
            <template v-for="item in articleCats" :key="item.id">
              <VCol cols="4">
                <VBtnToggle v-model="navCurrent" mandatory>
                  <VBtn
                    :value="item"
                    :to="`${NAV_PREFIX}/${item.id}`"
                    :text="item.catName"
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
import * as api from '@/api/jqrjq';
import { onMounted, ref } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';
const NAV_PREFIX = '/articleCat';

const navCurrent = ref<api.ArticleCat | undefined>(undefined);
const articleCats = ref<api.ArticleCat[]>([]);
onMounted(() => {
  api.getArticleCatAll().then((data) => {
    articleCats.value = data.articleCats.filter((v) =>
      v.showInNav && v.deleted ? false : true,
    );
  });
});

onBeforeRouteUpdate((to, _, next) => {
  if (!to.fullPath.startsWith(`${NAV_PREFIX}/`)) {
    navCurrent.value = undefined;
  }
  next();
});
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
