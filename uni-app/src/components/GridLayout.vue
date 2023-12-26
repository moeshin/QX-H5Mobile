<template>
  <view class="grid-box">
    <view v-if="!!$slots.prepend" class="grid-prepend">
      <slot name="prepend"> </slot>
    </view>
    <view v-if="!!$slots.default" class="grid-default">
      <slot></slot>
    </view>
    <view v-if="!!$slots.append" class="grid-append">
      <slot name="append"> </slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useSlots } from 'vue';
const $slots = useSlots();
</script>

<style scoped>
.grid-box {
  display: grid;
  grid-template-areas: 'prepend center append';
  grid-template-columns: max-content minmax(0, 1fr) max-content;
}

.grid-default {
  grid-area: center;
}

.grid-prepend {
  grid-area: prepend;
}

.grid-append {
  grid-area: append;
}

.grid-default,
.grid-prepend,
.grid-append {
  display: flex;
  align-items: center;
}
</style>
