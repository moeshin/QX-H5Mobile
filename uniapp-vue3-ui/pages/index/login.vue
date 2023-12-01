<template>
	<view>
		<view class="logo">
			<image src="@/static/logo.png"></image>
		</view>
		<uni-forms class="myForm" ref="myForm" :modelValue="loginModel" :rules="rules">
			<uni-forms-item name="email">
				<uni-easyinput class="input" v-model="loginModel.email" placeholder="请输入电子邮箱" suffix-icon="email" />
			</uni-forms-item>
			<uni-forms-item name="password">
				<uni-easyinput class="input" type="password" v-model="loginModel.password" placeholder="请输入密码" />
			</uni-forms-item>
			<button type="primary" @click="login">用户登录</button>
			<button type="primary" @click="authWeChat">微信授权</button>
			<view class="logo-extra">
				<button type="default" size="mini">忘记密码</button>
				<button type="default" size="mini" @click="toRegister">用户注册</button>
			</view>
		</uni-forms>
	</view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import useUserStore from '@/store/user';
import { postRequest } from '@/http/index.js';
import wxConfig from '@/wx.config';

const userStore = useUserStore();
const myForm = ref(null); //获取DOM节点myForm==ref
const loginModel = reactive({
	email: '',
	password: ''
});
const rules = {
	email: {
		rules: [
			{
				required: true,
				errorMessage: '必填项'
			},
			{
				format: 'email',
				errorMessage: '邮件格式错误'
			}
		]
	}
};

const login = () => {
	myForm.value
		.validate()
		.then((res) => {
			postRequest('api/mobile/elogin', loginModel)
				.then((res) => {
					console.log(res);
					if (res.success) {
						const userinfo = res.data.userinfo;
						userStore.setToken(userinfo.token);
						userStore.fillUser(userinfo);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		})
		.catch((err) => {
			console.log(err);
		});
};

function toRegister() {
	uni.navigateTo({
		url: '/pages/index/register',
		success(res) {
			console.log(res);
		},
		fail(res) {
			console.log(res);
		}
	});
}

async function authWeChatAsync() {
	const userProfile = await uni.getUserProfile({
		lang: 'zh_CN',
		desc: '授权获得更多服务'
	});
	const { avatarUrl, nickName } = userProfile.userInfo;

	const loginRes = await uni.login({
		provider: 'weixin'
	});

	const resp = await uni.request({
		url: `${wxConfig.jscode2session}?appid=${wxConfig.appid}&secret=${wxConfig.secret}&js_code=${loginRes.code}&grant_type=authorization_code`
	});

	const data = resp.data as any;
	const userinfo = {
		openid: data.openid,
		avatarUrl,
		nickName
	};
	return userinfo;
}

function authWeChat() {
	uni.showLoading({
		title: '授权进行中...'
	});
	authWeChatAsync()
		.then((userinfo) => {
			console.log('WeChatUserinfo', userinfo);
			userStore.setWxUserinfo(userinfo);
			uni.switchTab({
				url: '/pages/my/my'
			});
		})
		.catch((e) => {
			console.error('授权失败', e);
		})
		.finally(() => {
			uni.hideLoading();
		});
}
</script>

<style scoped>
.myForm {
	padding: 40px 10px 0 10px;
	margin: 10px;
	height: calc(80vh - 240px);
	box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
	border-radius: 0 0 10px 10px;
}
.logo-extra {
	display: flex;
	margin-top: 10upx;
}
.logo-extra button {
	width: 100%;
}

.logo {
	width: 100%;
	height: 240px;
	display: flex;
	justify-content: center;
	align-items: center;
}

image {
	width: 100px;
	height: 100px;
}
</style>
