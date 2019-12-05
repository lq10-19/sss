<template>
    <div class="main">
        <ul v-for="item in carModels" :key="item" class="main_title">
            <li class="main_li" @click="goCarList (item.brandName)"><img :src="item.imgAddress" alt="" class="main_li-img"><p class="main_li-p">{{item.brandName}}</p></li>
        </ul>
    </div>
</template>

<script>
import {
  path,
  dataConfig,
  getLoginInfo,
  showLoading,
  apiFail
} from "@/utils/index";
export default {
    data () {
        return {
            carModels : ""
        }
    },
    onLoad () {
        this.goCar();
    },
    methods: {
        goCar () {
            let loginInfo = getLoginInfo();
            let queryData = { userId: loginInfo.userid };
            let url = path.queryBrandList;
            let promise = this.$fly.post(url, queryData);
            promise.then(data => {
                this.carModels = data;
            });
        },
        goCarList (brandName) {
            wx.navigateTo({
                url: `/pages/service/editCarlnfo/main?brandName=${brandName}`
            });
        }
    }
}
</script>

<style lang="scss" scoped>
    .main {
        height: 100%;
        .main_title {
            .main_li {
                width: 100%;
                height: 100rpx;
                display: flex;
                flex-direction: row;
                border-bottom: 2rpx solid #f2f3f5;
                .main_li-img {
                    width: 100rpx;
                    height: 100rpx;
                    margin-left: 40rpx;
                }
                .main_li-p {
                    line-height: 100rpx;
                    margin-left: 40rpx;
                }
            }
        }
    }
</style>
