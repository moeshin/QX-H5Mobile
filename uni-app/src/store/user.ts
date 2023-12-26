import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { UserInfo } from '@/http/api';

export const useUserStore = defineStore(
  'user',
  () => {
    const userinfo = ref<UserInfo>();

    return {
      userinfo,
      token: computed(() => userinfo.value?.token),
      isLogin: computed(() => !!userinfo.value),
    };
  },
  {
    persist: {
			enabled: true,
			H5Storage: window?.localStorage
		},
  },
);
