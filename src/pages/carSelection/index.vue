<template>
  <div>
    <web-view :src="src" @load="loadHandler" @error="errorHandler"></web-view>
  </div>
</template>
<script>
import queryString from "@/utils/query-string";
import { getLoginInfo, isBindPhone, link, path} from "@/utils/index";
export default {
  components: {},

  data() {
    return {
      baseSrc: path.carSelection,
      //baseSrc: "https://sitbqyx.bqzulin.com/ctv/?AuthCustomerType=masterMan&recordId=20190530155834119308#/index", //身份验证
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
    if (true) {
      if (loginInfo) {
        this.src = "";
        if (this.toLink) {
          this.src = decodeURIComponent(this.toLink);
        } else {
          loginInfo.userId = loginInfo.userid;
          let str = queryString.stringify(loginInfo);
          this.src += this.baseSrc + "?" + str;
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
  onShareAppMessage(){
    return {
      title: '佰仟易行',
      path: '/pages/carSelection/main',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
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
