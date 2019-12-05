<template>
  <div>
    <web-view :src="src" @load="loadHandler" @error="errorHandler"></web-view>
  </div>
</template>
<script>
import queryString from "@/utils/query-string";
import {
  path,
  dataConfig,
  getUserInfo,
  isBindPhone,
  getLoginInfo,
  apiFail,
  showLoading,
  hideLoading,
  isHuaWei,
  isOppo,
  getSystemInfo,
  event,
  compareVersion,
  link
} from "@/utils/index";
export default {
  components: {},
  data() {
    return {
      baseSrc: link.fixe,
      //baseSrc: "https://bqyx.bqzulin.com/mall/#/activePageIndex",
      src: "",
      isGologinPage: false,
      isGoBindPhonePage: false,
      toLink: ""
    };
  },
  onLoad(options) {
    this.toLink = "";
    if (options.toLink) {
      this.toLink = options.toLink;
    }
  },
  onShow() {
    let loginInfo = getLoginInfo();

    if (isBindPhone()) {
      if (loginInfo) {
        this.src = "";
        if (this.toLink) {
          this.src = decodeURIComponent(this.toLink);
        } else {
          loginInfo.userId = loginInfo.userid;
          loginInfo.from = "miniprogram_shop";
          let str = queryString.stringify(loginInfo);
          this.src += this.baseSrc + "?" + "&uid=" + loginInfo.userId;
          console.log(this.src);
          this.checkShop(this.src);
        }
      } else {
        wx.showToast({
          title: "系统异常",
          icon: "none"
        });
      }
    } else {
      if (this.isGologinPage || this.isGoBindPhonePage) {
        wx.switchTab({
          url: "/pages/home/main"
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
  onShareAppMessage() {
    return {
      title: "幸运抽大奖",
      path: "/pages/service/doubleTwelve/main"
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
