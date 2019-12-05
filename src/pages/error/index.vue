<template>
    <div @click="btn"></div>
</template>

<script>
export default {
    data () {
        return {
            
        }
    },
    onLoad () {
       this.btn();
    },
    methods : {
        btn () {
            wx.navigateTo({
                url: "/pages/wxpay/main"
            });
            wx.showToast({
                title: "加载中...",
                image: "/static/icon/loading.gif",
                duration: 1500
            });
        }
    }
}
</script>


<style lang="scss" scoped>
    .main {
        text-align: center;
    }
    .btn {
        width: 300rpx;
        height: 80rpx;
        background: #FF5C5D;
        color: #fff;
    }
</style>
