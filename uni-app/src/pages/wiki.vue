<template>
  <uni-search-bar
    :style="{ backgroundColor: '#1296db' }"
    @confirm="search"
    cancel-button="none"
    :focus="true"
    v-model="searchValue"
  >
  </uni-search-bar>
  <view class="catogory">
    <scroll-view
      class="scroll-view_H"
      :scroll-x="true"
      :show-scrollbar="true"
    >
      <view class="scroll-view-item_H">A</view>
      <view class="scroll-view-item_H">B</view>
      <view class="scroll-view-item_H">C</view>
      <view class="scroll-view-item_H">D</view>
      <view class="scroll-view-item_H">E</view>
      <view class="scroll-view-item_H">F</view>
      <view class="scroll-view-item_H">A</view>
      <view class="scroll-view-item_H">B</view>
      <view class="scroll-view-item_H">C</view>
      <view class="scroll-view-item_H">D</view>
      <view class="scroll-view-item_H">E</view>
      <view class="scroll-view-item_H">F</view>
      <view class="scroll-view-item_H">JAVA</view>
      <view class="scroll-view-item_H">A</view>
      <view class="scroll-view-item_H">B</view>
      <view class="scroll-view-item_H">C</view>
      <view class="scroll-view-item_H">D</view>
      <view class="scroll-view-item_H">E</view>
      <view class="scroll-view-item_H"></view>
    </scroll-view>
    <uni-icons :type="isMore ? 'bottom' : 'top'" class="more"></uni-icons>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const searchValue = ref<string>();
const isMore = ref(false);

function search(e: any) {
  console.log(e);
}

</script>

<style scoped>
.catogory {
  position: relative;
}

.scroll-view_H {
  white-space: nowrap;
  width: 100%;
  height: 60rpx;
  border-bottom: 1upx solid #ccc;
}

::v-deep ::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.scroll-view-item_H {
  display: inline-block;
  width: 100upx;
  line-height: 60rpx;
  text-align: center;
  font-size: 16rpx;
}

.more {
  position: absolute;
  top: 10upx;
  right: 0;
  background-color: #f5f5f5;
}
</style>
