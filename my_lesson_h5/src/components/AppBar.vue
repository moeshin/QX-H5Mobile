<template>
  <VAppBar>
    <VBtn icon="mdi-home" to="/" :active="false" />
    <VAppBarTitle>{{ title }}</VAppBarTitle>
    <VSpacer />
    <VBtn v-if="authStore.isLogin" icon="mdi-logout" to="/logout" />
    <VBtn icon="mdi-account" to="/profile" />

    <template v-if="route.meta.showArticleCatNavBar" #extension>
      <ArticleCatNavBar />
    </template>
  </VAppBar>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/store/auth';
import { watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import { VAppBar, VAppBarTitle, VBtn, VSpacer } from 'vuetify/components';
import ArticleCatNavBar from './ArticleCatNavBar.vue';

const route = useRoute();
const authStore = useAuthStore();

const title = ref('');

watch(
  () => route.meta.title,
  (value) => {
    title.value = value as string;
  },
  { immediate: true },
);
</script>
