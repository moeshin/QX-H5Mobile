import * as api from '@/api/jqrjq';
import { useAsyncState, UseAsyncStateReturn } from '@vueuse/core';
import { defineStore } from 'pinia';
import { reactive } from 'vue';

export type UserState = api.UserInfo | null | undefined;

export const useUserStore = defineStore('user', () => {
  const cache = new Map<number, UseAsyncStateReturn<UserState, [], true>>();
  return {
    cache,
    get(id: number) {
      let value = cache.get(id);
      if (!value) {
        const asyncState = useAsyncState<UserState>(
          api.getUserInfo(id).then(
            (data) => data.userinfo,
            (reason) => {
              if (
                reason instanceof api.ApiDataError &&
                reason.resp.data.code === api.ApiCode.failed
              ) {
                return null;
              }
              return Promise.reject(reason);
            },
          ),
          undefined,
        );
        cache.set(id, (value = asyncState));
      }
      return value;
    },
  };
});
