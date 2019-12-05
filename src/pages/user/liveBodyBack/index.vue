<template>
  <div>
    <web-view :src="src" @load="loadHandler" @error="errorHandler"></web-view>
  </div>
</template>
<script>
import queryString from "@/utils/query-string";
import { getLoginInfo, isBindPhone, link, path } from "@/utils/index";
export default {
  components: {},

  data() {
    return {
      baseSrc: link.cddLiveBodyBack,
      //baseSrc: "https://sitbqyx.bqzulin.com/ctv/?AuthCustomerType=masterMan&recordId=20190530155834119308#/index", //身份验证
      src: "",
      backData: {}
    };
  },
  onLoad(query) {
    this.backData = JSON.parse(this.$root.$mp.query.backData);
    console.log(this.backData, 111);
  },
  onShow() {
    let str = queryString.stringify(this.backData);
    this.src += this.baseSrc + "?" + str;
    console.log(this.src);
  },
  onShareAppMessage() {
    // return {
    //   title: "佰仟易行",
    //   path: "/pages/carSelection/main",
    //   success: function(res) {
    //     // 转发成功
    //   },
    //   fail: function(res) {
    //     // 转发失败
    //   }
    // };
  },
  methods: {
    loadHandler(e) {
      console.log("loadHandler", e);
    },
    errorHandler(e) {
      console.log("errorHandler", e);
      wx.showToast({
        title: "网络异常",
        icon: "none"
      });
    },
    checkShop(src) {
      wx.request({
        url: src,
        method: "GET",
        success: () => {},
        fail: () => {
          wx.showToast({
            title: "网络异常",
            icon: "none"
          });
          wx.switchTab({
            url: "/pages/home/main"
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
