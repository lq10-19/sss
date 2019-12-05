<template>
  <div class="bigbox">
    <!--头部-->
    <div class="header">
      <div class="title-line">
        <div class="title-box">
          <span>
            <img @click="goSet" class="reset" src="../../../static/img/reset.png">
          </span>
        </div>
      </div>
      <div class="logo-line">
        <div class="mylogo">
          <img :src="avatarurl">
        </div>
        <div class="mark-box">
          <p v-if="hasUserInfo">你好:{{nickname}}，欢迎使用佰仟易行</p>
          <p v-if="!hasUserInfo">
            <label @click="goLogin">登录</label>
          </p>
          <!-- <form class="formSubmit" @submit="submitInfo" report-submit='true' >
            <button form-type="submit" class="sign-btn">每日签到</button>
          </form>-->
        </div>
      </div>
    </div>
    <div class="module-wrap">
      <div class="module-box" @click="goWallet">
        <p class="label">账户余额</p>
        <p class="val">{{money}}元</p>
      </div>
      <span class="line"></span>
      <div class="module-box" @click="goMyVb">
        <p class="label">我的V币</p>
        <p class="val">{{vbNum}}</p>
      </div>
    </div>
    <div class="module-other-wrap">
      <p class="title">我的订单</p>
      <ul>
        <li @click="goShopOrder">
          <img src="http://bqyx-qiniu.bqrzzl.com/mp/shop.png">
          <p>商城订单</p>
        </li>
        <li @click="goCzyr">
          <img src="http://bqyx-qiniu.bqrzzl.com/mp/chedirong.png">
          <p>好车易融订单</p>
        </li>
        <li @click="goCdd">
          <img src="http://bqyx-qiniu.bqrzzl.com/jirong@2x.png">
          <p>佰车融订单</p>
        </li>
        <!-- <li @click="goCenter">
          <img src="http://bqyx-qiniu.bqrzzl.com/mp/jinrong.png" />
          <p>金融订单</p>
        </li>-->
        <li @click="goBxdd">
          <img src="http://bqyx-qiniu.bqrzzl.com/order@2x.png">
          <p>保险分期订单</p>
        </li>
      </ul>
    </div>

    <div class="module-other">
      <ul>
        <li @click="goAppointment">
          <p class="p_public p_img">
            <img src="/static/user/yuyue.png">
          </p>
          <p class="p_public p_title">我的预约</p>
          <p class="p_public p_detail"></p>
        </li>
      </ul>
    </div>

    <!-- <div class="module-other">
      <ul>
        <li @click="goPay">
          <p class="p_public p_img"><img src="/static/user/money@3x.png"></p>
          <p class="p_public p_title">我要还款</p>
          <p class="p_public p_detail"></p>
        </li>
        <li @click="goQm" class="li_goqm">
          <p class="p_public p_img"><img src="/static/user/yijian1@3x.png"></p>
          <p class="p_public p_title">电子签约</p>
          <p class="p_public p_detail"></p>
        </li>
      </ul>
    </div>-->

    <div class="module-other">
      <ul>
        <li @click="goZacx" class="list">
          <p class="p_public p_img">
            <img src="/static/user/baoxian.png">
          </p>
          <div class="bd">
            <p class="p_public p_title">底价车险</p>
            <p class="p_desc">为您的爱车保驾护航</p>
          </div>
          <p class="p_public p_detail"></p>
        </li>
        <!-- <li @click="goVbsc" class="list">
          <p class="p_public p_img"><img src="/static/user/icon_VB@2x.png"></p>
          <div class="bd">
            <p class="p_public p_title">每日V币任务</p>
            <p class="p_desc">每日V币任务</p>
          </div>
          <p class="p_public p_detail"></p>
        </li>-->
        <!-- <li @click="goCarLoan" class="list">
          <p class="p_public p_img"><img src="/static/user/baoxian.png"></p>
          <div class="bd">
            <p class="p_public p_title">电子签约</p>
            <p class="p_desc">活体识别OCR</p>
          </div>
          <p class="p_public p_detail"></p>
        </li>-->
        <button class="li_goqm list" open-type="share">
          <p class="p_public p_img">
            <img src="/static/user/zu.png">
          </p>
          <div class="bd">
            <p class="p_public p_title">邀请好友</p>
            <p class="p_desc">邀请好友一起玩佰仟易行</p>
          </div>
          <p class="p_public p_detail"></p>
        </button>
      </ul>
    </div>

    <!--帮助中心及意见反馈-->
    <div class="module-other">
      <ul>
        <li @click="goAddress">
          <p class="p_public p_img">
            <img src="/static/user/address@3x.png">
          </p>
          <div class="bd">
            <p class="p_public p_title">我的收货地址</p>
            <p class="p_desc">管理我的地址</p>
          </div>
          <p class="p_public p_detail"></p>
        </li>
        <li @click="goHelp">
          <p class="p_public p_img">
            <img src="/static/img/bangzhu.png">
          </p>
          <div class="bd">
            <p class="p_public p_title">帮助中心</p>
            <p class="p_desc">常见问题解答</p>
          </div>
          <p class="p_public p_detail"></p>
        </li>
        <li @click="goSuggest">
          <p class="p_public p_img">
            <img src="/static/img/yijian.png">
          </p>
          <div class="bd">
            <p class="p_public p_title">意见反馈</p>
            <p class="p_desc">反馈你的问题和建议</p>
          </div>
          <p class="p_public p_detail"></p>
        </li>
        <li @click="goMoblie">
          <p class="p_public p_img">
            <img src="/static/user/phone@2x.png">
          </p>
          <div class="bd">
            <p class="p_public p_title">联系客服</p>
            <p class="p_desc">400-998-7103</p>
          </div>
          <p class="p_public p_detail"></p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import utils from "@/utils/index";
import {
  path,
  dataConfig,
  getUserInfo,
  getLoginInfo,
  isBindPhone,
  event
} from "@/utils/index";

export default {
  data() {
    return {
      hasUserInfo: false,
      avatarurl: "/static/img/mylogo.png",
      nickname: "",
      money: "",
      //是否去过绑定手机号页面
      goBindPhonePage: false,
      //是否去过登录页面
      goLoginPage: false,
      vbNum: 0 //用户V币数量
    };
  },
  onLoad() {},
  onShow() {
    if (this.loadUserInfo()) {
      utils.showLoading(this.getWalletMoney());
    }
    //获取V币余额
    this.queryBalance();
    //获取用户信息
    this.getInfo();
  },
  onShareAppMessage() {
    return {
      title: "佰仟易行",
      path: "/pages/home/main",
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    };
  },
  methods: {
    //获取用户信息
    getInfo() {
      let url = path.getInfo;
      let queryData = {
        userId: getLoginInfo().userid
      };
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          this.avatarurl = data.avatarUrl;
          this.nickname = data.nickname;
        })
        .catch(e => {
          apiFail(e);
        });
    },
    loadUserInfo() {
      if (!getLoginInfo()) {
        if (this.goLoginPage) {
          this.goLoginPage = false;
          wx.switchTab({
            url: "/pages/home/main"
          });
          return false;
        } else {
          this.goLoginPage = true;
          const url = "/pages/login/main";
          wx.navigateTo({ url });
          return false;
        }
      }
      let loginInfo = utils.getLoginInfo();
      let userInfo = utils.getUserInfo();
      this.hasUserInfo = true;
      return true;
    },
    goHelp() {
      const url = "help/main";
      wx.navigateTo({ url });
    },
    goSuggest() {
      if (isBindPhone()) {
        const url = "feedback/main";
        wx.navigateTo({ url });
      } else {
        const url = "/pages/login/bindPhone/main";
        wx.navigateTo({ url });
      }
    },
    goLogin() {
      const url = "../login/main";
      wx.navigateTo({ url });
    },
    register() {
      const url = "../login/bindPhone/main";
      wx.navigateTo({ url });
    },
    goZacx() {
      wx.navigateTo({
        url: "/pages/djcx/main"
      });
    },
    goCenter() {
      getApp().aldstat.sendEvent(event["my.finance.order"]);
      wx.navigateTo({
        url: "/pages/jrdd/main"
      });
    },
    goWallet() {
      getApp().aldstat.sendEvent(event["my.balance"]);
      wx.navigateTo({
        url: "/pages/user/wallet/main"
      });
    },
    getWalletMoney() {
      let url = path.getQueryBalance;
      let loginInfo = getLoginInfo();
      let queryData = {
        userId: loginInfo.userid
      };
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          this.money = data.accountBalance;
        })
        .catch(e => {
          console.log(e);
          wx.showToast({
            title: "系统异常",
            icon: "none"
          });
        });
      return promise;
    },
    goSet() {
      const url = "./setting/main";
      wx.navigateTo({ url });
    },
    goQm() {
      getApp().aldstat.sendEvent(event["my.sign"]);
      if (!utils.isBindPhone()) {
        wx.navigateTo({
          url: "/pages/login/bindPhone/main"
        });
      } else {
        wx.navigateTo({
          url: "/pages/qm/main"
        });
      }
      // wx.navigateTo({
      //   url: "/pages/gzh/main?action=/qm/index"
      // });
    },
    goAddress() {
      getApp().aldstat.sendEvent(event["my.address"]);
      wx.navigateTo({
        url: "/pages/user/address/main"
      });
    },
    goShopOrder() {
      getApp().aldstat.sendEvent(event["my.shop.order"]);
      wx.navigateTo({
        url: "/pages/user/shopOrder/main"
      });
    },
    goMoblie() {
      wx.makePhoneCall({
        phoneNumber: "4009987103",
        success() {
          console.log("succ");
        }
      });
    },
    goPay() {
      getApp().aldstat.sendEvent(event["my.repayment"]);
      if (!utils.isBindPhone()) {
        wx.navigateTo({
          url: "/pages/login/bindPhone/main"
        });
      } else {
        wx.navigateTo({
          //url: "/pages/gzh/main?action=/initiative-repayment"
          url: "/pages/wxpay/main"
        });
      }
    },
    goSign() {
      wx.navigateTo({
        url: "/pages/service/sign/main"
      });
    },
    submitInfo(e) {
      console.log(e);
      this.showSignPop = false;
      wx.navigateTo({
        url: "/pages/service/sign/main?backShow=false"
      });
      let url = path.clickSign;
      let formId = e.mp.detail.formId;
      console.log(formId);
      let loginInfo = getLoginInfo();
      let queryData = {
        userId: loginInfo.userid,
        formId: formId
      };
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          console.log(data);
        })
        .catch(e => {
          apiFail(e);
        });
      return promise;
    },
    goCzyr() {
      getApp().aldstat.sendEvent(event["home.czyr.apply"]);
      if (!getLoginInfo()) {
        const url = "/pages/login/main";
        wx.navigateTo({ url });
        return;
      }
      if (!isBindPhone()) {
        wx.navigateTo({
          url: "/pages/login/bindPhone/main"
        });
        return;
      }
      // wx.navigateTo({
      //   url: "/pages/czyr/main"
      // });
      wx.showToast({
        title: "即将上线，尽情期待",
        icon: "none"
      });
    },
    //车抵贷订单
    goCdd() {
      if (isBindPhone()) {
        wx.navigateTo({
          url: "/pages/user/cdd/main"
        });
      } else {
        const url = "/pages/login/bindPhone/main";
        wx.navigateTo({ url });
      }
    },
    //保险分期订单
    goBxdd() {
      if (isBindPhone()) {
        let userId = getLoginInfo().userid;
        let userType = "1";
        //userId = encodeURIComponent(userId);
        console.log(userId,888)
        wx.navigateTo({
          url: `/pages/user/bxdd/main?userId=${userId}&userType=${userType}`
        });
      } else {
        const url = "/pages/login/bindPhone/main";
        wx.navigateTo({ url });
      }
    },
    //获取V币余额
    queryBalance() {
      let url = path.queryBalance;
      let queryData = {
        userId: getLoginInfo().userid
        //userId: "7dac24c95e7c4d829002537f5192b5b6"
      };
      let promises = this.$fly.post(url, queryData);
      promises
        .then(data => {
          this.vbNum = data.vcoinBalance;
        })
        .catch(e => {
          apiFail(e);
        });
    },
    goVbsc() {
      wx.navigateTo({
        url: `/pages/service/vb/main`
      });
    },
    goCarLoan() {
      wx.navigateTo({
        url: `/pages/carLoan/main`
      });
    },
    goMyVb() {
      wx.showToast({
        title: "敬请期待",
        icon: "none"
      });
      // wx.navigateTo({
      //   url: `/pages/service/vb/myVb/main`,
      // });
    },
    goAppointment() {
      wx.navigateTo({
        url: `/pages/user/appointment/main`
      });
    }
  }
};
</script>

<style lang="scss" scoped>
$jbColorTop: rgba(255, 224, 86, 1);
$jbColorBottom: #ffcc00;
.bigbox {
  // width: 100%;
  height: 100%;
  background: #f6f6f6;
  padding-bottom: 0.46rem;
}
.header {
  width: 100%;
  height: 3.35rem;
  background: linear-gradient(146deg, $jbColorTop, $jbColorBottom);
  .title-line {
    width: 100%;
    height: 0.48rem;
    padding-top: 0.3rem;
    .title-box {
      font-size: 36rpx;
      text-align: right;
      color: white;
      .reset {
        width: 0.35rem;
        height: 0.35rem;
        margin-left: 36%;
        margin-right: 0.3rem;
        // background: url("../../../static/img/reset.png") no-repeat center/100%;
      }
    }
  }
  .logo-line {
    width: 100%;
    height: 1.3rem;
    margin-top: 0.35rem;
    .mylogo {
      width: 1.2rem;
      height: 1.2rem;
      float: left;
      margin-left: 0.44rem;
      img {
        display: block;
        border-radius: 1.2rem;
        width: 1.2rem;
        height: 1.2rem;
        border-radius: 50%;
      }
    }
    .mark-box {
      float: left;
      margin-left: 0.3rem;
      margin-top: 0.1rem;
      p {
        display: block; // width: 100%;
        width: 200px;
        font-size: 0.32rem;
        font-weight: 500;
        color: #000;
        text-overflow: ellipsis;
        overflow: hidden;
        // white-space: pre-wrap;
        white-space: nowrap;
      }
      label {
        padding-left: 8px;
      }
    }
    .user-more {
      float: right;
      margin-top: 0.5rem;
      margin-right: 0.3rem;
      p {
        display: inline-block;
        width: 0.12rem;
        height: 0.22rem; // background: url("../../../static/images/user_more.png") no-repeat center/100%;
      }
    }
  }
}
.module-wrap {
  height: 1.7rem;
  background: #fff;
  border-radius: 0.16rem;
  margin: 0 0.2rem;
  margin-top: -0.45rem;
  position: relative;
  .module-box {
    width: 50%;
    float: left;
    text-align: center;
    .label {
      font-size: 0.28rem;
      color: #666;
      margin-bottom: 0.1rem;
      margin-top: 0.4rem;
    }
    .val {
      font-size: 0.34rem;
      color: #000;
      font-weight: bold;
    }
  }
  .line {
    background: #dddddd;
    width: 1px;
    height: 1rem;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
  }
}
.module-other-wrap {
  background: #fff;
  border-radius: 0.16rem;
  margin: 0.2rem 0.2rem;
  position: relative;
  overflow: hidden;
  padding: 0.37rem 0;
  .title {
    font-size: 0.34rem;
    color: #000;
    font-weight: bold;
    margin: 0rem 0.3rem;
    overflow: hidden;
    width: 100%;
    margin-bottom: 0.3rem;
  }
  ul {
    display: flex;
    justify-content: space-around;
  }
  li {
    float: left;
    text-align: center;
    img {
      width: 0.8rem;
      height: 0.8rem;
    }
    p {
      font-size: 0.26rem;
      color: #000;
    }
  }
  // li:nth-child(1) {
  //   width: 25%;
  // }
  // li:nth-child(2) {
  //   width: 25%;
  // }
  // li:nth-child(3) {
  //   width: 25%;
  // }
  // li:nth-child(4) {
  //   width: 25%;
  // }
}
.module-money {
  width: 100%;
  background: #fff;
  margin-top: 0.3rem;
  ul {
    li {
      width: 100%;
      height: 108rpx;
      display: flex;
      flex-direction: row;
      border-top: 2rpx solid #f3f3f3;
      .p_public {
        font-weight: 500;
        margin-top: 4.5%;
        font-family: PingFangSC-Regular;
        color: rgba(0, 0, 0, 1);
      }
      img {
        line-height: 108rpx;
        height: 36rpx;
        width: 36rpx;
      }
      .p_img {
        margin-left: 0.3rem;
        justify-content: center;
        align-items: center;
      }
      .p_title {
        margin-left: 0.2rem;
        font-size: 0.32rem;
        font-family: PingFangSC-Regular;
      }
      .p_flag {
        margin-right: 0.2rem;
        font-size: 0.28rem;
        color: rgba(153, 153, 153, 1);
        width: 63.5%;
        text-align: right;
      }
      .p_detail {
        width: 12rpx;
        height: 22rpx;
        margin-top: 6%;
        line-height: 108rpx;
        float: right;
        background: url("../../../static/img/right_arrow.png") no-repeat
          center/100%;
      }
    }
  }
}
.module-other {
  background: #fff;
  margin: 0.2rem 0.2rem 0 0.2rem;
  overflow: hidden;
  border-radius: 0.16rem;
  ul {
    li,
    .list {
      width: 100%;
      min-height: 108rpx;
      display: flex;
      flex-direction: row;
      position: relative;
      background: none;
      line-height: 1;
      border-radius: 0;
      font-size: auto;
      padding: 0;
      text-align: left;
      .p_public {
        font-weight: 500;
        font-family: PingFangSC-Regular;
        color: rgba(0, 0, 0, 1);
      }
      img {
        line-height: 108rpx;
        height: 36rpx;
        width: 36rpx;
      }
      .p_img {
        margin-left: 0.3rem;
        justify-content: center;
        align-items: center;
        padding-top: 0.3rem;
      }
      .p_title {
        margin-left: 0.2rem;
        font-size: 0.32rem;
        font-family: PingFangSC-Regular;
        flex: 1;
        padding-top: 0.3rem;
      }
      .p_flag {
        float: right;
        margin-right: 0.2rem;
        font-size: 0.28rem;
        color: rgba(153, 153, 153, 1);
      }
      .p_detail {
        width: 18rpx;
        height: 28rpx;
        position: absolute;
        top: 50%;
        right: 0.3rem;
        -webkit-transform: translateY(-50%);
        background: url("../../../static/img/right_arrow.png") no-repeat
          center/100%;
      }
      .p_desc {
        margin-left: 0.2rem;
        font-size: 0.26rem;
        color: #a9a9a9;
        margin-top: 0.1rem;
        padding-bottom: 0.3rem;
      }
    }
    .list:after {
      border: none;
    }
  }
}
.module-anthoer {
  background: #fff;
  margin: 0.2rem 0.2rem 0 0.2rem;
  overflow: hidden;
  border-radius: 0.16rem;
  ul {
    li {
      width: 100%;
      height: 100rpx;
      .p_public {
        display: inline-block;
        height: 1rem;
        font-weight: 500;
        line-height: 1rem;
        font-family: PingFangSC-Regular;
        color: rgba(0, 0, 0, 1);
      }
      img {
        display: block;
        margin-top: 0.32rem;
        height: 18px;
        width: 18px;
      }
      .p_img {
        margin-left: 0.3rem;
        float: left;
      }
      .p_title {
        margin-left: 0.2rem;
        float: left;
        font-size: 0.32rem;
        font-family: PingFangSC-Regular;
      }
      .p_flag {
        float: right;
        margin-right: 0.2rem;
        font-size: 0.28rem;
        color: rgba(153, 153, 153, 1);
      }
      .p_detail {
        width: 0.12rem;
        height: 0.22rem;
        margin-top: 0.39rem;
        margin-right: 0.3rem;
        float: right;
        background: url("../../../static/img/right_arrow.png") no-repeat
          center/100%;
      }
    }
  }
}
.header .logo-line .mark-box .sign-btn {
  background: #fff;
  color: #000;
  font-size: 0.25rem;
  border-radius: 0.21rem;
  width: 1.44rem;
  height: 0.42rem;
  line-height: 0.42rem;
  text-align: center;
  margin-top: 0.17rem;
}
.formSubmit {
  button {
    padding: 0;
    background: none;
    color: #fff;
    border: none;
    text-align: left;
    float: left;
  }
  button:after {
    border: none;
    box-shadow: none;
  }
  button:before {
    border: none;
    box-shadow: none;
  }
}
</style>
