<template>
  <view>
    <uni-notice-bar
      show-icon
      scrollable
      text="uni-app 版正式发布，开发一次，同时发布iOS、Android、H5、微信小程序、支付宝小程序、百度小程序、头条小程序等7大平台。"
    />
    <uni-grid :column="4" :highlight="true" @change="change">
      <uni-grid-item v-for="(item, id) in navigatorBars" :index="id" :key="id">
        <view class="grid-item-box" style="background-color: #fff">
          <uni-icons :type="item.icon" :size="40" color="#777" />
          <text class="text">{{ item.name }}</text>
        </view>
      </uni-grid-item>
    </uni-grid>
    <navigator url="/pages/crop">crop</navigator>
    <navigator url="/pages/weixin">微信授权</navigator>
    <navigator url="/pages/mqtt">MQTT</navigator>
  </view>
  <button type="primary"></button>
</template>

<script setup lang="ts">
import type { UniIconsProps } from '@uni-helper/uni-ui-types';

const navigatorBars: {
  id: number;
  name: string;
  icon: UniIconsProps['type'];
}[] = [
  { id: 1, name: 'ICPC联盟', icon: 'vip' },
  { id: 2, name: '竞赛', icon: 'medal' },
  { id: 3, name: '社团', icon: 'staff' },
  { id: 4, name: '面试宝典', icon: 'gift' },
];

function change(e: any) {
  console.log(e);
}
</script>

<style>
.grid-item-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
