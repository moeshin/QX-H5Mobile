<template>
  <VAppBar flat>
    <VAppBarTitle>
      <RouterLink to="/" style="color: inherit; text-decoration: none">
        <VIcon icon="mdi-circle-slice-6" />

        Essentials Preset
      </RouterLink>
    </VAppBarTitle>

    <VSpacer />
    <VBtn icon="mdi-account" to="/profile" />

    <template v-slot:extension>
      <DefaultNav />
    </template>
  </VAppBar>
</template>

<script lang="ts" setup>
import DefaultNav from './Nav.vue';
</script>
