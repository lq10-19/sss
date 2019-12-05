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
      baseSrc: link.bxfq,
      src: "",
      backData: {}
    };
  },
  onLoad(query) {
    let temp = decodeURIComponent(this.$root.$mp.query.backData);
    this.backData = JSON.parse(temp);
    console.log(this.backData, 111);
  },
  onShow() {
    let str = queryString.stringify(this.backData);
    this.src = this.baseSrc + "?" + str;
    console.log(this.src, 222);
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
