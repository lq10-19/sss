<template>
  <div></div>
</template>

<script>
import queryString from "@/utils/query-string";
import { getLoginInfo, link } from "@/utils/index";
export default {
  components: {},

  data() {
    return {
      errorMsg: ""
    };
  },
  created() {},
  onLoad(obj) {
    console.log("obj", obj);
    let loginInfo = getLoginInfo();
    wx.requestPayment({
      appid: obj.appId,
      timeStamp: obj.timeStamp,
      nonceStr: obj.nonceStr,
      package: "prepay_id=" + obj.package,
      signType: "MD5",
      paySign: obj.sign,
      success: function(res) {
        let params = {
          toLink: link.paySuccess
        };
        params.toLink +=
          "?" +
          queryString.stringify({
            orderId: obj.orderId,
            userId: loginInfo.userid,
            from: "miniprogram"
          });
        params = queryString.stringify(params);
        setTimeout(() => {
          wx.reLaunch({
            url: `/pages/shop/main?${params}`,
            fail: e => {
              wx.showToast({
                title: "跳转失败",
                icon: "none"
              });
            }
          });
        }, 400);
      },
      fail: function(res) {
        console.log("支付失败:" + res);
        setTimeout(() => {
          wx.reLaunch({
            url: "/pages/shop/main"
          });
        }, 400);
      }
    });
  }
};
</script>

<style lang="scss" scoped>
</style>

