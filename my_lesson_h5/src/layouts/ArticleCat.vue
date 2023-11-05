<template>
  <VApp>
    <AppBar>
      <template v-slot:extension>
        <ArticleCatNavBar />
      </template>
    </AppBar>

    <DefaultView />
  </VApp>
</template>

<script lang="ts" setup>
import AppBar from '@/components/AppBar';
import DefaultView from './default/View.vue';
import ArticleCatNavBar from '@/components/ArticleCatNavBar.vue';
</script>
