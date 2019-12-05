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
      baseSrc: link.shop,
      //baseSrc: "http://10.81.2.192/%E4%BD%B0%E4%BB%9F%E6%98%93%E8%A1%8C/bqrzzl_mall_web/dist/#/mallindex",
      src: "",
      isGologinPage: false,
      isGoBindPhonePage: false,
      toLink: ""
    };
  },
  onLoad(options) {},
  onShow() {
    //从公众号跳转
    let loginInfo = getLoginInfo();
    if (!loginInfo && !this.isGologinPage) {
      this.isGologinPage = true;
      const url = "/pages/login/main";
      wx.navigateTo({ url });
      return;
    } else if (!loginInfo && this.isGologinPage) {
      const url = "/pages/home/main";
      wx.switchTab({ url });
      return;
    } else {
      let userId = loginInfo.userid;
      let toLink = link.bargainActive + `?userId=${userId}`;
      //toLink = encodeURIComponent(toLink);
      this.src = toLink;
      console.log(toLink);
    }
  },
  onShareAppMessage() {
    return {
      title: "佰仟易行",
      path: "/pages/shop/main",
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    };
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
