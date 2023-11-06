import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import * as api from '@/api/jqrjq';


export const useAuthStore = defineStore('auth', () => {
  const user = ref<api.UserInfo>();
  return {
    user,
    isLogin: computed(() => !!user.value),
  };
}, {
  persist: true,
});
