<template>
  <div class="main">
    <div class="backHome" @click="backHome" v-if="backShow== true">
      <img src="/static/img/sign/back.png">
    </div>
    <div class="content">
      <div class="primary-pop" v-if="openSettingState == true">
        <div class="primary">
          <p class="title">要授权才能参与活动哦~</p>
          <button
            type="primary"
            class="openSetting"
            open-type="openSetting"
            bindopensetting="handleSetting"
          >去授权</button>
        </div>
      </div>
      <div class="rule" @click="rulePop">活动规则</div>

      <div class="mess-box">
        <div class="label">当前步数</div>
        <div class="total-step">{{currSteps}}步</div>
        <div class="money">可兑：{{exchangeMoney}}元</div>
        <div class="dh-btn" @click="Godh" :class="dhState==false?'disable':''">点击兑换</div>
      </div>
      <div class="share-btn" @click="getEnjoy">
        <p>邀好友加步数</p>
      </div>
      <p class="tips">每邀一个新用户好友加入，当前步数加5000步</p>
      <div class="step-rule-box">
        <scroll-view scroll-x>
          <div class="list" v-for="(item,index) in ExchangeRule" :key="index">
            <div class="box">
              <p class="label">{{item.stepNumber}}步</p>
              <p class="label1">
                可兑
                <span>{{item.exchangeMoney}}</span>元
              </p>
              <p class="label2">
                剩余
                <span>{{item.exchangeNumber}}</span>份
              </p>
            </div>
          </div>
        </scroll-view>
      </div>
      <div class="clear"></div>
    </div>
    <div class="section">
      <div class="active-time">
        <div class="txt">每日红包发放时间：<p v-for="(item,index) in timePeriod" :key="index">{{item.startTime}}</p></div>
      </div>
      <p class="title">步数排行榜</p>
      <ul class="hd">
        <li class="li1">排名</li>
        <li class="li2">微信昵称</li>
        <li class="li3">总步数</li>
      </ul>
      <ul class="bd">
        <li v-for="(item,index) in rankingList" :key="index">
          <div class="rank">
            <span>{{item.no}}</span>
          </div>
          <div class="name">{{item.nickname}}</div>
          <div class="step">{{item.steps}}</div>
        </li>
      </ul>
    </div>
    <div class="pop-bg" v-if="popState == true">
      <div class="pop">
        <p class="title">成功兑换{{dhMoneny}}元！</p>
        <p class="desc">现金已存入您的佰仟易行账户
          <br>
          满{{minAmount}}元可直接提现
        </p>
        <div class="comfirm-btn" @click="comfrim">确定</div>
      </div>
    </div>
    <div class="rule-bg" v-if="ruleShow == true">
      <div class="rule">
        <p class="title">活动规则</p>
        <ul>
          <li v-for="(item,index) in rules" :key="index">{{item.rule}}</li>
        </ul>
        <div class="close" @click="closePop"></div>
      </div>
    </div>
    <div class="enjoy" v-show="goEnjoy">
      <div class="enjoy_main">
        <div class="button">
          <button open-type="share">
            <img src="/static/redBag/weixin@2x.png" class="weChat">
            <p>微信好友</p>
          </button>
          <button @click="enjoyFriend">
            <img src="/static/redBag/pengyouquan@2x.png" class="friend">
            <p>朋友圈</p>
          </button>
        </div>
        <div class="buttom" @click="know">我知道了</div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  path,
  getLoginInfo,
  getSystemInfo,
  apiFail,
  getSceneCode,
  setSceneCode,
  showLoading,
  NumberAnimate
} from "@/utils/index";
export default {
  components: {},
  data() {
    return {
      goEnjoy: false,
      aidUserId: "",
      backShow: true,
      isGoLoginPage: false,
      rules: "",
      ruleShow: false,
      popState: false,
      currSteps: 0,
      num1Complete: "",
      exchangeMoney: "0",
      openSettingState: false,
      ExchangeRule: "",
      rankingList: "",
      dhState: false,
      dhMoneny: "",
      minAmount: 0,
      timeState: true,
      changeRuleTime: null,
      timePeriod: ""
    };
  },
  onLoad(options) {
    console.log(options);
    if (options.scene) {
      setSceneCode(options.scene);
      this.aidUserId = options.scene;
      console.log(this.aidUserId);
    } else {
      setSceneCode(options.aidUserId);
      this.aidUserId = options.aidUserId;
      console.log(this.aidUserId);
    }
  },
  onShow() {
    this.currSteps = 0;
    this.goEnjoy = false;
    if (!getLoginInfo() && !this.isGoLoginPage) {
      this.isGoLoginPage = true;
      const url = "/pages/login/main";
      wx.navigateTo({ url });
      return;
    } else {
      if (this.aidUserId != undefined) {
        this.saveInv();
      }
      showLoading(
        this.getRankingList(),
        this.getRunData(),
        this.getWalletMoney()
      );
      var that = this;
      this.timeState = true;
      clearInterval(this.changeRuleTime);
      if (this.timeState == true) {
        this.changeRuleTime = setInterval(function() {
          that.getRunData();
          console.log("不断执行");
        }, 10000);
      }
    }
  },
  onHide() {
    console.log("hide");
    clearInterval(this.changeRuleTime);
  },
  onUnload() {
    console.log("unload");
    clearInterval(this.changeRuleTime);
  },
  onReady() {},

  onShareAppMessage(params) {
    let loginInfo = getLoginInfo();
    let userid = loginInfo.userid;
    let nickname = loginInfo.nickname;
    this.goEnjoy = false;
    return {
      title: nickname + "邀你一起积步领红包",
      imageUrl: "http://bqyx-qiniu.bqrzzl.com/accu/banners.jpg",
      path: `/pages/active/accumulation/main?aidUserId=${userid}`
    };
  },
  methods: {
    handleSetting(e) {
      console.log(e);
    },
    getEnjoy(e) {
      console.log(e);
      if (!getLoginInfo()) {
        const url = "/pages/login/main";
        wx.navigateTo({ url });
        return;
      } else {
        if (e.avatarUrl == null) {
          this.goEnjoy = true;
        } else {
          this.goEnjoy = false;
        }
      }
    },
    know() {
      this.goEnjoy = false;
    },
    enjoyFriend() {
      this.goEnjoy = false;
      wx.navigateTo({
        url: "/pages/active/accumulation/poster/main"
      });
    },
    saveInv() {
      let url = path.stepSaveInvitation;
      let loginInfo = getLoginInfo();
      let queryData = {
        userId: loginInfo.userid,
        aidUserId: getSceneCode()
      };
      console.log(queryData);
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          if (data != null) {
            console.log("保存邀请关系");
          }
          console.log("保存邀请关系s");
        })
        .catch(e => {
          //apiFail(e);
        });
      return promise;
    },
    backHome() {
      wx.switchTab({
        url: "/pages/home/main"
      });
    },
    rulePop() {
      this.ruleShow = true;
      let url = path.getaccuRules;
      let loginInfo = getLoginInfo();
      let queryData = {};
      let promise = this.$fly.get(url, queryData);
      promise
        .then(data => {
          if (data != null) {
            this.rules = data;
          }
          console.log(this.rules);
        })
        .catch(e => {
          apiFail(e);
        });
      return promise;
    },
    closePop() {
      this.ruleShow = false;
    },
    comfrim() {
      this.popState = false;
    },
    Godh() {
      if (this.dhState == true) {
        let loginInfo = getLoginInfo();
        let queryData = {};
        let url = path.runExchange + "/" + loginInfo.userid;
        let promise = this.$fly.get(url, queryData);
        promise
          .then(data => {
            console.log(data);
            this.dhMoneny = data.exchangeMoney;
            this.popState = true;
            this.getRunData();
          })
          .catch(e => {
            apiFail(e);
          });
        return promise;
      } else {
        wx.showToast({
          title: "当前无可兑换金额",
          icon: "none"
        });
      }
    },
    animate: function() {
      console.log("aaa");
      let num1 = this.currSteps;
      let n1 = new NumberAnimate({
        from: num1, //开始时的数字
        speed: 2000, // 总时间
        refreshTime: 10, //  刷新一次的时间
        decimals: 0, //小数点后的位数
        onUpdate: () => {
          //更新回调函数
          this.currSteps = n1.tempValue;
        },
        onComplete: () => {
          //完成回调函数
          this.num1Complete = " 完成了";
          this.getExchangeRule();
        }
      });
    },
    getRunData() {
      this.getExchangeTimePeriod();
      wx.login({
        success: res => {
          wx.getUserInfo({
            success: userInfo => {
              console.log(res.code);
              var codeVal = res.code;
              var that = this;
              wx.getWeRunData({
                success: ress => {
                  this.openSettingState = false;
                  const encryptedData = ress.encryptedData;
                  if (ress.errMsg == "getWeRunData:ok") {
                    console.log(ress);
                    let loginInfo = getLoginInfo();
                    let queryData = {};
                    let url = path.stepAuth + "/" + loginInfo.userid;
                    let promise = this.$fly.get(url, queryData);
                    promise
                      .then(data => {
                        console.log(data);
                        if (data.authCode == 1) {
                          this.getRunNum(encryptedData, ress.iv, codeVal);
                        }
                      })
                      .catch(e => {
                        apiFail(e);
                      });
                    return promise;
                  } else {
                    wx.showToast({
                      title: "获取不到微信步数，先去开启吧~",
                      icon: "none"
                    });
                  }
                },
                fail: e => {
                  console.log(e);
                  that.openSettingState = true;
                  wx.showToast({
                    title: "获取微信步数失败",
                    icon: "none"
                  });
                }
              });
            },
            fail: e => {
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
          wx.showToast({
            title: "授权登录失败",
            icon: "none"
          });
        }
      });
    },
    getRunNum(en, iv, codeVal) {
      let loginInfo = getLoginInfo();
      let queryData = {
        userId: loginInfo.userid,
        encryptedData: en,
        iv: iv,
        jsCode: codeVal
      };
      let url = path.getRunData;
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          console.log(data);
          if (data != null) {
            this.currSteps = data.currSteps;
            if (data.currSteps >= 500) {
              this.animate();
            } else {
              this.getExchangeRule();
            }
            this.exchangeMoney = data.exchangeMoney;
          }
        })
        .catch(e => {
          apiFail(e);
        });
      return promise;
    },
    getExchangeRule() {
      this.ExchangeRule = "";
      let loginInfo = getLoginInfo();
      let queryData = {};
      let url = path.getExchangeRule;
      let promise = this.$fly.get(url, queryData);
      promise
        .then(data => {
          console.log(data);
          this.ExchangeRule = data;
          if (data.length != 0) {
            console.log("z1");
            this.timeState = true;
            if (this.exchangeMoney <= 0) {
              this.dhState = false;
              console.log(this.currSteps);
              console.log(this.ExchangeRule[0].stepNumber);
              console.log("z2");
            } else {
              this.dhState = true;
              console.log("z3");
            }
          } else {
            this.dhState = false;
            this.timeState = false;
            console.log("z4");
          }
        })
        .catch(e => {
          apiFail(e);
          console.log("aa");
        });
      return promise;
    },
    getRankingList() {
      this.ExchangeRule = "";
      let loginInfo = getLoginInfo();
      let queryData = {};
      let url = path.getRankingList;
      let promise = this.$fly.get(url, queryData);
      promise
        .then(data => {
          console.log(data);
          this.rankingList = data;
        })
        .catch(e => {
          apiFail(e);
        });
      return promise;
    },
    getWalletMoney() {
      let url = path.getQueryBalance;
      let loginInfo = getLoginInfo();
      let queryData = {
        userId: loginInfo.userid
      };
      this.$fly.post(url, queryData).then(data => {
        this.minAmount = data.minAmount;
      });
    },
    getExchangeTimePeriod() {
      let loginInfo = getLoginInfo();
      let queryData = {};
      let url = path.getExchangeTimePeriod;
      let promise = this.$fly.get(url, queryData);
      promise
        .then(data => {
          console.log(data);
          this.timePeriod = data;
        })
        .catch(e => {
          apiFail(e);
        });
      return promise;
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  padding-bottom: 0.66rem;
  background: url("http://bqyx-qiniu.bqrzzl.com/accu/head-bg.png") no-repeat top;
  background-color: #d6f1f3;
  background-size: 100% 10.1rem;
  overflow: hidden;
  position: relative;
  .content {
    width: 100%;
    position: relative;
    height: 10.1rem;
    overflow: hidden;
    .rule {
      font-size: 0.22rem;
      color: #fff;
      position: absolute;
      right: 0;
      top: 0.39rem;
      background: #144a59;
      border-top-left-radius: 0.2rem;
      border-bottom-left-radius: 0.2rem;
      overflow: hidden;
      padding: 0.1rem;
      text-align: center;
    }

    .mess-box {
      width: 4.28rem;
      height: 4.28rem;
      background: url("http://bqyx-qiniu.bqrzzl.com/accu/mess-bg.png") no-repeat
        center;
      background-size: 100% 100%;
      text-align: center;
      overflow: hidden;
      position: absolute;
      left: 50%;
      -webkit-transform: translateX(-50%);
      top: 1.8rem;
      .label {
        font-size: 0.28rem;
        color: #2cbba8;
        width: 100%;
        overflow: hidden;
        margin-top: 1rem;
      }
      .total-step {
        font-size: 0.5rem;
        color: #2dac9b;
        font-weight: bold;
        margin: 0.18rem 0 0.15rem 0;
      }
      .money {
        font-size: 0.3rem;
        color: #ed5502;
        margin-bottom: 0.05rem;
      }
      .dh-btn {
        font-size: 0.24rem;
        color: #fff;
        padding: 0.05rem 0.2rem;
        background: #144a59;
        border-radius: 0.19rem;
        display: inline-block;
      }
      .dh-btn.disable {
        background: #ddd;
      }
    }
    .share-btn {
      width: 5rem;
      height: 0.89rem;
      background: linear-gradient(
        90deg,
        rgba(44, 159, 141, 1) 0%,
        rgba(70, 181, 166, 1) 100%
      );
      border-radius: 0.45rem;
      position: relative;
      margin: 0 auto;
      margin-top: 6rem;
      p {
        width: 5rem;
        height: 0.8rem;
        background: linear-gradient(
          90deg,
          rgba(41, 185, 166, 1) 0%,
          rgba(87, 216, 199, 1) 100%
        );
        border-radius: 0.4rem;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        font-size: 0.36rem;
        color: #fff;
        line-height: 0.8rem;
        text-align: center;
        font-weight: bold;
      }
    }
    .tips {
      width: 100%;
      overflow: hidden;
      text-align: center;
      font-size: 0.28rem;
      color: #feae00;
      text-shadow: 0px 3px 4px rgba(0, 0, 0, 1);
      margin-top: 0.2rem;
    }
    .step-rule-box {
      text-align: center;
      margin-top: 0.25rem;
      width: 100%;
      box-sizing: border-box;
      height: 1.66rem;
      overflow: hidden;
      white-space: nowrap;
      .list {
        width: 1.58rem;
        height: 1.54rem;
        background: rgba(130, 196, 193, 1);
        border-radius: 0.2rem;
        position: relative;
        display: inline-block;
        margin-left: 0.2rem;
        margin-top: 0.1rem;
        .box {
          width: 1.58rem;
          height: 1.54rem;
          background: linear-gradient(
            0deg,
            rgba(247, 255, 255, 1),
            rgba(221, 255, 254, 1)
          );
          border-radius: 0.2rem;
          position: absolute;
          left: 0;
          top: -0.07rem;
          text-align: center;
          .label {
            color: #144a59;
            font-size: 0.3rem;
            margin-top: 0.15rem;
          }
          .label1 {
            color: #144a59;
            font-size: 0.24rem;
            margin: 0.1rem 0;
            span {
              color: #ed5e19;
            }
          }
          .label2 {
            color: #144a59;
            font-size: 0.24rem;
            margin: 0.1rem 0;
            span {
              color: #ed5e19;
            }
          }
        }
      }
      .list:last-child {
        margin-right: 0.2rem;
      }
    }
    .clear {
      clear: both;
    }
  }
  .section {
    width: 100%;
    overflow: hidden;
    position: relative;
    .active-time {
      width: 100%;
      text-align: center;
      color: #ed5502;
      font-size: 0.28rem;
      margin-top: 0.3rem;
      p {
        display: inline-block;
        margin-right: 0.2rem;
      }
    }
    .title {
      font-size: 0.4rem;
      color: #144a59;
      padding-left: 0.32rem;
      margin-top: 0.3rem;
      margin-bottom: 0.52rem;
    }
    .hd {
      background: rgba(46, 188, 169, 0.17);
      border-radius: 0.23rem;
      margin: 0 0.37rem;
      line-height: 0.45rem;
      height: 0.45rem;
      position: relative;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      -webkit-box-align: center;
      -webkit-align-items: center;
      align-items: center;
      font-size: 0.22rem;
      color: #144a59;
      font-weight: bold;
      .li1 {
        width: 0.82rem;
        text-align: center;
        padding-right: 0.1rem;
      }
      .li2 {
        flex: 1;
      }
      .li3 {
        width: 1rem;
        padding-right: 0.26rem;
        text-align: right;
      }
    }
    .bd {
      margin: 0 0.37rem;
      overflow: hidden;
      margin-top: 0.46rem;
      li {
        height: 1.1rem;
        position: relative;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        .rank {
          width: 0.82rem;
          text-align: center;
          padding-right: 0.1rem;
          font-size: 0.28rem;
          color: #144a59;
        }
        .name {
          flex: 1;
          font-size: 0.24rem;
          color: #144a59;
        }
        .step {
          width: 1rem;
          padding-right: 0.26rem;
          text-align: right;
          font-size: 0.24rem;
          color: #144a59;
        }
      }
      li:after {
        content: " ";
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        height: 1px;
        border-bottom: 1px solid #144a59;
        color: #144a59;
        -webkit-transform-origin: 0 100%;
        transform-origin: 0 100%;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
        z-index: 2;
        opacity: 0.15;
      }
      li:nth-child(1) .rank span {
        width: 0.4rem;
        height: 0.53rem;
        background: url("http://bqyx-qiniu.bqrzzl.com/accu/rank_one.png")
          no-repeat center;
        background-size: 100% 100%;
        display: block;
        margin: 0 auto;
        font-size: 0;
      }
      li:nth-child(2) .rank span {
        width: 0.4rem;
        height: 0.53rem;
        background: url("http://bqyx-qiniu.bqrzzl.com/accu/rank_two.png")
          no-repeat center;
        background-size: 100% 100%;
        display: block;
        margin: 0 auto;
        font-size: 0;
      }
      li:nth-child(3) .rank span {
        width: 0.4rem;
        height: 0.53rem;
        background: url("http://bqyx-qiniu.bqrzzl.com/accu/rank_three.png")
          no-repeat center;
        background-size: 100% 100%;
        display: block;
        margin: 0 auto;
        font-size: 0;
      }
    }
  }
  .pop-bg {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 999;
    .pop {
      width: 4.8rem;
      height: 4.71rem;
      background: rgba(255, 255, 255, 1);
      border-radius: 0.2rem;
      position: absolute;
      left: 50%;
      top: 50%;
      -webkit-transform: translate(-50%, -50%);
      text-align: center;
      .title {
        font-size: 0.46rem;
        color: #2dac9b;
        margin-top: 0.8rem;
        margin-bottom: 0.54rem;
      }
      .desc {
        width: 100%;
        font-size: 0.28rem;
        color: #000;
        line-height: 0.5rem;
        margin-bottom: 0.57rem;
      }
      .comfirm-btn {
        width: 2.8rem;
        height: 0.7rem;
        background: linear-gradient(
          180deg,
          rgba(85, 215, 198, 1),
          rgba(41, 185, 167, 1)
        );
        border-radius: 0.35rem;
        margin: 0 auto;
        display: block;
        font-size: 0.32rem;
        color: #fff;
        line-height: 0.7rem;
      }
    }
  }
  .rule-bg {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 999;
    .rule {
      width: 6.1rem;
      background: #62d8c8;
      border-radius: 0.5rem;
      position: absolute;
      left: 50%;
      padding-bottom: 0.89rem;
      top: 50%;
      -webkit-transform: translate(-50%, -55%);
      text-align: center;
      .title {
        width: 100%;
        font-size: 0.34rem;
        color: #007278;
        margin-top: 0.5rem;
        margin-bottom: 0.61rem;
        font-weight: bold;
      }
      ul {
        padding: 0 0.57rem;
        li {
          font-size: 0.24rem;
          color: #007278;
          text-align: left;
          margin-bottom: 0.1rem;
          line-height: 0.4rem;
        }
      }
      .close {
        width: 0.57rem;
        height: 0.57rem;
        background: url("http://bqyx-qiniu.bqrzzl.com/sweep/close-icon.png")
          no-repeat center;
        background-size: 100% 100%;
        position: absolute;
        left: 50%;
        -webkit-transform: translateX(-50%);
        bottom: -1rem;
      }
    }
  }
  .enjoy {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.4);
    overflow: hidden;
    z-index: 99;
    .enjoy_main {
      position: fixed;
      width: 100%;
      height: 316rpx;
      background-color: #ffffff;
      bottom: 0;
      padding-top: 100rpx;
      .button {
        width: 100%;
        display: flex;
        flex-direction: row;
        button {
          width: 50%;
          height: 100px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          border-radius: 0;
          img {
            margin: 0 auto;
            padding-top: 18rpx;
          }
        }
        button::after {
          border: none;
        }
        p {
          font-size: 32rpx;
        }
      }
      .buttom {
        text-align: center;
        font-size: 34rpx;
        line-height: 34rpx;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        padding-top: 48rpx;
      }
    }
    .weChat {
      width: 80rpx;
      height: 80rpx;
    }
    .friend {
      width: 80rpx;
      height: 80rpx;
    }
  }
  .backHome {
    width: 0.6rem;
    height: 0.6rem;
    position: absolute;
    left: 0.3rem;
    top: 0.3rem;
    z-index: 99;
    img {
      width: 0.6rem;
      height: 0.6rem;
    }
  }
  .primary-pop {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.4);
    overflow: hidden;
    z-index: 99;
    .primary {
      width: 4rem;
      background: #fff;
      border-radius: 0.2rem;
      position: absolute;
      left: 50%;
      padding-bottom: 0.4rem;
      top: 50%;
      -webkit-transform: translate(-50%, -55%);
      text-align: center;
      .title {
        font-size: 0.3rem;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
      }
      .openSetting {
        width: 2.8rem;
        height: 0.7rem;
        background: linear-gradient(
          180deg,
          rgba(85, 215, 198, 1),
          rgba(41, 185, 167, 1)
        );
        border-radius: 0.35rem;
        margin: 0 auto;
        display: block;
        font-size: 0.32rem;
        color: #fff;
        line-height: 0.7rem;
      }
    }
  }
}
</style>
