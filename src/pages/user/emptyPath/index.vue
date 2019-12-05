<template>
  <div class="bigbox">
    <p>点击"进入活体检测"会进入第三方小程序,为完成检测请授权第三方小程序</p>
    <div>
      <img src="http://bqyx-qiniu.bqrzzl.com/huotijiance.png" />
    </div>
    <!-- OCR小程序 app-id wx7ccfa42a2a641035 -->
    <!-- <navigator
      v-if="!flag"
      class="btn"
      target="miniProgram"
      open-type="navigate"
      app-id="wx7ccfa42a2a641035"
      path="pages/pre"
      :extra-data="extraData"
      version="release"
    >进入活体检测</navigator>
    <button class="btn" @click="goLiveBodyBack" v-if="flag">继续申请</button> -->
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
      flag: false
    };
  },
  onLoad(query) {
    console.log(this.$root.$mp.query, 818);
    if(this.$root.$mp.query){
      this.extraData = this.$root.$mp.query;
    };
    this.goLiveBody();
  },
  onShow(options) {
    
  },
  methods: {
    goLiveBody() {
      let str = queryString.stringify(this.extraData);
      wx.redirectTo({
        url:
          "/pages/user/liveBody/main?" + str
      });
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
