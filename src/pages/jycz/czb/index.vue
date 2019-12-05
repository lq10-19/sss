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
      //baseSrc: path.carItem,
      //http://open.czb365.com/redirection/todo/?platformType=92651226&platformCode=手机号
      baseSrc: "http://open.czb365.com/redirection/todo", //车主邦
      src: "",
      isGologinPage: false,
      isGoBindPhonePage: false,
      carId: ""
    };
  },
  onLoad(options) {},
  onShow() {
    let loginInfo = getLoginInfo();
    if (true) {
      if (loginInfo) {
        this.src = "";
        // loginInfo.userId = loginInfo.userid;
        // loginInfo.from = "miniprogram_shop";
        let loginInfo2 = {};
        loginInfo2.platformType = 92651226;
        loginInfo2.platformCode = loginInfo.account;
        let str = queryString.stringify(loginInfo2);
        this.src += this.baseSrc + "?" + str;
        console.log(this.src);
        this.checkShop(this.src);
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
      title: "佰仟易行",
      path: "/pages/jycz/main",
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
