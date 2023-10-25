<template>
  <v-tabs v-model="navCurrent" center-active>
    <template v-for="item in articleCats" :key="item.id">
      <v-tab :value="item" :to="`${NAV_PREFIX}/${item.id}`">
        {{ item.catName }}
      </v-tab>
    </template>
  </v-tabs>
  <v-spacer />
  <v-dialog transition="dialog-top-transition" class="popNav">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" icon="mdi-view-module"></v-btn>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-toolbar color="transparent" title="选择频道">
          <v-spacer />
          <v-btn icon="mdi-close" @click="isActive.value = false"></v-btn>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <template v-for="item in articleCats" :key="item.id">
              <v-col cols="4">
                <v-btn-toggle v-model="navCurrent" mandatory>
                  <v-btn :value="item" :to="`${NAV_PREFIX}/${item.id}`">
                    {{ item.catName }}
                  </v-btn>
                </v-btn-toggle>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
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
    console.log(navCurrent.value);
  }
  next();
});
</script>

<style lang="less" scoped>
.popNav.v-dialog:deep(> .v-overlay__content) {
  width: 100%;
  max-width: calc(100% - 16px);

  .v-card-text .v-col {
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
</style>
