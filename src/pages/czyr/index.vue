<template>
  <web-view :src="gzhUrl"></web-view>
</template>

<script>
import { link } from "@/utils/index";
export default {
  components: {},

  data() {
    return {
      gzhDomain: link.weChatPublic,
      gzhUrl: ""
    };
  },
  onLoad(query) {
    // wx.removeStorageSync("getPayObj");
    wx.login({
      success: res => {
        this.gzhUrl = this.gzhDomain + "/czyr/app-apply?x_code=" + res.code;
      }
    });
  }
};
</script>

<style lang="scss" scoped>
</style>

