import * as api from '@/api/jqrjq';
import { useAsyncState } from '@vueuse/core';
import { defineStore } from 'pinia';
import { Ref, ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const cache = ref(new Map<number, Ref<api.UserInfo | undefined>>());
  return {
    cache,
    get(id: number) {
      let info = cache.value.get(id);
      if (!info) {
        const { state } = useAsyncState<api.UserInfo | undefined>(
          api.getUserInfo(id).then((data) => data.userinfo),
          undefined,
        );
        cache.value.set(id, (info = state));
      }
      return info;
    },
  };
});
