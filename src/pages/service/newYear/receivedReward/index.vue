<template>
  <!-- 拜年后，收到别人打赏的红包-->
  <div class="main">
    <img class="flower" src="http://bqyx-qiniu.bqrzzl.com/newyear/flower.png">
    <div class="zs-left zs"></div>
    <div class="zs-right zs"></div>
    <div class="content" :style="{'min-height': windowHeight+'rpx'}">
      <div class="section">
        <div class="title">{{recordInfo.fromNickname}}感谢你们的祝福,并给你们发了一个大红包！</div>
        <div class="tips" @click="openRedPacket">点击拆开</div>
        <img
          class="red-img"
          src="http://bqyx-qiniu.bqrzzl.com//newyear/redbag_big@2x.png"
          @click="openRedPacket"
        >
      </div>
    </div>
    <div class="footer">
      <img class="img" mode="widthFix" src="http://bqyx-qiniu.bqrzzl.com/newyear/footer-bg.png">
    </div>
  </div>
</template>
<script>
import { path, getLoginInfo, getSystemInfo } from "@/utils/index";
export default {
  components: {},
  data() {
    return {
      windowHeight: "",
      recordId: "",
      recordInfo: {}
    };
  },
  onLoad(options) {
    this.recordId = options.id;
    if (!this.recordId) {
      this.recordId = "613ee9ecd05c4a488737339698bdbe3d";
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
      })
      .catch(e => apiFail(e));
  },
  methods: {
    /**
     * 打开红包
     */
    openRedPacket() {
      wx.navigateTo({
        url:
          "/pages/service/newYear/receivedReward/open/main?recordId=" +
          this.recordId
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
    .section {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: 80rpx;
      .title {
        text-align: center;
        width: 70%;
        color: #d22a2a;
        font-weight: 600;
      }
      .tips {
        margin-top: 48rpx;
        font-weight: 600;
      }
      .red-img {
        width: 467rpx;
        height: 519rpx;
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
