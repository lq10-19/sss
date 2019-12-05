<template>
  <div>
    <web-view v-if="isShow" :src="link"></web-view>
  </div>
</template>

<script>
import { link } from "@/utils/index";
export default {
  components: {},

  data() {
    return {
      isShow: false,
      link: ""
    };
  },
  created() {},
  onLoad(obj) {
    if (!obj.appId) {
      wx.login({
        success: res => {
          this.link = link.repayment + `?x_code=${res.code}`;
        }
      });
      this.isShow = true;
      return false;
    }

    this.show = false;
    wx.requestPayment({
      appid: obj.appId,
      timeStamp: obj.timeStamp,
      nonceStr: obj.nonceStr,
      package: "prepay_id=" + obj.package,
      signType: "MD5",
      paySign: obj.paySign,
      success: res => {
        console.log("支付成功:" + res);
        this.show = true;
        this.link = "";
        setTimeout(() => {
          this.link = link.repayment;
        }, 0);
      },
      fail: res => {
        console.log("支付失败:" + res);
        this.show = true;
        setTimeout(() => {
          this.link = link.repayment;
        }, 0);
      }
    });
  }
};
</script>

<style lang="scss" scoped>
</style>

