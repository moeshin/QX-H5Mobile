import { ref } from 'vue';
import { defineStore } from 'pinia';
import * as api from '@/api/jqrjq';


export const useUserStore = defineStore('user', () => ({
  info: ref<api.UserInfo | null>(null),
}), {
  persist: true,
});
