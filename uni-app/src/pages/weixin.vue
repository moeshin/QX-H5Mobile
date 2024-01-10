<template>
  <view class="container">
    <template v-if="weixinStore.wxUserinfo">
      <image
        class="avatar"
        :src="weixinStore.wxUserinfo.avatarUrl"
        mode="aspectFit"
      />
      <view class="uni-my-8">
        <text>{{ weixinStore.wxUserinfo.nickName }}</text>
      </view>
      <button
        type="warn"
        size="mini"
        @click="
          () => {
            weixinStore.wxUserinfo = undefined;
          }
        "
      >
        退出
      </button>
    </template>
    <template v-else>
      <button type="primary" @click="auth">微信授权</button>
    </template>
  </view>
</template>
<script setup lang="ts">
import { useWeixinStore, type WxUserinfo } from '@/store/weixin';
import { localConfig } from '@/config/local';

const { wx: wxConfig } = localConfig;

const weixinStore = useWeixinStore();

async function authAsync(): Promise<WxUserinfo> {
  // 获取头像需要基础库 2.26.2 以下版本
  const userProfile = await uni.getUserProfile({
    lang: 'zh_CN',
    desc: '授权获得更多服务',
  });
  const { avatarUrl, nickName } = userProfile.userInfo;

  const loginRes = await uni.login({
    provider: 'weixin',
  });

  const resp = await uni.request({
    url: `${wxConfig.jscode2session}?appid=${wxConfig.appid}&secret=${wxConfig.secret}&js_code=${loginRes.code}&grant_type=authorization_code`,
  });

  return {
    openid: (resp.data as any).openid,
    avatarUrl,
    nickName,
  };
}

function auth() {
  uni.showLoading({
    title: '授权进行中...',
  });
  authAsync()
    .then((userinfo) => {
      console.log('WeChatUserinfo', userinfo);
      weixinStore.wxUserinfo = userinfo;
    })
    .catch((e) => {
      console.error('授权失败', e);
      uni.showToast({
        title: '授权失败：' + e,
        icon: 'none',
      });
    })
    .finally(() => {
      uni.hideLoading();
    });
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.avatar {
  width: 128rpx;
  height: 128rpx;
}
</style>
