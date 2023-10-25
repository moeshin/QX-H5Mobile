<template>
  <v-app-bar flat>
    <v-app-bar-title>
      <RouterLink to="/" style="color: inherit; text-decoration: none">
        <v-icon icon="mdi-circle-slice-6" />

        Essentials Preset
      </RouterLink>
    </v-app-bar-title>

    <template v-slot:extension>
      <DefaultNav />
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import DefaultNav from './Nav.vue';
</script>
