<template>
  <div>
    <web-view :src="src" @load="loadHandler" @error="errorHandler"></web-view>
  </div>
</template>
<script>
import queryString from "@/utils/query-string";
import { getLoginInfo, isBindPhone, link } from "@/utils/index";
export default {
  components: {},

  data() {
    return {
      baseSrc: link.mallOrders,
      src: "",
      //   src: "http://10.81.2.72/bqrzzl_mall_web/dist/#/mallOrders",
      isGologinPage: false,
      isGoBindPhonePage: false
    };
  },
  onLoad(options) {},
  onShow() {
    let loginInfo = getLoginInfo();
    if (isBindPhone()) {
      if (loginInfo) {
        this.src = "";
        let data = { userId: loginInfo.userid, from: "miniprogram" };
        let str = queryString.stringify(data);
        this.src += this.baseSrc + "?" + str;
      } else {
        wx.showToast({
          title: "系统异常",
          icon: "none"
        });
      }
    } else {
      if (this.isGologinPage || this.isGoBindPhonePage) {
        wx.switchTab({
          url: "/pages/user/main"
        });
        this.isGologinPage = false;
        this.isGoBindPhonePage = false;
      } else {
        if (loginInfo) {
          this.isGoBindPhonePage = true;
          const url = "/pages/login/bindPhone/main";
          wx.navigateTo({ url });
        } else {
          this.isGologinPage = true;
          const url = "/pages/login/main";
          wx.navigateTo({ url });
        }
      }
    }
  },
  methods: {
    loadHandler(e) {
      console.log(e);
    },
    errorHandler(e) {
      console.log(e);
      wx.showToast({
        title: "网络异常",
        icon: "none"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
