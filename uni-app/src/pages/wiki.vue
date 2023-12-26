<template>
  <uni-search-bar
    :style="{ backgroundColor: '#1296db' }"
    @confirm="search"
    cancel-button="none"
    :focus="true"
    v-model="searchValue"
  >
  </uni-search-bar>
  <GridLayout class="catogory">
    <scroll-view class="scroll-view_H" :scroll-x="true">
      <view
        v-for="cat in cats"
        :class="['scroll-view-item_H', cat.checked ? 'active' : null]"
        @click="
          () => {
            if (cat === currentCat) {
              return;
            }
            if (currentCat) {
              currentCat.checked = false;
            }
            currentCat = cat;
            cat.checked = true;
            console.log({...cat});
          }
        "
      >
        <text>{{ cat.catName }}</text>
      </view>
    </scroll-view>
    <template #append>
      <uni-icons
        :type="isMore ? 'bottom' : 'top'"
        class="uni-mx-2"
        @click="
          () => {
            isMore = !isMore;
          }
        "
      />
    </template>
  </GridLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import * as api from '@/http/api';
import { onShow, onLoad } from '@dcloudio/uni-app';
import { useUserStore } from '@/store/user';
import { redirectToLogin } from './login.vue';
import GridLayout from '@/components/GridLayout.vue';

const { console } = window;

type Cat = api.ArticleCat & {
  checked?: boolean;
};

const userStore = useUserStore();

const searchValue = ref<string>();
const isMore = ref(true);
const cats = ref<Cat[]>();
let currentCat: Cat | undefined = undefined;

function search(e: any) {
  console.log(e);
}

onShow(() => {
  if (!userStore.isLogin) {
    redirectToLogin('/pages/wiki', true);
  }
});

onLoad(() => {
  if (!userStore.isLogin) {
    return;
  }
  api.getArticleCatAll().then((data) => {
    cats.value = data.articleCats;
  });
});
</script>

<style scoped lang="scss">
::v-deep ::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.catogory {
  height: 60rpx;
  border-bottom: 1upx solid #ccc;

  .active {
    background-color: #ddd;
  }
}

.scroll-view_H {
  white-space: nowrap;
}

.scroll-view-item_H {
  display: inline-block;
  width: 100upx;
  line-height: 60rpx;
  text-align: center;
  font-size: 16rpx;
}
</style>
