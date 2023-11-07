<template>
  <VContainer>
    <div class="my-4" align="center">
      <VAvatar
        style="width: 12vh; height: 12vh; min-width: 12vw; min-height: 12vw"
        color="grey"
        :image="avatar"
      />
    </div>
    <h2 class="my-4" align="center">{{ user?.userName }}</h2>
    <VCard>
      <VTabs v-model="tab" color="deep-purple-accent-4" align-tabs="center">
        <VTab value="articles" text="文章" />
        <VTab
          v-for="(item, index) of tabs"
          :key="index"
          :value="index"
          :text="item"
        />
      </VTabs>
      <VWindow v-model="tab">
        <VWindowItem value="articles">
          <ArticleList data-from="user" :data-id="user?.id" />
        </VWindowItem>
        <VWindowItem v-for="(item, index) of tabs" :key="index" :value="index">
          <VContainer fluid>
            <h3 align="center">{{ item }}</h3>
            <p>{{ 'x'.repeat(2e3 + index * 8) }}</p>
          </VContainer>
        </VWindowItem>
      </VWindow>
    </VCard>
  </VContainer>
</template>
<script lang="ts" setup>
import * as api from '@/api/jqrjq';
import { useAuthStore } from '@/store/auth';
import { useUserStore } from '@/store/user';
import { storeToRefs } from 'pinia';
import { ref, Ref } from 'vue';
import { useRoute } from 'vue-router';
import ArticleList from '@/components/ArticleList.vue';

const route = useRoute();

const user: Ref<api.UserInfo | undefined> =
  route.name === 'profile'
    ? storeToRefs(useAuthStore()).user
    : useUserStore().get(route.params.id as any);

const tab = ref<number | string>();
const avatar = ref('/src/assets/logo.svg');
const tabs = ['关注', '动态', '收藏'];
</script>

<style lang="less" scoped>
:deep(.v-avatar img) {
  top: 8%;
  scale: 0.8;
}
</style>
