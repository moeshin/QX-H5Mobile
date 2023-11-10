<template>
  <VAppBar>
    <VBtn icon="mdi-home" to="/" :active="false" />
    <VAppBarTitle>{{ title }}</VAppBarTitle>
    <VSpacer />

    <template v-if="authStore.isLogin" v-for="user in [authStore.user!]">
      <VMenu transition="slide-y-transition">
        <template v-slot:activator="{ props }">
          <VBtn v-bind="props" icon="mdi-account" />
        </template>
        <VCard>
          <VList>
            <VListItem
              to="/profile"
              :prepend-avatar="consts.DEFAULT_AVATAR"
              :title="user.userName"
              :subtitle="user.email"
              :active="false"
              class="default-avatar"
            />
          </VList>
          <VDivider />
          <VList>
            <VListItem
              to="/profile"
              prepend-icon="mdi-account"
              title="个人信息"
            />
            <VDivider />
            <VListItem prepend-icon="mdi-logout" title="退出" to="/logout" />
          </VList>
        </VCard>
      </VMenu>
    </template>
    <template v-else>
      <VBtn to="/login" icon="mdi-account" text="登录" />
    </template>

    <template v-if="$route.meta.showArticleCatNavBar" #extension>
      <WArticleCatNavBar />
    </template>
  </VAppBar>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/store/auth';
import * as consts from '@/utils/constants';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { VAppBar, VAppBarTitle, VBtn, VSpacer } from 'vuetify/components';
import WArticleCatNavBar from './WArticleNavBar.vue';

const $route = useRoute();
const authStore = useAuthStore();

const title = ref('');

watch(
  () => $route.meta.title,
  (value) => {
    title.value = value as string;
  },
  { immediate: true },
);
</script>
