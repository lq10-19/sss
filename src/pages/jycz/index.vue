<template>
  <div class="bigbox">
    <!-- <img src="http://bqyx-qiniu.bqrzzl.com/banner4@2x.png" @click="jumpToUp()"> -->
    <img src="http://bqyx-qiniu.bqrzzl.com/banner5@2x.png" @click="jumpToDown()">
  </div>
</template>

<script>
import {
  path,
  dataConfig,
  getUserInfo,
  getLoginInfo,
  isBindPhone,
  showLoading,
  apiFail,
  isHuaWei,
  event
} from "@/utils/index";
import { cityList } from "@/utils/djcx/city";
import { constants } from "zlib";
export default {
  components: {},
  data() {
    return {};
  },
  onLoad(query) {},
  onShow() {
    if (!getLoginInfo()) {
      wx.switchTab({
        url: "/pages/home/main"
      });
      return;
    }
    if (!isBindPhone()) {
      wx.navigateTo({
        url: "/pages/login/bindPhone/main"
      });
      return;
    }
  },
  onShareAppMessage() {
    // return {
    //   title: "佰仟易行",
    //   path: "/pages/service/service/main",
    //   success: function(res) {
    //     // 转发成功
    //   },
    //   fail: function(res) {
    //     // 转发失败
    //   }
    // };
  },
  methods: {
    //跳转车主邦
    jumpToUp() {
      wx.navigateTo({
        url: `/pages/jycz/czb/main`
      });
    },
    jumpToDown() {
      wx.navigateTo({
        url: "/pages/service/oil/main"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.bigbox {
  background: #ffffff;
  width: 100%;
}
img {
  width: 750rpx;
  height: 420rpx;
}
</style>
