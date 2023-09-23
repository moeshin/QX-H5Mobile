<template>
    <h1 v-text="title"></h1>
    <h2 v-html="subTitle"></h2>
    <p><img :src="src"></p>
    <p><button @click="onClick">点赞：{{ count }}</button></p>
</template>
<script lang="ts">
export default {
    data: () => ({
        title: 'Home',
        subTitle: '<i>首页</i>',
        src: 'https://github.com/mkrl/misbrands/raw/master/github.svg',
        count: 0,
    }),
    methods: {
        onClick() {
            ++this.count;
        },
    },
}
</script>