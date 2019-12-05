<script>
import "../static/common.scss";
import { isHuaWei } from "@/utils/index";
export default {
  onLaunch: function(options) {
    wx.getSystemInfo({
      success: res => {
        wx.setStorageSync("systemInfo", res);
      }
    });
    wx.setStorageSync("sceneVal", options.scene);
  },
  onError(error) {
    let msg = "";
    if (error) {
      if (error.message) {
        msg = error.message;
      } else if (error.data && error.data.message) {
        msg = error.data.message;
      }
    } else {
      msg = "系统异常";
    }

    wx.showToast({
      title: msg,
      icon: "none"
    });
  }
};
</script>

<style>
.container {
  width: 100%;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
