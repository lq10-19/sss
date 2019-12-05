<template>
  <!-- 拜年对象打赏红包成功 -->
  <div class="main">
    <img class="flower" src="http://bqyx-qiniu.bqrzzl.com/newyear/flower.png">
    <div class="zs-left zs"></div>
    <div class="zs-right zs"></div>
    <div class="content" :style="{'min-height': windowHeight+'rpx'}">
      <div class="section">
        <div class="title">红包打赏成功啦！</div>
        <div class="msg">红包将随机分配给小伙伴们，祝您新年快乐、 万事胜意！</div>
        <div class="btn-go-home" @click="goNewYearHome">去活动主页看看</div>
      </div>
    </div>
    <div class="footer">
      <img class="img" mode="widthFix" src="http://bqyx-qiniu.bqrzzl.com/newyear/footer-bg.png">
    </div>
  </div>
</template>
<script>
import { path, getLoginInfo, getSystemInfo } from "@/utils/index";
import { setTimeout } from "timers";
export default {
  components: {},
  data() {
    return {
      windowHeight: ""
    };
  },
  onLoad(options) {},
  onShow() {
    let systemInfo = getSystemInfo();
    console.log(systemInfo);
    this.windowHeight = systemInfo.windowHeight * 2 - 60;
  },
  methods: {
    goNewYearHome() {
      wx.navigateTo({
        url: "/pages/service/newYear/main"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  background: #d22a2a;
  overflow: hidden;
  position: relative;
  min-height: 100%;
  .content {
    margin: 0.3rem;
    overflow: hidden;
    background: url("http://bqyx-qiniu.bqrzzl.com/newyear/bg.png") repeat-y top;
    background-size: 100% 7.5rem;
    border-radius: 0.06rem;
    .section {
      margin-top: 80rpx;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      .title {
        color: #d22a2a;
        font-size: 49rpx;
      }
      .msg {
        margin-top: 47rpx;
        text-indent: 48rpx;
      }
      .btn-go-home {
        color: #d22a2a;
        font-size: 30rpx;
        font-weight: bold;
        text-align: center;
        line-height: 86rpx;
        margin-top: 80rpx;
        width: 580rpx;
        height: 86rpx;
        background: url("http://bqyx-qiniu.bqrzzl.com/newyear/btn2@2x.png")
          repeat-y top;
        background-size: 580rpx 86rpx;
      }
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