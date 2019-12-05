<template>
    <div class="main">
        <div class="assess">
            <p class="title">请输入车辆的车架号</p>
            <p class="text1"><input type="text" placeholder="请输入车辆的车架号" maxlength="20" v-model="vin"></p>
            <button class="btn" @click="getPrice" >估价</button>
            <!-- <div class="ass" @click="goPrice">
                <span class="text2">更多估价方式</span>
                <img src="/static/img/right_arrow.png" alt="" style="width:6px;height:11px;" class="right">
            </div> -->
        </div>
    </div>
</template>

<script>
import { path, dataConfig } from "@/utils/index";

export default {
  data() {
    return {
      vin: ""
    };
  },
  onLoad() {},
  onShow() {
    this.vin = "";
  },
  onShareAppMessage(){
    return {
      title: '佰仟易行',
      path: '/pages/service/evaluate/main',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  methods: {
    // goPrice() {
    //     wx.navigateTo({ url: "/pages/service/carPrice/main" });
    // },

    getPrice() {
      if (this.vin === "") {
        wx.showToast({
          title: "车架号不能为空",
          icon: "none"
        });
        return false;
      } else {
        wx.navigateTo({
          url: "/pages/service/end/main?vin=" + this.vin
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$jbColorTop: rgba(255,224,86,1);
$jbColorBottom: #FFCC00;
.main {
  height: 100%;
  height: 100vh;
  padding: 16px 15px 0 15px;
  background-color: #f3f3f3;
}
.assess {
  width: 100%;
  height: 284px;
  background-color: #ffffff;
  border-radius: 13px;
  display: flex;
  flex-direction: column;
  .title {
    font-size: 26px;
    margin-top: 30px;
    margin-left: 28px;
  }
  .text1 {
    font-size: 14px;
    margin-top: 30px;
    margin-left: 28px;
  }
  .btn {
    color: #000;
    background: linear-gradient(180deg,$jbColorTop, $jbColorBottom);
    width: 290px;
    height: 47px;
    border-radius: 26rpx;
    margin-top: 40px;
    text-align: center;
    line-height: 47px;
  }
  .btn:after{
    border: none;
  }
}
.ass {
  display: flex;
  flex-direction: row;
  .text2 {
    margin-top: 35px;
    margin-left: 11px;
  }
  .right {
    margin-top: 42px;
    margin-left: 207px;
  }
}
</style>

