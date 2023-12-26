import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export interface WxUserinfo {
	openid: string;
	nickName: string;
	avatarUrl: string;
}

export const useWeixinStore = defineStore(
  'weixin',
  () => {
    const wxUserinfo = ref<WxUserinfo>();

    return {
      wxUserinfo,
      isLogin: computed(() => !!wxUserinfo.value),
    };
  },
  {
    persist: {
			enabled: true,
			H5Storage: window?.localStorage
		},
  },
);

