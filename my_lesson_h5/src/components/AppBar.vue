<template>
  <VAppBar>
    <VBtn icon="mdi-home" to="/" :active="false" />
    <VAppBarTitle>{{ title }}</VAppBarTitle>
    <VSpacer />
    <VBtn v-if="userStore.info" icon="mdi-logout" to="/logout" />
    <VBtn icon="mdi-account" to="/profile" />

    <template v-if="route.meta.showArticleCatNavBar" #extension>
      <ArticleCatNavBar />
    </template>
  </VAppBar>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user';
import { watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import { VAppBar, VAppBarTitle, VBtn, VSpacer } from 'vuetify/components';
import ArticleCatNavBar from './ArticleCatNavBar.vue';

const route = useRoute();
const userStore = useUserStore();

const title = ref('');

watch(
  () => route.meta.title,
  (value) => {
    title.value = value as string;
  },
  { immediate: true },
);
</script>
