<template>
  <div class="bigbox">
    <!--头部-->
    <div class="header">
      
    </div>
    <!-- 签到 -->
    <div class="module-wrap">
      <p class="title">每邀请一个好友加入佰仟易行双方均可获得</p>
      <div class="box">
        <div class="left">
          <h1>现金红包</h1>
          <p>现金红包会入账到余额，满10元即可提现，上不封顶。</p>
        </div>
        <div class="right">
          <h1>V币奖励</h1>
          <p>V币奖励会入账V币账户，V币可在V币商城消费或兑换商品。</p>
        </div>
      </div>
    </div>
    <!-- 立即邀请 -->
    <button v-if="myself" open-type="share" plain>立即邀请</button>
    <!-- 立即加入 -->
    <button v-if="!myself" plain @click="goHome">立即加入</button>
  </div>
</template>

<script>
import utils from "@/utils/index";
import {
  path,
  dataConfig,
  getUserInfo,
  getLoginInfo,
  isBindPhone,
  event
} from "@/utils/index";

export default {
  data() {
    return {
      myself: true, //默认自己打开
      inviterUserId: null, //邀请人id
      taskId: null, //邀请任务id
    };
  },
  onLoad(params) {
    //授权登陆
    if (!getLoginInfo()) {
      const url = "/pages/login/main";
      wx.navigateTo({
        url
      });
      return;
    }
    // const value = wx.getStorageSync("systemInfo");
    // this.height = value.windowHeight;
    // this.width = value.windowWidth;
    // if(params.myUserId){
    //   if(params.myUserId == getLoginInfo().userid){
    //   //自己点开分享链接
    //   this.myself = true;
    //   }else if(params.myUserId != getLoginInfo().userid){
    //     //他人点开分享链接
    //     this.myself = false;
    //     this.taskId = params.taskId;
    //     this.inviterUserId = params.inviterUserId;
    //   }
    // }
  },
  onShow() {
    //console.log(this.$root.$mp.query.taskId)
    if(this.$root.$mp.query.taskId){
      this.taskId = this.$root.$mp.query.taskId;
      this.inviterUserId = this.$root.$mp.query.inviterUserId;
    }
    this.myself = true;
    if(this.$root.$mp.query.myUserId){
      if(this.$root.$mp.query.myUserId == getLoginInfo().userid){
      //自己点开分享链接
      this.myself = true;
      }else if(this.$root.$mp.query.myUserId != getLoginInfo().userid){
        //他人点开分享链接
        this.myself = false;
      }
    }
  },
  onShareAppMessage(res) {
    this.choose = false;
    let myUserId = getLoginInfo().userid;
    return {
      title: "【佰仟易行】佰仟行，伴你行！",
      path: `/pages/service/vb/vbShare/main?myUserId=${myUserId}&taskId=${this.taskId}&inviterUserId=${this.inviterUserId}`,
      imageUrl: "http://bqyx-qiniu.bqrzzl.com/VB@2x.png",
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  methods: {
    //新用户回到首页
    goHome() {
      //console.log(this.taskId,this.inviterUserId)
      wx.reLaunch({
        url: `/pages/home/main?taskId=${this.taskId}&inviterUserId=${this.inviterUserId}`
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.bigbox {
  height: 100%;
  padding-bottom: 46rpx;
}
.header {
  width: 100%;
  height: 335rpx;
  background-image: url('http://bqyx-qiniu.bqrzzl.com/banner2@2x.png');
  background-size: 100% 100%;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  overflow: hidden;
}
.module-wrap{
  height: 330rpx;
  background: #fff;
  border-radius: 16rpx;
  margin: 0 10rpx;
  margin-top: 20rpx;
  position: relative;
  overflow: hidden;
  .title{
    margin-left: 28rpx;
    font-size: 26rpx;
    font-weight: 500;
  }
  .box{
    display: flex;
    justify-content: space-around;
    margin-top: 20rpx;
    div{
      width: 330rpx;
      height: 180rpx;
      border-radius: 16rpx;
      color: #fff;
      h1{
        font-size: 31rpx;
        margin-top: 20rpx;
        margin-left: 20rpx;
        font-weight: 500;
      }
      p{
        font-size: 20rpx;
        margin-top: 20rpx;
        margin-left: 20rpx;
        width: 195rpx;
        font-weight: 400;
      }
    }
    .left{
      background-image: url("http://bqyx-qiniu.bqrzzl.com/banner_s1@2x.png");
      background-size: 100% 100%;
    }
    .right{
      background-image: url("http://bqyx-qiniu.bqrzzl.com/banner_s2@2x.png");
      background-size: 100% 100%;
    }
  }
}
button{
  width: 580rpx;
  height: 88rpx;
  background: linear-gradient(176deg,rgba(254,235,167,1),rgba(255,204,0,1));
  border-radius: 44rpx;
  border: none;
}
</style>
