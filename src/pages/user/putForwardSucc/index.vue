<template>
    <div class="main">
        <div class="top">                
            <img src="/static/img/add_success.png" alt="">
            <p>恭喜你，提交成功</p>
        </div>
        <div class="bottom">
            <div class="left">
                <img src="/static/redBag/across@2x.png" alt="" class="round_top">
                <div class="line"></div>
                <img src="/static/redBag/across@2x.png" alt="" class="round_bottom">
            </div>
            <div class="right">
                <div class="right_top">
                    <p class="p_title">审核通过</p>
                    <p class="p_text">{{paymentTime}}</p>
                </div>
                <div class="right_bottom">
                    <p class="p_title">恭喜你，提交成功</p>
                    <p class="p_text">已提交系统处理，请留意微信零钱内余额</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            paymentTime: "",
        }
    },
    onLoad (options) {
        console.log(options);
        this.paymentTime = options.paymentTime;
    },
    methods: {
        
    }
}
</script>

<style lang="scss" scoped>
    .main {
        height: 100%;
        height: 100vh;
        .top {
            width: 690rpx;
            height: 592rpx;
            margin: auto;
            border-bottom: 2rpx solid #DDDDDD;
            img {
                width: 180rpx;
                height: 180rpx;
                margin-top: 110rpx;
                margin-left: 256rpx;
            }
            p {
                text-align: center;
                font-size: 32rpx;
                font-weight: Regular;
                margin-top: 60rpx;
                color: #000000; 
            }
        }
        .bottom {
            display: flex;
            flex-direction: row;
            .left {
                width: 148rpx;
                height: 100%;
                text-align: right;
                .round_top {
                    width: 30rpx;
                    height: 30rpx;
                    margin-top: 70rpx;
                }
                .line {
                    width: 4rpx;
                    height: 152rpx;
                    background: #F9B8A8;
                    margin-left: 130rpx;
                    margin-top: -28rpx;
                    margin-bottom: -28rpx;
                }
                .round_bottom {
                    width: 30rpx;
                    height: 30rpx;
                }
            }
            .right {
                margin-left: 28rpx;
                .right_top {
                    margin-top: 60rpx;
                    .p_title {
                    font-size: 32rpx;
                    // font-weight: bold;
                    color: #000000;
                    }
                    .p_text {
                        font-size: 28rpx;
                        color: #DDDDDD;
                        margin-top: 16rpx;
                    }
                }
                    .right_bottom {
                        margin-top: 54rpx;
                        .p_title {
                        font-size: 32rpx;
                        // font-weight: bold;
                        color: #000000;
                    }
                    .p_text {
                        font-size: 28rpx;
                        color: #DDDDDD;
                        margin-top: 16rpx;
                    }
                }
                
            }
        }
    }
</style>
