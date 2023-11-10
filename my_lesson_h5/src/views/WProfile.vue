<template>
  <VContainer>
    <template v-if="user === null">
      <div class="text-center text-h6">用户不存在</div>
    </template>
    <template v-else>
      <div class="my-4 text-center">
        <VAvatar
          style="width: 12vh; height: 12vh; min-width: 12vw; min-height: 12vw"
          color="grey"
          class="default-avatar"
          :image="consts.DEFAULT_AVATAR"
        />
      </div>
      <div class="my-4 text-center">
        <div class="text-h5">{{ user?.userName }}</div>
        <div class="text-subtitle-1">{{ user?.email }}</div>
      </div>
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
            <WArticleList
              :data="{
                type: 'user',
                id: user?.id,
              }"
            />
          </VWindowItem>
          <VWindowItem
            v-for="(item, index) of tabs"
            :key="index"
            :value="index"
          >
            <VContainer fluid>
              <h3 align="center">{{ item }}</h3>
              <p>{{ 'x'.repeat(2e3 + index * 8) }}</p>
            </VContainer>
          </VWindowItem>
        </VWindow>
      </VCard>
    </template>
  </VContainer>
</template>
<script lang="ts" setup>
import WArticleList from '@/components/WArticleList.vue';
import { useAuthStore } from '@/store/auth';
import { UserState, useUserStore } from '@/store/user';
import * as consts from '@/utils/constants';
import { Ref, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const $router = useRouter();
const $route = useRoute();

const user: Ref<UserState> = useUserStore().get(
  $route.name === 'profile'
    ? useAuthStore().user?.id!
    : parseInt($route.params.id as string),
).state;

watch(
  () => $route.params.id,
  () => {
    if ($route.name === 'user') {
      $router.go(0);
    }
  },
);

const tab = ref<number | string>();
const tabs = ['关注', '动态', '收藏'];
</script>
