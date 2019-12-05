<template>
  <div class="login-page">
    <h1>为了您的账户安全，请先完成身份验证</h1>
    <div class="login-icon">
      <img src="http://bqyx-qiniu.bqrzzl.com//mp/logo.png?123456">
    </div>
    <div class="login-info">
      <div class="login-item">
        <span class="login-title">手机号</span>
        <span class="login-value">
          <input
            v-model="mobile"
            placeholder="点击输入手机号"
            type="number"
            maxlength="11"
            @input="filterNumber"
            disabled
          >
        </span>
        <!-- <span class="login-clear">
          <i @click="mobile=''"></i>
        </span> -->
      </div>
      <div class="login-item">
        <span class="login-title">验证码</span>
        <span class="login-value">
          <input placeholder="点击输入验证码" v-model="inputCode">
        </span>
        <span
          class="login-verification"
          @click="getVcode"
          v-if="!isCountDown"
          :class="{'disabled':disabled}"
          :disabled="disabled"
        >获取验证码</span>
        <span
          v-if="isCountDown"
          class="login-verification"
          disabled="disabled"
        >重新获取({{countDownTime}})</span>
      </div>
      <!-- <div class="login-item">
        <span class="login-title">密码</span>
        <span class="login-value"><input type="password" v-model="password"></span>
        <span class="login-clear"><i @click="password=''"></i></span>
      </div>-->
    </div>
    <div class="login-btn">
      <button @click="registerCheck">验证手机号</button>
    </div>
    <!-- <div class="other-box">
      <span class="register" @click="goRegister">注册新用户</span>
      <span class="forget">忘记密码?</span>
    </div>-->
  </div>
</template>

<script>
import utils from "@/utils/index";
import { getLoginInfo, path, apiFail } from "@/utils/index";
import { setTimeout } from 'timers';
export default {
  components: {},

  data() {
    return {
      account: "",
      password: "",
      type: 1,
      mobile: "",
      nickname: "",
      wechatNo: "",
      city: "",
      province: "",
      country: "",
      avatarurl: "",
      isRegister: false,
      isSuccessRegister: false, //是否注册成功
      isCountDown: false,
      inputCode: "",
      countDownTime: 60,
      userFlag: "", //判断新老用户
      isGetverifyCode: false,
      isGetVcodeing: false //正在获取短信验证码
    };
  },
  onLoad(options){
    this.mobile = options.phone;
  },
  onShow() {
    this.inputCode = "";
  },
  methods: {
    filterNumber() {
      this.mobile = this.mobile.replace(/[^\d]/g, "");
    },
    register() {
      if (this.isSuccessRegister) {
        return;
      }
      if (this.isRegister) {
        return;
      }
      this.isRegister = true;
      this.showRegisterLoading();
      wx.login({
        success: res => {
          wx.getUserInfo({
            success: userInfo => {
              if (res.code) {
                this.toRegister(res.code, userInfo.encryptedData, userInfo.iv);
              } else {
                this.isRegister = false;
                this.hideRegisterLoading();
                wx.showToast({
                  title: "授权登录失败",
                  icon: "none"
                });
              }
            },
            fail: e => {
              this.isRegister = false;
              this.hideRegisterLoading();
              wx.showToast({
                title: "授权登录失败",
                icon: "none"
              });
            }
          });
        },
        fail: e => {
          this.isRegister = false;
          this.hideRegisterLoading();
          console.error(e);
          wx.showToast({
            title: "授权登录失败",
            icon: "none"
          });
        }
      });
    },
    //倒计时
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
    //获取验证码
    getVcode() {
      if (this.isGetVcodeing) {
        return;
      }
      this.isGetVcodeing = true;
      if (this.mobile !== this.$root.$mp.query.phone) {
        wx.showToast({
          title: "请正确填写手机号",
          icon: "none"
        });
        this.isGetVcodeing = false;
        return;
      }
      let url = path.getVerifyCode;
      let loginInfo = getLoginInfo();
      let queryData = {
        templateType: 2,
        mobile: this.mobile
      };
      try {
        let promise = this.$fly.post(url, queryData);
        promise
          .then(data => {
            this.isGetverifyCode = true;
            this.userFlag = data.userFlag;
            wx.navigateTo({
              url: `/pages/home/main?userFlag=${this.userFlag}`
            });
            this.disabled = true;
            this.isCountDown = true;
            this.countDown();
            wx.showToast({
              title: "获取成功",
              icon: "none"
            });
            this.isGetVcodeing = false;
          })
          .catch(e => {
            this.isGetVcodeing = false;
            apiFail(e);
          });
        return promise;
      } catch (error) {
        this.isGetVcodeing = false;
      }
    },
    //验证手机号
    registerCheck() {
      // if (!this.isGetverifyCode) {
      //   wx.showToast({
      //     title: "请先获取短信验证码",
      //     icon: "none"
      //   });
      //   return;
      // }
      this.account = this.account.trim();
      // this.password = this.password.trim();
      this.mobile = this.mobile.trim();
      if (this.mobile !== this.$root.$mp.query.phone) {
        wx.showToast({
          title: "请正确填写手机号",
          icon: "none"
        });
        return;
      }
      console.log(this.mobile,this.inputCode)
      let url = path.checkVerifyCode;
      let queryData = {
        verifyCode: this.inputCode,
        mobile: this.mobile
      };
      let promise = this.$fly.post(url, queryData);
      promise
        .then(res => {
          console.log(res,123)
          wx.showToast({
            title: '验证成功，请绑定新手机号',
            icon: 'none',
            duration: 1500
          })
          setTimeout(function(){ 
            wx.redirectTo({
              url: `/pages/login/bindPhone/main?delta=2`
            })
          }, 1500);
        })
        .catch(e => {
          wx.showToast({
            title: '验证失败，请重新获取验证码',
            icon: 'none',
            duration: 1500
          })
          //apiFail(e);
        }); 
    },
    toRegister(code, encryptedData, iv) {
      let loginInfo = getLoginInfo();
      let data = {
        verifyCode: this.inputCode,
        mobile: this.mobile,
        code: code,
        appid: utils.dataConfig.appid,
        secret: utils.dataConfig.secret,
        encryptedData: encryptedData,
        iv: iv,
        type: 7,
        nickname: loginInfo.nickname,
        avatarurl: loginInfo.avatarUrl,
        sex: loginInfo.sex
      };
      let url = utils.path.register;
      let promise = this.$fly.post(url, data);
      promise
        .then(res => {
          this.hideRegisterLoading();
          this.isRegister = false;
          utils.setLoginInfo(res);
          console.log("res", res);
          this.isSuccessRegister = true;
          wx.showToast({
            title: "注册成功",
            icon: "success"
          });
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            });
          }, 1500);
        })
        .catch(error => {
          this.hideRegisterLoading();
          this.isRegister = false;
          if (error.data.code === -1) {
            wx.showToast({
              title: "绑定失败，请重试",
              icon: "none"
            });
          } else {
            utils.apiFail(error);
          }
        });
    },
    showRegisterLoading() {
      wx.showLoading({
        title: "注册中...",
        mask: true
      });
    },
    hideRegisterLoading() {
      wx.hideLoading();
    }
  }
};
</script>

<style lang="scss" scoped>
$jbColorTop: rgba(255, 224, 86, 1);
$jbColorBottom: #ffcc00;
.login-page {
  h1{
    height: 60rpx;
    width: 100%;
    background: #000;
    color: #fff;
    text-align: center;
    font-size: 32rpx;
    line-height: 60rpx;
  }
  .login-icon {
    width: 100%;
    height: 1.4rem;
    margin-top: 10rpx;
    img {
      display: block;
      width: 1.4rem;
      height: 1.4rem;
      margin: 0 auto;
    }
  }
}
.login-info {
  width: 100%;
  margin-top: 1.6rem;
  .login-item {
    line-height: 1rem;
    display: flex;
    flex-direction: row;
    width: 80%;
    height: 1rem;
    margin: 0 auto;
    border-bottom: 0.01rem solid rgba(224, 224, 224, 1);

    .login-title {
      width: 200rpx;
      font-size: 32rpx;
      color: #333333;
    }
    .login-value {
      input {
        height: 1rem;
      }
    }
    .login-clear {
      width: 200rpx;
      height: 100%;
      text-align: right;
      // margin-left:120rpx;
      i {
        // display: block;
        width: 0.3rem;
        height: 0.3rem;
        margin-left: 90rpx;
        margin-top: 0.35rem;
        background: url("../../../../static/icon/clear.png") no-repeat
          center/100%;
      }
    }
    .login-verification {
      font-size: 24rpx;
      color: #333333;
      width: 200rpx;
      text-decoration: underline;
    }
  }
}
.login-btn {
  width: 100%;
  height: 0.9rem;
  margin-top: 0.7rem;
  button {
    margin: 0 auto;
    display: block;
    width: 5.8rem;
    height: 0.9rem;
    line-height: 0.9rem;
    background: linear-gradient(180deg, $jbColorTop, $jbColorBottom);
    border-radius: 0.45rem;
    font-size: 0.36rem;
    font-family: PingFang-SC-Regular;
    font-weight: 400;
    color: #000;
  }
  button:after {
    border: none;
  }
}
.other-box {
  width: 100%;
  height: 0.23rem;
  margin-top: 0.39rem;
  span {
    display: inline-block;
    width: 1.2rem;
    height: 0.23rem;
    line-height: 0.23rem;
    font-size: 0.24rem;
    font-family: PingFang-SC-Regular;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
  }
  .register {
    float: left;
    margin-left: 1rem;
  }
  .forget {
    float: right;
    margin-right: 1rem;
  }
}
</style>