<template>
    <div class="main">
        <img src="http://bqyx-qiniu.bqrzzl.com//mp/app%E7%BB%94%E7%97%8F%E9%8D%94%E2%95%81%E5%A7%8F%E9%8E%B4%E6%84%AC%E5%A7%9B@2x.png" alt="" class="bg">
        <img src="/static/redBag/rule@2x.png" alt="" class="rule" @click="getRule">
        <img src="/static/redBag/btn@2x.png" alt="" class="btn" @click="getEnjoy">
        <div class="desc">
            <p class="title">邀请好友最高可领取</p>
            <p class="value"><span class="money">40</span><span class="company">元</span></p>
        </div>
        <div class="ruleText" v-show="goRule">
            <div class="ruleText_main">
                <div class="title">
                    <div class="text">
                        <span class="title-line"></span>
                        <span class="title-text">活动规则</span>
                        <span class="title-line"></span>
                    </div>
                </div>
                <div class="ruleText_text">
                    <p>1、用户授权登录即可获得1元红包，每成功邀请一位好友授权登录，用户与好友各得1元红包；</p>
                    <p>2、红包金额满10元即可提现；</p>
                    <p>3、每位用户最高可提现金额为40元；</p>
                    <p>4、提现须在活动有效时段内操作，过期不能提现；</p>
                    <p>5、活动结束后，账户内红包将清零；</p>
                    <p>6、本次活动最终解释权归佰仟融资租赁有限公司所有。</p>
                </div>
            </div>
            <img src="/static/redBag/x.png" alt="" class="close" @click="getClose">
            <div class="enjoy">
                
            </div>
        </div>
        <div class="enjoy" v-show="goEnjoy">
            <div class="enjoy_main">
              <div class="button">
                <button open-type="share">
                    <img src="/static/redBag/weixin@2x.png" class="weChat">
                    <p>微信好友</p>
                </button>
                <button  @click="enjoyFriend">
                    <img src="/static/redBag/pengyouquan@2x.png" class="friend">
                    <p>朋友圈</p>
                </button>
              </div>
              <div class="buttom" @click="know">
                  我知道了
              </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getLoginInfo } from "@/utils/index";
export default {
  data() {
    return {
      goRule: false,
      goEnjoy: false,
      shareInfo: {}
    };
  },
  onload() {},
  onShow() {
    this.goEnjoy = false;
  },
  mounted() {
    this.shareInfo = {
      title: "邀请好友领红包",
      path: "/pages/home/main"
    };
  },
  onShareAppMessage(params) {
    let loginInfo = getLoginInfo();
    let userid = loginInfo.userid;
    return {
      title: "邀请好友领红包",
      path: `/pages/home/main?aidUserId=${userid}`,
      imageUrl: "http://bqyx-qiniu.bqrzzl.com/poster-new.png",
    };
  },
  methods: {
    getRule() {
      this.goRule = true;
    },
    getClose() {
      this.goRule = false;
    },
    getEnjoy() {
      this.goEnjoy = true;
    },
    know() {
      this.goEnjoy = false;
    },
    enjoyFriend() {
      wx.navigateTo({
        url: "/pages/service/poster/main"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  overflow: hidden;
  width: 100%;
  height: 100%;
  height: 100vh;
  .bg {
    width: 100%;
    height: 100%;
    position: fixed;
  }
  .rule {
    width: 47px;
    height: 45px;
    position: absolute;
    margin-top: 90px;
    margin-left: 329px;
  }
  .btn {
    width: 370rpx;
    height: 78rpx;
    position: absolute;
    bottom: 26%;
    margin-left: 190rpx;
  }
  .desc {
    position: fixed;
    width: 412rpx;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
    // text-align: center;
    position: absolute;
    bottom: 55%;
    margin-left: 170rpx;
    p {
      text-align: left;
    }
    .title {
      color: #ff455c;
      font-size: 22rpx;
      text-align: center;
      margin-top: 100rpx;
    }
    .value {
      display: flex;
      justify-content: center;
      align-content: center;
      flex-direction: row;
      .money {
        font-size: 110rpx;
        font-weight: 600;
        margin-left: 10rpx;
      }
      .company {
        margin-top: 70rpx;
      }
      color: #ff455c;
    }
  }
  .ruleText {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    overflow: hidden;
    .ruleText_main {
      background-color: #ffffff;
      width: 325px;
      height: 376px;
      border-radius: 5px;
      margin: auto;
      margin-top: 100px;
      .title {
        text-align: center;
        display: block;
        position: relative;
        width: 60%;
        margin: 0 auto;
        .text {
          padding-top: 74rpx;
        }
        .title-line {
          display: inline-block;
          width: 108rpx;
          border-top: 1px solid rgba(0, 0, 0, 0.8);
          position: relative;
          top: -10rpx;
        }
        .title-text {
          margin-left: 10rpx;
          margin-right: 10rpx;
          font-size: 34rpx;
          font-weight: 600;
        }
      }
      .ruleText_text {
        margin-top: 74rpx;
        margin: 74rpx 45rpx;
        font-size: 28rpx;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        p {
          margin-bottom: 16rpx;
        }
      }
    }
  }
  .close {
    width: 24px;
    height: 24px;
    position: relative;
    margin-top: 26px;
    margin-left: 176px;
  }
  .enjoy {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    overflow: hidden;
    .enjoy_main {
      position: fixed;
      width: 100%;
      height: 316rpx;
      background-color: #ffffff;
      bottom: 0;
      padding-top: 100rpx;
      .button {
        width: 100%;
        display: flex;
        flex-direction: row;
        button {
          width: 50%;
          height: 100px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          border-radius: 0;
          img {
            margin: 0 auto;
            padding-top: 18rpx;
          }
        }
        button::after {
          border: none;
        }
        p {
          font-size: 32rpx;
        }
      }
      .buttom {
        text-align: center;
        font-size: 34rpx;
        line-height: 34rpx;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        padding-top: 48rpx;
      }
    }
    .weChat {
      width: 80rpx;
      height: 80rpx;
    }
    .friend {
      width: 80rpx;
      height: 80rpx;
    }
  }
}
</style>
