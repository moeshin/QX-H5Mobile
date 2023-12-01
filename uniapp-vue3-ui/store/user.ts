import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export interface WxUserinfo {
	openid: string;
	nickName: string;
	avatarUrl: string;
}

const useUserStore = defineStore(
	'user',
	() => {
		const token = ref('');
		const userinfo = ref({
			id: 0,
			state: 0,
			userName: '',
			userType: '',
			token: '',
			binding: 0,
			email: '',
			mobile: ''
		});
		function setToken(v: any) {
			token.value = v;
		}
		function fillUser(v: any) {
			userinfo.value = v;
		}

		const wxUserinfo = ref<WxUserinfo>();
		return {
			token,
			setToken,
			userinfo,
			fillUser,
			wxUserinfo,
			setWxUserinfo(v: WxUserinfo) {
				wxUserinfo.value = v;
			},
			isLogin: computed(() => !!wxUserinfo.value)
		};
	},
	{
		persist: {
			enabled: true,
			H5Storage: window?.localStorage
		}
	} as any
);

export default useUserStore;
