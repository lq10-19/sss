<template>
  <div class="main">
    <img class="flower" src="http://bqyx-qiniu.bqrzzl.com/newyear/flower.png">
    <div class="zs-left zs"></div>
    <div class="zs-right zs"></div>
    <div class="content" :style="{'min-height': windowHeight+'rpx'}">
      <div class="section">
        <div class="title">恭喜您获得{{recordInfo.fromNickname}}的新年红包</div>
        <div class="money">{{recordInfo.redPackage}}元</div>
        <div class="tips">已存入您的佰仟易行账户，满10元即可提现</div>
        <div class="btn-putForward" @click="goPutForward">去提现</div>
        <ul class="list">
          <li class="item" v-for="(item,index) in detailList" :key="index">
            <div class="user">
              <div class="avatar-wrapper">
                <img class="avatar" :src="item.avatarUrl">
                <div class="nickName">{{item.nickname}}</div>
              </div>
              <div class="info">
                <div class="name">{{recordInfo.fromNickname}}打赏的红包</div>
                <div class="time">{{item.createTime}}</div>
              </div>
            </div>
            <div class="money">{{item.redPackage}}元</div>
          </li>
        </ul>
      </div>
      <!-- 返回主页 -->
      <div @click="goMinPage" class="goMinPage">
        <p>去活动主页看看</p>
      </div>
    </div>
    <div class="footer">
      <img class="img" mode="widthFix" src="http://bqyx-qiniu.bqrzzl.com/newyear/footer-bg.png">
    </div>
  </div>
</template>
<script>
import { path, getLoginInfo, getSystemInfo, apiFail } from "@/utils/index";
import { setTimeout } from "timers";
export default {
  components: {},
  data() {
    return {
      windowHeight: "",
      recordId: null,
      recordInfo: {},
      detailList: []
    };
  },
  onLoad(options) {
    this.recordId = options.recordId;
    if (!this.recordId) {
      console.error("no recordId");
    }
  },
  onReady() {
    wx.getSystemInfo({
      success: ({ windowHeight }) => {
        this.windowHeight = windowHeight * 2 - 60;
      }
    });
  },
  onShow() {
    let url = path.getRewardDetail + "/" + this.recordId;
    let promise = this.$fly.get(url);
    promise
      .then(data => {
        this.recordInfo = data;
        this.detailList = this.recordInfo.details;
      })
      .catch(e => apiFail(e));
  },
  methods: {
    goPutForward() {
      wx.navigateTo({
        url: "/pages/user/wallet/main"
      });
    },
    goMinPage(){//去活动主页
      wx.navigateTo({
          url: "/pages/service/newYear/main",
          fail:(res)=>{
            wx.redirectTo({
              url: "/pages/service/newYear/main",
            });
          }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  min-height: 100%;
  background: #d22a2a;
  overflow: hidden;
  position: relative;
  .content {
    margin: 0.3rem;
    overflow: hidden;
    background: url("http://bqyx-qiniu.bqrzzl.com/newyear/bg.png") repeat-y top;
    background-size: 100% 7.5rem;
    border-radius: 0.06rem;
    padding-bottom: 2rem;
    .section {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: 80rpx;
      .title {
        font-weight: 600;
      }
      .money {
        color: #d22a2a;
        font-size: 60rpx;
        margin-top: 50rpx;
        font-weight: 600;
      }
      .tips {
        margin-top: 40rpx;
        font-size: 26rpx;
      }
      .btn-putForward {
        width: 580rpx;
        height: 86rpx;
        color: #d22a2a;
        margin-top: 50rpx;
        margin-bottom: 30rpx;
        background: url("http://bqyx-qiniu.bqrzzl.com/newyear/btn2@2x.png")
          repeat-y top;
        background-size: 580rpx 86rpx;
        text-align: center;
        line-height: 86rpx;
      }
      .list {
        display: block;
        width: 100%;
        .item {
          width: 85%;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          padding-bottom: 18rpx;
          border-bottom: 1px #eca168 solid;
          margin-top: 36rpx;
          .user {
            display: flex;
            .avatar-wrapper {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              .avatar {
                display: inline-block;
                width: 70rpx;
                height: 65rpx;
              }
              .nickName {
                font-size: 12px;
                width: 1rem;
                text-overflow: ellipsis; 
                overflow:hidden;                     
                white-space: nowrap;
                text-align: center;
              }
            }

            .info {
              margin-left: 8px;
              font-size: 28rpx;
            }
          }
          .money {
            color: #d22a2a;
            font-size: 36rpx;
            margin-top: 0;
          }
        }
      }
    }
  }
  .goMinPage{
  width:5.8rem;
  height:0.8rem;
  background:#f9c38a;
  box-shadow:0px 0.06rem 0px 0px #f3a967;
  border-radius:0.38rem;
  margin: 0 auto;
  margin-top: 0.69rem;
  p{
    font-size:0.3rem;
    font-weight:700;
    color:rgba(210,42,42,1);
    line-height:0.8rem; 
    text-align: center;
  }
}
  .flower {
    width: 3.78rem;
    height: 1.95rem;
    display: block;
    position: absolute;
    left: 0;
    top: 0;
  }
  .rule-text {
    padding: 0 0.3rem;
    font-size: 0.26rem;
    color: #000;
    margin-top: 1.77rem;
    line-height: 0.5rem;
    font-weight: bold;
  }
  .zs {
    width: 0.55rem;
    height: 100%;
    position: absolute;
    top: 3.5rem;
  }
  .zs-left {
    background: url("http://bqyx-qiniu.bqrzzl.com/newyear/zs-left.png") repeat-y
      top;
    background-size: 0.55rem 6.72rem;
    left: 0rem;
  }
  .zs-right {
    background: url("http://bqyx-qiniu.bqrzzl.com/newyear/zs-right.png")
      repeat-y top;
    background-size: 0.55rem 6.72rem;
    right: 0rem;
  }
  .footer {
    .img {
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
    }
  }
}
</style>
