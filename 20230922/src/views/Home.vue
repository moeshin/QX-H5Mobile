<template>
    <h1 v-text="title"></h1>
    <h2 v-html="subTitle"></h2>
    <p><img :src="src"></p>
    <p><button @click="onClick">点赞：{{ count }}</button></p>
    <div class="flex-container">
        <div>Box1</div>
        <div>Box2</div>
        <div>Box3</div>
    </div>
</template>
<style scoped lang="less">
.flex-container {
    display: flex;
    height: 50vh;

    > * {
        display: flex;
        height: 100%;
        border: 1px solid;
        justify-content: center;
        align-items: center;
    }

    >:nth-child(1) {
        flex-basis: 200px;
        border-color: red;
    }

    >:nth-child(2) {
        flex-grow: 1;
        border-color: yellow;
    }

    >:nth-child(3) {
        flex-basis: 200px;
        border-color: green;
    }
}
</style>
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