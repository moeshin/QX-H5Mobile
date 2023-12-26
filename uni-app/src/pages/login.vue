<template>
  <view>
    <view class="logo">
      <image src="@/static/logo.svg"></image>
    </view>
    <uni-forms
      class="myForm"
      ref="myForm"
      :modelValue="loginModel"
      :rules="rules"
    >
      <uni-forms-item name="email">
        <uni-easyinput
          class="input"
          v-model="loginModel.email"
          placeholder="请输入电子邮箱"
          suffix-icon="email"
        />
      </uni-forms-item>
      <uni-forms-item name="password">
        <uni-easyinput
          class="input"
          type="password"
          v-model="loginModel.password"
          placeholder="请输入密码"
        />
      </uni-forms-item>
      <button type="primary" @click="login">用户登录</button>
      <view class="logo-extra">
        <button type="default" size="mini">忘记密码</button>
        <button type="default" size="mini" @click="toRegister">用户注册</button>
      </view>
    </uni-forms>
  </view>
</template>
<script lang="ts">
export interface LoginQuery {
  fromURL: string;
  fromTabbar?: boolean;
}

export function redirectToLogin(fromURL: string, fromTabbar: boolean = false) {
  uni.redirectTo({
    url:
      '/pages/login?' +
      qs.stringify({
        fromURL,
        fromTabbar,
      } as LoginQuery),
  });
}
</script>
<script setup lang="ts">
import qs from 'qs';
import * as api from '@/http/api';
import { useUserStore } from '@/store/user';
import { uniLoaddingPromise } from '@/utils/promise';
import { onLoad } from '@dcloudio/uni-app';
import type { UniFormsInstance, UniFormsRules } from '@uni-helper/uni-ui-types';
import { reactive, ref } from 'vue';

const loginQuery: LoginQuery = {
  fromURL: '/pages/my',
  fromTabbar: false,
};

const userStore = useUserStore();
const myForm = ref<UniFormsInstance>();

const loginModel = reactive({
  email: '',
  password: '',
});
const rules: UniFormsRules = {
  email: {
    rules: [
      {
        required: true,
        errorMessage: '必填项',
      },
      {
        format: 'email',
        errorMessage: '邮件格式错误',
      },
    ],
  },
};

function gotoBack() {
  if (loginQuery.fromTabbar) {
    uni.switchTab({
      url: loginQuery.fromURL,
    });
  } else {
    uni.redirectTo({
      url: loginQuery.fromURL,
    });
  }
}

function login() {
  myForm.value
    ?.validate?.()
    ?.then(() => {
      uniLoaddingPromise(
        api.login(loginModel.email, loginModel.password).then((res) => {
          console.log(res);
          userStore.userinfo = res.userinfo;
          gotoBack();
        }),
      );
    })
    .catch((err: any) => {
      console.log(err);
    });
}

function toRegister() {
  uni.navigateTo({
    url: '/pages/register',
  });
}

onLoad((query) => {
  Object.assign(loginQuery, query);
  console.log(loginQuery);
});
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
