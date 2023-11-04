import * as api from '@/api/jqrjq';
import { useAsyncState } from '@vueuse/core';
import { defineStore } from 'pinia';
import { Ref, ref } from 'vue';

export const useUserInfoStore = defineStore('userinfo', () => {
  const cache = ref(new Map<number, Ref<api.UserInfo | null>>());
  return {
    cache,
    get(id: number) {
      let info = cache.value.get(id);
      if (!info) {
        const { state } = useAsyncState<api.UserInfo | null>(
          api.getUserInfo(id).then((data) => data.userinfo),
          null,
        );
        cache.value.set(id, (info = state));
      }
      return info;
    },
  };
});
