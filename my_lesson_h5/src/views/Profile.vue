<template>
  <div style="position: absolute; top: 8px; right: 8px">
    <VBtn flat icon="mdi-logout" to="/logout" />
  </div>
  <div class="mt-8" align="center">
    <VAvatar
      color="grey"
      style="width: 12vh; height: 12vh; min-width: 12vw; min-height: 12vw"
      :image="avatar"
    />
  </div>
  <h2 class="ma-4" align="center">{{ userStore.info?.userName }}</h2>
  <VCard class="ma-4">
    <VTabs v-model="tab" color="deep-purple-accent-4" align-tabs="center">
      <VTab
        v-for="(item, index) of tabs"
        :key="index"
        :value="index"
        :text="item"
      />
    </VTabs>
    <VWindow v-model="tab">
      <VWindowItem v-for="(item, index) of tabs" :key="index" :value="index">
        <VContainer fluid>
          <h3 align="center">{{ item }}</h3>
          <p>{{ 'x'.repeat(2e3 + index * 8) }}</p>
        </VContainer>
      </VWindowItem>
    </VWindow>
  </VCard>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();

const tab = ref('');
const avatar = ref('/src/assets/logo.svg');
const tabs = ['关注', '动态', '收藏'];
</script>
