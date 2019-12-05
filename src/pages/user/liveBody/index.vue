<template>
  <div class="bigbox" v-if="hideBody">
    <p>点击"进入活体检测"会进入第三方小程序,为完成检测请授权第三方小程序</p>
    <div>
      <img src="http://bqyx-qiniu.bqrzzl.com/huotijiance.png" />
    </div>
    <!-- OCR小程序 app-id wx7ccfa42a2a641035 -->
    <navigator
      v-if="!flag"
      class="btn"
      target="miniProgram"
      open-type="navigate"
      app-id="wx7ccfa42a2a641035"
      path="pages/pre"
      :extra-data="extraData"
      version="release"
      @click="hideBtn"
    >进入活体检测</navigator>
    <button class="btn" @click="goLiveBodyBack" v-if="flag">继续申请</button>
  </div>
</template>

<script>
import queryString from "@/utils/query-string";
import { path, dataConfig } from "@/utils/index";
export default {
  components: {},
  data() {
    return {
      extraData: {
        webankAppId: "",
        version: "1.0.0",
        nonce: "",
        orderNo: "",
        h5faceId: "",
        resultType: "",
        userId: "",
        sign: ""
      },
      backData: {},
      flag: false,
      hideBody: false,
    };
  },
  onLoad(query) {
    console.log(this.$root.$mp.query, 808);
    this.extraData = this.$root.$mp.query;
    //this.extraData.resultType = null
    console.log(this.extraData.resultType);
  },
  onShow(options) {
    if (wx.getStorageSync("goEmptyPath") != 2) {
      //跳转空页面
      wx.setStorageSync("goEmptyPath", "2");
      this.goEmptyPath();
      return
    };
    this.hideBody = true;
    wx.removeStorageSync("goEmptyPath");
    console.log(this.$root.$mp.appOptions.referrerInfo.extraData, 120);
    if (
      this.$root.$mp.appOptions.referrerInfo.extraData &&
      this.$root.$mp.appOptions.referrerInfo.extraData.code == 0
    ) {
      this.backData = this.$root.$mp.appOptions.referrerInfo.extraData;
      this.flag = true;
    }
  },
  methods: {
    goEmptyPath() {
      let str = queryString.stringify(this.extraData);
      wx.redirectTo({
        url: "/pages/user/emptyPath/main?" + str
      });
    },
    goLiveBodyBack() {
      wx.navigateTo({
        url:
          "/pages/user/liveBodyBack/main?backData=" +
          JSON.stringify(this.backData)
      });
    },
    hideBtn() {
      console.log(111111111)
    }
  }
};
</script>

<style lang="scss" scoped>
.bigbox {
  width: 100%;
  p {
    width: 100%;
    color: #fff;
    background-color: red;
    font-size: 22rpx;
    line-height: 36rpx;
    height: 36rpx;
    text-align: center;
  }
  div {
    width: 60%;
    margin: 0 auto;
    margin-top: 150rpx;
    img {
      width: 100%;
    }
  }
  .btn {
    width: 280rpx;
    height: 90rpx;
    background: linear-gradient(
      180deg,
      rgba(254, 235, 167, 1),
      rgba(255, 204, 0, 1)
    );
    border-radius: 45rpx;
    margin: 50rpx auto;
    text-align: center;
    font-size: 36rpx;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(0, 0, 0, 1);
    line-height: 90rpx;
  }
}
</style>
