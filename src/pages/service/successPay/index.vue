<template>
    <div class="main">
        <div class="header" v-if="resultData.status === 3">
            <img src="/static/oil/icon_succeed@3x.png" alt="" class="header_img">
            <span class="header_span">已成功充值{{resultData.rechargeAmount}}元！</span>
        </div>
        <div class="header" v-if="resultData.status === 1">
            <img src="/static/oil/icon_succeed@3x.png" alt="" class="header_img">
            <span class="header_span">充值中</span>
        </div>
        <div class="header header-fail" v-if="resultData.status === 2">
            <img src="/static/oil/icon_fail@3x.png" alt="" class="header_img">
            <span class="header_span">充值失败</span>
            <p class="fail-tip">您支付的金额会原路退回至您的账户中</p>
        </div>
        <div class="text">
            <ul class="left">
                <li class="left_li">加油卡号</li>
                <li class="left_li">充值金额</li>
                <li class="left_li">支付金额</li>
                <li class="left_li">充值时间</li>
            </ul>
            <ul class="right">
                <li class="right_li">{{oilCardId}}</li>
                <li class="right_li">{{resultData.rechargeAmount}}</li>
                <li class="right_li">{{resultData.payAmount}}</li>
                <li class="right_li">{{resultData.rechargeTime}}</li>
            </ul>
        </div>
        <div class="button">
            <button class="btn1" @click="goRecord">查看充值记录</button>
            <button class="btn2" @click="goBack">继续充值</button>
        </div>
        <div class="flg" v-if="showFlg">
            <div class="flg_main">
                <!-- <div style="width:100px;height:100%;"> -->
                    <P class="flg_p">恭喜您获得一个现金红包</P>
                    <P class="p">
                        <span class="flg_span1">{{resultData.returnAmount}}</span><span class="flg_span2">元</span>
                    </P>
                    <P class="pp">红包金额已放入您的账户</P>
                    <P class="pp9">可到个人中心—账户余额中查看</P>
                    <img src="/static/oil/redbag@3x.png" alt="" class="flg_img">

                <!-- </div> -->
                <button class="btn1" @click="closeRedbag">确定</button> 
                <img src="/static/oil/x@3x.png" class="flg_img1" @click="closeRedbag">               
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
  getOilCard,
  allSetting,
  apiFail,
  showLoading
} from "@/utils/index";
export default {
  data() {
    return {
      orderId: "",
      oilCardId: "",
      resultData: {},
      showFlg: false,
      isGoRecord: false //是否跳转到充值记录页面
    };
  },
  methods: {
    goRecord() {
      this.showFlg = false;
      this.isGoRecord = true;
      wx.navigateTo({
        url: "/pages/service/record/main"
      });
    },
    rechargeResult(orderId) {
      let url = path.rechargeResult;
      let promise = this.$fly.post(url, { orderId: orderId });
      promise.then(data => {
        this.resultData = data;
        if (this.resultData.hasActivity === 1 && !this.isGoRecord) {
          this.showFlg = true;
        }
      });
      showLoading(promise);
    },
    closeRedbag() {
      this.showFlg = false;
    },
    goBack() {
      wx.navigateBack({
        delta: 1
      });
    }
  },
  onLoad: function(option) {
    this.orderId = option.orderId;
    this.oilCardId = option.oilCardId;
  },
  onShow: function() {
    this.rechargeResult(this.orderId);
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
  .header {
    width: 100%;
    height: 88px;
    .header_img {
      width: 19px;
      height: 19px;
      position: absolute;
      margin-top: 35px;
      margin-left: 91px;
    }
    .header_span {
      font-size: 17px;
      color: #000000;
      font-weight: bold;
      position: absolute;
      margin-top: 33px;
      margin-left: 123px;
    }
  }
  .header-fail {
    .header_img {
      width: 19px;
      height: 19px;
      position: absolute;
      margin-top: 25px;
      margin-left: 280rpx;
    }
    .header_span {
      font-size: 17px;
      color: #000000;
      font-weight: bold;
      position: absolute;
      margin-top: 23px;
      margin-left: 330rpx;
    }
    .fail-tip {
      position: absolute;
      margin-top: 50px;
      font-size: 30rpx;
      margin-left: 120rpx;
    }
  }
  .text {
    display: flex;
    background-color: #fff;
    .left {
      flex-direction: column;
      .left_li {
        text-align: center;
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
    button:after{
      border: none;
    }
    .btn1 {
      width: 135px;
      height: 40px;
      border-radius: 20px;
      text-align: center;
      border: 1px solid #999999;
      color: #666;
      font-size: 16px;
    }
    .btn2 {
      width: 135px;
      height: 40px;
      border-radius: 20px;
      text-align: center;
      border: 1px solid #FFCC00;
      font-size: 16px;
      color: #000;
      background: linear-gradient($jbColorTop, $jbColorBottom);
    }
  }
  .flg {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    background: rgba(0, 0, 0, 0.4);
    overflow: hidden;
    .flg_main {
      position: relative;
      p {
        position: absolute;
      }
      .flg_img {
        width: 331px;
        height: 331px;
        margin-top: 100px;
        margin-left: 20px;
      }
      .flg_p {
        margin-top: 188px;
        margin-left: 107px;
        font-size: 15px;
        color: #7a2716;
        font-weight: bold;
      }
      .p {
        margin-top: 239px;
        margin-left: 160px;
        color: #db483c;
        font-weight: bold;
        .flg_span1 {
          font-size: 50px;
        }
      }
      .pp {
        margin-top: 373px;
        margin-left: 127px;
        font-size: 12px;
        color: #fdffda;
        font-weight: bold;
      }
      .pp9 {
        margin-top: 394px;
        margin-left: 107px;
        font-size: 12px;
        color: #fdffda;
        font-weight: bold;
      }
      .btn1 {
        width: 260px;
        height: 35px;
        border-radius: 4px;
        color: #db483c;
        font-size: 15px;
        background-color: #fee94e;
        line-height: 35px;
        margin-top: 26px;
      }
      .flg_img1 {
        width: 24px;
        height: 24px;
        margin-top: 31px;
        margin-left: 176px;
      }
    }
  }
}
</style>
