<template>
  <div class="main">
    <div class="redBag" v-show="redBag">
      <img
        src="http://bqyx-qiniu.bqrzzl.com/redbag3@2x.png"
        @click="toInvitation"
        class="redBag_img"
      >
      <img src="/static/redBag/x@2x.png" alt class="redBag_close" @click="getClose">
    </div>
    <div class="main_bg">
      <div class="main_box">
        <div class="top">
          <span class="span1">账户余额</span>
          <span class="span2">{{money}}元</span>
        </div>
        <div class="text">
          <div class="title">输入提现金额（元）</div>
          <div class="money">
            <p>￥</p>
            <input v-model="cash" @input="filterNumber" type="number">
          </div>
          <div style="margin-left:24px;width:303px;height:1px;background:#F2F3F5;"></div>
          <p class="toast">提现{{minAmount}}元起</p>
          <!-- <p>，当前最多可提现{{maxAmount}}元</p> -->
          <button class="btn" :class="{ disabled: btnDisabled }" @click="getCash">{{cashBtnText}}</button>
          <div class="record" @click="goRecord">
            <p style="font-size:13px;color:#8B98C5">账户明细</p>
            <img src="/static/user/arrow@3x.png" alt>
          </div>
        </div>
      </div>
      <div class="rule">
        <p class="title">提现规则</p>
        <p v-for="(item,index) in rules" :key="index">{{item.rule}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import {
  path,
  dataConfig,
  getLoginInfo,
  isBindPhone,
  event,
  lastPutForwardTime
} from "@/utils/index";

export default {
  data() {
    return {
      redBag: false,
      money: 0,
      cash: 0,
      minAmount: 0,
      maxAmount: 0,
      timer: [-1, -1],
      btnDisabled: false,
      cashBtnText: "提现",
      rules: ''
    };
  },
  onLaod() {
    this.getWalletMoney();
  },
  onShow() {
    this.getWalletMoney();
    this.getActivity();
    this.rule();
    //let lastTime = lastPutForwardTime.get();
    //if (lastTime && Date.now() < lastTime + dataConfig.cooldownTimeCycle) {
    //冷却
    // this.btnDisabled = true;
    // this.timer[0] = setTimeout(() => {
    //   this.btnDisabled = false;
    //   clearInterval(this.timer[1]);
    //   this.cashBtnText = "提现";
    // }, dataConfig.putForwardCooldownTime);
    // let tempTime = dataConfig.putForwardCooldownTime / 1000;
    // this.cashBtnText = `提现(${tempTime})`;
    // this.timer[1] = setInterval(() => {
    //   tempTime--;
    //   this.cashBtnText = `提现(${tempTime})`;
    // }, 1000);
    //}
  },
  onHide() {
    // clearTimeout(this.timer[0]);
    // clearInterval(this.timer[1]);
  },
  methods: {
    filterNumber() {
      this.cash = this.cash.replace(/[^\d]/g, "");
    },
    goRecord() {
      wx.navigateTo({
        url: "/pages/user/walletRecord/main"
      });
    },
    toInvitation() {
      wx.navigateTo({
        url: "/pages/service/redBag/main"
      });
    },
    getClose() {
      this.redBag = false;
    },
    getWalletMoney() {
      let url = path.getQueryBalance;
      let loginInfo = getLoginInfo();
      let queryData = {
        userId: loginInfo.userid
      };
      this.$fly.post(url, queryData).then(data => {
        this.money = data.accountBalance;
        this.minAmount = data.minAmount;
        this.maxAmount = data.maxAmount;
      });
    },
    /**
     * 提现
     */
    getCash() {
      getApp().aldstat.sendEvent(event["my.withdraw.cash.1"]);
      if (this.btnDisabled) {
        return;
      }
      if (!isBindPhone()) {
        wx.navigateTo({
          url: "/pages/login/bindPhone/main"
        });
        return;
      }
      let cash = this.cash;
      cash = parseFloat(cash);
      if (isNaN(cash)) {
        this.cash = 0;
        wx.showToast({
          title: "请输入合法金额",
          icon: "none"
        });
        return;
      }
      if (cash <= 0) {
        wx.showToast({
          title: "请输入合法金额",
          icon: "none"
        });
        return;
      }
      if (this.money < this.cash) {
        wx.showToast({
          title: "余额不足",
          icon: "none"
        });
        return;
      }
      if (this.cash < this.minAmount) {
        wx.showToast({
          title: "提现"+this.minAmount+"元起",
          icon: "none"
        });
        return;
      }
      if (this.cash > this.maxCash) {
        wx.showToast({
          title: `最多可提现${this.maxCash}`,
          icon: "none"
        });
        return;
      }
      wx.navigateTo({
        url: `/pages/user/putForward/main?cash=${cash}`
      });
    },
    /**
     * 查看活动
     */
    getActivity() {
      let url = path.getActivity;
      let loginInfo = getLoginInfo();
      let queryData = {
        userId: loginInfo.userid,
        sourceType: dataConfig.sourceType
      };
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          if (data == null) {
            this.redBag = false;
          } else {
            this.redBag = true;
          }
        })
        .catch(e => {
          apiFail(e);
        });
      return promise;
    },
    rule(){
      this.ruleShow = true;
      let url = path.getwalletRules;
      let loginInfo = getLoginInfo();
      let queryData = {
        
      };
      let promise = this.$fly.get(url, queryData);
      promise
        .then(data => {
          if(data != null){
              this.rules = data;
          }
          console.log(this.rules);
        })
        .catch(e => {
          apiFail(e);
        });
      return promise;
    }
  },
  computed: {
    // maxCash() {
    //   if (this.money < 10) {
    //     return 0;
    //   }
    //   return this.money - this.money % 10;
    // }
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
  .redBag {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    overflow: hidden;
    z-index: 99999;
    .redBag_img {
      width: 272px;
      margin-left: 54px;
      margin-top: 150px;
      position: relative;
    }
    .redBag_close {
      position: relative;
      display: flex;
      justify-content: center;
      margin: auto;
      margin-top: 45px;
      width: 24px;
      height: 24px;
    }
  }
  .main_bg {
    padding: 15px 15px 0 15px;
    .main_box {
      width: 100%;
      height: 350px;
      // display: flex;
      background: #ffffff;
      border-radius: 13px 13px;
      .top {
        width: 100%;
        height: 64px;
        background: linear-gradient(180deg,$jbColorTop, $jbColorBottom);
        border-radius: 13px 13px 0 0;
        display: flex;
        flex-direction: row;
        // justify-content: space-between;
        span {
          line-height: 64px;
          color: #000;
        }
        .span1 {
          margin-left: 10px;
        }
        .span2 {
          position: absolute;
          right: 50rpx;
        }
      }
      .text {
        .title {
          font-size: 20px;
          font-weight: bold;
          color: #000000;
          margin-top: 35px;
          margin-left: 17px;
        }
        .money {
          display: flex;
          flex-direction: row;
          p {
            color: #000000;
            font-size: 20px;
            margin-top: 32px;
            margin-left: 25px;
            font-weight: bold;
          }
          input {
            width: 300px;
            height: 30px;
            margin-top: 30px;
          }
        }
        .toast {
          margin-left: 24px;
          color: #999999;
          font-size: 13px;
          margin-top: 10px;
        }
        .btn {
          width: 294px;
          height: 45px;
          background: linear-gradient(180deg,$jbColorTop, $jbColorBottom);
          margin-top: 29px;
          border-radius: 23px;
          color: #000;
        }
        .btn:after{
          border: none;
        }
        .disabled {
          background: none;
          background-color: #a9a9a9 !important;
        }
        img {
          width: 14px;
          height: 10px;
          margin-left: 5px;
        }
        .record {
          display: flex;
          flex-direction: flex;
          justify-content: center;
          align-items: center;
          margin-top: 30px;
        }
      }
    }
  }
  .rule {
    margin-top: 70rpx;
    color: #999999;
    font-size: 28rpx;
    .title {
      font-weight: 500;
      color: #000;
    }
    p {
      margin-bottom: 14rpx;
    }
  }
}
</style>
