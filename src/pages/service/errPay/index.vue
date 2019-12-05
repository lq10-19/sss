<template>
    <div class="main">
        <div class="header">
            <img src="/static/oil/icon_fail@3x.png" alt="" class="header_img">
            <span class="header_span">充值失败！</span>
            <p class="header_p">您支付的金额会原路退回至您的账户中 </p>
        </div>
        <div class="text">
            <ul class="left">
                <li class="left_li">加油卡号</li>
                <li class="left_li">充值金额</li>
                <li class="left_li">支付金额</li>
                <li class="left_li">充值时间</li>
            </ul>
            <ul class="right">
                <li class="right_li">ninin</li>
                <li class="right_li">ninin</li>
                <li class="right_li">ninin</li>
                <li class="right_li">ninin</li>
            </ul>
        </div>
        <div class="button">
            <button class="btn1" @click="goRecord">查看充值记录</button>
            <button class="btn2">继续充值</button>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {

        }
    },
    methods: {
        goRecord () {
            wx.navigateTo({
                url: "/pages/service/record/main"
            });
        },
    }
}
</script>

<style lang="scss" scoped>
$jbColorTop: rgba(255,224,86,1);
$jbColorBottom: #FFCC00;
    .main {
        height: 100%;
        height: 100vh;
        background-color: #F2F3F5;
        .header {
            width: 100%;
            height: 126px;
            .header_img {
                width: 19px;
                height: 19px;
                position: absolute;
                margin-top: 35px;
                margin-left: 136px;
            }
            .header_span {
                font-size: 17px;
                color: #000000;
                font-weight: bold;
                position: absolute;
                margin-top: 33px;
                margin-left: 167px;
            }
            .header_p {
                font-size: 15px;
                color: #000000;
                position: absolute;
                margin-top: 78px;
                margin-left: 60px;
            }
        }
        .text {
            display: flex;
            background-color: #fff;
            .left {
                flex-direction: column;
                .left_li {
                    text-align: center;
                    line-height: 50px;
                    font-size: 16px;
                    color: #666666;
                    margin-left: 15px;
                }
            }
            .right {
                flex: 1;
                .right_li {
                    text-align: left;
                    line-height: 50px;
                    font-size: 16px;
                    color: #010101;
                    margin-left: 30px;
                }
            }
            ul {
                list-style: none;
                li {
                    height: 50px; 
                }
            }
        }
        .button {
            display: flex;
            flex-direction: row;
            margin-top: 40px;
            .btn1 {
                width: 135px;
                height: 40px;
                border-radius: 20px;
                text-align: center;
                border: 1px solid #999999;
                color: #999;
                font-size: 16px;
            }
            .btn2 {
                width: 135px;
                height: 40px;
                border-radius: 20px;
                text-align: center;
                font-size: 16px;
                color: #000;
                background: linear-gradient(176deg,$jbColorTop,$jbColorBottom)
            }
        }
    }
</style>
