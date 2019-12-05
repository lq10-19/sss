<template>
  <div class="main">
    <div class="text">
      <ul class="left">
        <li class="left_li">提现方式</li>
        <li class="left_li">提现金额</li>
        <li class="left_li">手机号码</li>
        <li class="left_li-left">验证码</li>
        <li class="left_li-left">计算结果</li>
      </ul>
      <ul class="right">
        <li class="right_li">微信零钱</li>
        <li class="right_li">{{cash}}</li>
        <li class="right_li">
          <input v-model="mobile">
        </li>
        <li class="right_li">
          <input type="number" class="verification" v-model="code">
          <button
            class="right-verification"
            @click="getVcode"
            v-if="!isCountDown"
            :class="{'disabled':disabled}"
            :disabled="disabled"
          >获取验证码</button>
          <button
            v-if="isCountDown"
            class="right-verification"
            disabled="disabled"
          >重新获取({{countDownTime}})</button>
        </li>
        <li class="right_li">
          <input type="number" class="verification" v-model="imgval">
          <div @click="getImage" class="right-verification noborder">
            <img :src="imageSrc" alt="img">
          </div>
        </li>
      </ul>
    </div>
    <div class="button">
      <button class="btn1" :class="{ disabled: btnDisabled }" @click="goRecord">{{btxText}}</button>
    </div>
  </div>
</template>

<script>
import {
  getUserInfo,
  getLoginInfo,
  path,
  apiFail,
  event,
  lastPutForwardTime,
  dataConfig,
  showLoading
} from "@/utils/index";
export default {
  data() {
    return {
      cash: 0,
      mobile: "",
      countDownTime: 60,
      isCountDown: false,
      mobile: "",
      payment_time: "",
      isGetVerifyCode: false,
      code: "",
      isSubmitting: false,
      btxText: "提现",
      timer: [-1, -1],
      btnDisabled: false,
      imageSrcBase: path.imgCode,
      imageSrc: "", //图片验证码src
      imgval: "", //图片验证码结果
      isGetVcodeing:false,//正在获取验证码
      firstGetVcode: true //是否第一次获取短信验证码
    };
  },
  onLoad(options) {
    this.cash = options.cash;
  },
  onShow() {
    this.code = "";
    this.mobile = "";
    this.imgval = "";
    this.firstGetVcode = true;
    this.isGetVerifyCode = false;
    this.timer = [-1, -1];
    this.btnDisabled = false;
    this.btxText = "提现";
    this.isSubmitting = false;
    let loginInfo = getLoginInfo();
    if (loginInfo.account) {
      this.mobile = loginInfo.account;
    }
    let userInfo = getLoginInfo();
    let userid = userInfo.userid;
    //let userid = '13df35e640d743eba0640ba8596460c5';
    this.imageSrc = this.imageSrcBase + `?userId=${userid}`;
  },
  onHide() {
    clearTimeout(this.timer[0]);
    clearInterval(this.timer[1]);
  },
  methods: {
    goRecord() {
      if (true === this.isSubmitting) {
        return;
      }
      this.isSubmitting = true;
      getApp().aldstat.sendEvent(event["my.withdraw.cash.2"]);
      // if (!this.isGetVerifyCode) {
      //   wx.showToast({
      //     title: "请先获取短信验证码",
      //     icon: "none"
      //   });
      //   this.isSubmitting = false;
      //   return;
      // }
      if (!this.code) {
        wx.showToast({
          title: "请填写短信验证码",
          icon: "none"
        });
        this.isSubmitting = false;
        return;
      }
      if (!this.imgval) {
        wx.showToast({
          title: "请填写计算结果",
          icon: "none"
        });
        this.isSubmitting = false;
        return;
      }
      let url = path.getMoney;
      let loginInfo = getLoginInfo();
      let queryData = {
        userId: loginInfo.userid,
        //userId: "13df35e640d743eba0640ba8596460c5",
        openId: loginInfo.mpOpenid,
        withdrawAmount: this.cash,
        verifyCode: this.code,
        mobile: this.mobile,
        dynamicResult: this.imgval
      };

      this.isSubmitting = true;
      this.btxText = "提现中...";
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          this.payment_time = data.payment_time;
          this.cashCooldown();
          wx.navigateTo({
            url: `/pages/user/putForwardSucc/main?paymentTime=${
              this.payment_time
            }`
          });
        })
        .catch(e => {
          this.cashCooldown();
          console.log(e);
          apiFail(e);
        });
      showLoading(promise);
      return promise;
    },
    getVcode() {
      if( this.isGetVcodeing ){
        return;
      }
      this.isGetVcodeing = true;
      let url = path.getVerifyCode;
      let loginInfo = getLoginInfo();
      let queryData = {
        mobile: this.mobile,
        templateType: 5
      };
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          this.isGetVerifyCode = true;
          this.disabled = true;
          this.isCountDown = true;
          this.countDown();
          wx.showToast({
            title: "获取成功",
            icon: "none"
          });
          this.firstGetVcode = false;
          this.isGetVcodeing = false;
        })
        .catch(e => {
          this.isGetVcodeing = false;
          apiFail(e);
        });
      this.code = "";
      this.firstGetVcode ? this.getImage() : void 0;
      return promise;
    },
    countDown() {
      let timer = setInterval(() => {
        if (this.countDownTime > 1) {
          this.countDownTime--;
        } else {
          clearInterval(timer);
          this.countDownTime = 60;
          this.isCountDown = false;
          this.disabled = false;
        }
      }, 1000);
    },
    cashCooldown() {
      this.btnDisabled = true;
      this.btxText = "提现";
      let tempTime = dataConfig.putForwardCooldownTime / 1000; //秒数
      this.timer[0] = setTimeout(() => {
        this.btnDisabled = false;
        clearInterval(this.timer[1]);
        this.btxText = "提现";
        this.isSubmitting = false;
      }, dataConfig.putForwardCooldownTime);

      this.btxText = `提现(${tempTime})`;
      this.timer[1] = setInterval(() => {
        tempTime--;
        this.btxText = `提现(${tempTime})`;
      }, 1000);
    },
    getImage() {
      let userInfo = getLoginInfo();
      let userid = userInfo.userid;
      //let userid = '13df35e640d743eba0640ba8596460c5';
      let t = Date.now();
      this.imageSrc = this.imageSrcBase + `?userId=${userid}&t=${t}`;
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
  background-color: #f2f3f5;

  .text {
    width: 100%;
    display: flex;
    background-color: #fff;
    margin-top: 10px;
    .left {
      flex-direction: column;
      .left_li {
        text-align: left;
        line-height: 50px;
        font-size: 16px;
        color: #666666;
        margin-left: 15px;
      }
      .left_li-left {
        text-align: left;
        line-height: 50px;
        font-size: 16px;
        color: #666666;
        margin-left: 15px;
      }
    }
    .right {
      flex: 1;
      .right_li {
        text-align: left;
        line-height: 50px;
        font-size: 16px;
        color: #010101;
        margin-left: 30px;

        display: flex;
        flex-direction: row;
        .verification {
          width: 200rpx;
        }
      }
      input {
        margin-top: 10px;
      }
      button {
        width: 230rpx;
        height: 62rpx;
        line-height: 62rpx;
        border: 2rpx solid #FFCC00;
        color: #FFCC00;
        font-size: 28rpx;
        margin-top: 10px;
        margin-left: 60rpx;
        border-radius: 10rpx;
      }
      button:after{
        border: none;
      }
      .noborder {
        width: 230rpx;
        height: 62rpx;
        margin-top: 20rpx;
        margin-left: 60rpx;
        img {
          width: 170rpx;
          height: 60rpx;
          float: right;
        }
      }
    }
    ul {
      list-style: none;
      li {
        height: 50px;
      }
    }
  }
  .button {
    display: flex;
    flex-direction: row;
    margin-top: 40px;
    .btn1 {
      width: 294px;
      height: 40px;
      border-radius: 20px;
      text-align: center;
      font-size: 16px;
      color: #000;
      background: linear-gradient(180deg,$jbColorTop, $jbColorBottom);
    }
    .btn1:after{
      border: none;
    }
    .disabled {
      background: none;
      background-color: #a9a9a9 !important;
      border: none;
    }
  }
  .button-hover{
    background: none;
  }
}
</style>
