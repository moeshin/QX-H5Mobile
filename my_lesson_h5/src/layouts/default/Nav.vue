<template>
  <v-tabs v-model="navTab" center-active>
    <v-tab v-for="item in navData.data.articleCats" :value="item.id">
      {{ item.catName }}
    </v-tab>
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
            <v-col v-for="item in navData.data.articleCats" cols="4">
              <v-btn-toggle v-model="navTab">
                <v-btn wrap :value="item.id">
                  {{ item.catName }}
                </v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const navTab = ref(null);

const navData = {
  success: true,
  code: 1,
  msg: "成功",
  data: {
    articleCats: [
      {
        id: 1,
        catName: "前端",
        parentId: 0,
        showInNav: true,
        sortOrder: 50,
        createTime: "2023-07-04T17:15:58.000+00:00",
        updateTime: "2023-07-04T17:16:02.000+00:00",
        deleted: 0,
      },
      {
        id: 2,
        catName: "Java",
        parentId: 0,
        showInNav: true,
        sortOrder: 50,
        createTime: "2023-07-04T17:16:33.000+00:00",
        updateTime: "2023-07-04T17:16:37.000+00:00",
        deleted: 0,
      },
      {
        id: 3,
        catName: "Python",
        parentId: 0,
        showInNav: true,
        sortOrder: 50,
        createTime: "2023-07-04T17:16:55.000+00:00",
        updateTime: "2023-07-04T17:16:57.000+00:00",
        deleted: 0,
      },
      {
        id: 4,
        catName: "人工智能",
        parentId: 0,
        showInNav: true,
        sortOrder: 50,
        createTime: "2023-07-04T17:17:31.000+00:00",
        updateTime: "2023-07-04T17:17:34.000+00:00",
        deleted: 0,
      },
      {
        id: 5,
        catName: "AIGC",
        parentId: 0,
        showInNav: true,
        sortOrder: 50,
        createTime: "2023-07-04T17:17:54.000+00:00",
        updateTime: "2023-07-04T17:17:56.000+00:00",
        deleted: 0,
      },
      {
        id: 6,
        catName: "算法",
        parentId: 0,
        showInNav: true,
        sortOrder: 50,
        createTime: "2023-07-04T17:18:20.000+00:00",
        updateTime: "2023-07-04T17:18:23.000+00:00",
        deleted: 0,
      },
      {
        id: 7,
        catName: "移动开发",
        parentId: 0,
        showInNav: true,
        sortOrder: 50,
        createTime: "2023-07-04T17:19:33.000+00:00",
        updateTime: "2023-07-04T17:19:35.000+00:00",
        deleted: 0,
      },
      {
        id: 8,
        catName: "HarmonyOS",
        parentId: 0,
        showInNav: true,
        sortOrder: 50,
        createTime: "2023-07-04T17:20:14.000+00:00",
        updateTime: "2023-07-04T17:20:17.000+00:00",
        deleted: 0,
      },
      {
        id: 9,
        catName: "推荐",
        parentId: 0,
        showInNav: true,
        sortOrder: 50,
        createTime: "2023-07-04T17:21:09.000+00:00",
        updateTime: "2023-07-04T17:21:12.000+00:00",
        deleted: 0,
      },
      {
        id: 10,
        catName: "关注",
        parentId: 0,
        showInNav: true,
        sortOrder: 50,
        createTime: "2023-07-04T17:21:29.000+00:00",
        updateTime: "2023-07-04T17:21:31.000+00:00",
        deleted: 0,
      },
      {
        id: 11,
        catName: "运维",
        parentId: 0,
        showInNav: true,
        sortOrder: 50,
        createTime: "2023-07-04T17:22:12.000+00:00",
        updateTime: "2023-07-04T17:22:14.000+00:00",
        deleted: 0,
      },
    ],
  },
};
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
