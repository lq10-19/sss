<template>
  <div class="main" :class="{'is-huawei':isHuaWei}">
    <div class="top">
      <swiper
        :indicator-dots="false"
        class="swiper"
        :autoplay="true"
        :interval="3000"
        :duration="500"
      >
        <swiper-item v-for="(item,index) in imgData" :key="index">
          <img :src="item.activityImg" alt>
        </swiper-item>
      </swiper>
    </div>
    <div class="center">
      <button class="btn" @click="getAdd" v-if="allCardList.length === 0">
        <p class="btn_img">
          <img src="/static/oil/icon_tianjia@3x.png" alt style="width:20px;height:20px;">
        </p>
        <p class="btn_title">添加油卡</p>
      </button>
      <div class="oilList" v-if="allCardList.length > 0" style="display:flex;">
        <div>
          <img
            src="/static/oil/zhongshihua@2x.png"
            class="oilList_img"
            v-if="currOilCar.cardType === 1"
          >
          <img
            src="/static/oil/zhongshiyou@3x.png"
            class="oilList_img"
            v-if="currOilCar.cardType === 2"
          >
        </div>
        <div>
          <p class="oilList_card">加油卡号：{{currOilCar.oilCardId}}</p>
        </div>
        <div class="switch" @click="getChange">
          <img
            src="/static/oil/qiehuan@3x.png"
            alt
            style="width:20px;height:19px; margin-top:12px;margin-left:15px;"
          >
          <p class="switch_text">切换油卡</p>
        </div>
      </div>
      <!-- @click="goSure(item)"  -->
      <div class="center_card_wrap">
        <div
          class="center_card"
          v-for="(item,index) in cardData"
          :key="index"
          @click="goSurePay(item)"
        >
          <div class="center_card-item" :class="{ 'active': item.isActive }">
            <div class="mess">
              <p>{{item.amount}}元</p>
              <p style="font-size:10px;color:#FF4A55;margin-top:0.17rem">
                <span v-if="item.activityId">赠送金额:{{item.returnAmount}}元</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="center_text">
        <p>本服务暂不支持开发票</p>
      </div>
      <div class="center_texts">
        <img src="/static/oil/icon_explain@3x.png" alt style="width:15px;height:15px;">
        <P style="margin-left:6px;" @click="goRule">充值说明</P>
        <img
          src="/static/oil/icon_record@3x.png"
          alt
          style="width:15px;height:15px;margin-left:21px;"
        >
        <P style="margin-left:6px;" @click="goRecord">充值记录</P>
      </div>
    </div>
    <div class="buttom">
      <div class="buttom_title">
        <div class="line"></div>
        <div class="title_text">活动说明</div>
        <div class="line"></div>
      </div>
      <div class="buttom_text">
        <template v-for="item in cardData">
          <p
            :key="item.id"
            v-if="item.activityId"
          >{{item.oilCarIndex}}、单次充值满{{item.amount}}元，赠送{{item.returnAmount}}元现金红包；</p>
        </template>
        <p>{{oilCarCount+1}}、每张卡号在活动期间可享受三次优惠充值活动，优惠封顶不累加，</p>
        <p>{{oilCarCount+2}}、本次活动最终解释权归佰仟融资租赁有限公司所有。</p>
      </div>
    </div>
    <div class="up" v-show="up" cursor-spacing="140" auto-focus>
      <!-- <div class="up" v-show="up"> -->
      <div class="up_main">
        <div class="title">
          <p class="title_first">请先完善您的加油卡号</p>
          <p class="title_sec">佰仟易行加油充值，官网充值、快速到账</p>
        </div>
        <div class="card">
          <p class="card_title">加油卡号</p>
          <input
            type="number"
            @input="filterNumber"
            placeholder="请输入加油卡号"
            cursor-spacing="140"
            maxlength="19"
            v-model="addOilCard.oilCardId"
          >
        </div>
        <div class="card">
          <p class="card_title">确认卡号</p>
          <input
            type="number"
            @input="filterNumber"
            placeholder="请确认加油卡号"
            cursor-spacing="140"
            maxlength="19"
            v-model="addOilCard.numCard"
          >
        </div>
        <div class="button">
          <button class="btn1" @click="up = false; numCard='';">取消</button>
          <button class="btn2" @click="bindCard">完成添加</button>
        </div>
      </div>
    </div>
    <div class="down" cursor-spacing="140" v-if="down" auto-focus>
      <div class="up_main">
        <div class="title">
          <p class="title_first">请选择油卡</p>
          <!-- <img src="/static/redBag/x@2x.png" alt="" @click="goClose"> -->
          <p class="title_sec">每个账户最多添加5张油卡</p>
        </div>
        <scroll-view
          scroll-y
          class="scroll-view"
          style="width: 100%;white-space:nowrap;height:120px"
        >
          <div
            class="card"
            v-for="(item,index) in allCardList"
            :key="index"
            @click="cardChange(item)"
          >
            <div>
              <img
                v-if="item.cardType === 1"
                src="/static/oil/zhongshihua@2x.png"
                class="oilList_img"
              >
              <img
                v-if="item.cardType === 2"
                src="/static/oil/zhongshiyou@3x.png"
                class="oilList_img"
              >
            </div>
            <div>
              <p class="oilList_card">加油卡号：{{item.oilCardId}}</p>
            </div>
            <div @click="getDelete(item)">
              <img src="/static/oil/xx@3x.png" class="close">
            </div>
          </div>
        </scroll-view>
        <div class="add" style="height:60px;" @click="getAdd">
          <p class="p_img">
            <img
              src="/static/oil/icon_tianjia@3x.png"
              alt
              style="width:20px;height:20px;margin-top:5px;"
            >
          </p>
          <p class="p_title" style="color:#FF5E5D;font-size:17px;margin:13px;">添加新的加油卡</p>
        </div>
      </div>
    </div>
    <div class="sure" v-show="showSurePay">
      <div class="sure_main">
        <div class="title">
          <p class="title_first">确认付款</p>
          <img src="/static/oil/clear@3x.png" alt style @click="goClose">
        </div>
        <div class="card">
          <p>
            <span>{{cardType === 1 ? '中石油' :'中石化'}}</span>
            <span class="span_first">{{currOilCar.oilCardId}}</span>
          </p>
        </div>
        <div class="card">
          <p>
            <span>充值{{currPayObj.amount}}元</span>
            <span class="span_second">实付{{currPayObj.amount}}元</span>
          </p>
        </div>
        <div
          class="card"
          v-if="currPayObj.activityId && currPayObj.returnAmount && currPayObj.returnAmount>0"
        >
          <p>赠送{{currPayObj.returnAmount || 0}}元现金红包<span class="icon">活动</span></p>
        </div>
        <div class="button">
          <button class="btn" @click="goPay">立刻付款</button>
        </div>
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
  apiFail,
  showLoading,
  isHuaWei,
  getSystemInfo,
  compareVersion
} from "@/utils/index";

export default {
  data() {
    return {
      flag: true,
      cardData: [],
      up: false,
      down: false,
      numCard: "",
      oilCardId: "",
      currOilCar: {},
      switch: false,
      allCardList: [],
      addOilCard: {
        oilCardId: "",
        numCard: ""
        // surePay: true,
      },
      showSurePay: false,
      currPayObj: {},
      focus: true,
      isHuaWei: false,
      oilCarCount: 0, //有活动的油卡数量
      imgData: [] //轮播图
    };
  },
  onLoad() {
    this.isHuaWei = isHuaWei();
    // const version = wx.getSystemInfo().version;
    // if (compareVersion(version, "6.7.1") < 0) {
    //   wx.showModal({
    //     title: "提示",
    //     content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
    //   });
    // }
  },
  onShow() {
    this.allCardList = [];
    showLoading(this.allSetting(), this.getOilCard());
    this.getGroupActivity();
  },
  onShareAppMessage(){
    return {
      title: '佰仟易行',
      path: '/pages/service/oil/main',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  methods: {
    //请求活动列表
    getGroupActivity() {
      let url = path.queryActivity;
      let queryData = {
        upperChannel: 2,
        advertPosition: 6
      };
      let promises = this.$fly.get(url, queryData); 
      promises.then(data => {
        if (data && data.length > 0) {
          this.imgData = data;
          //console.log('轮播图:')
          //console.log(this.imgData)
        } 
      })
      .catch(e => {
        apiFail(e);
      });
    },
    filterNumber() {
      this.addOilCard.numCard = this.addOilCard.numCard.replace(/[^\d]/g, "");
      this.addOilCard.oilCardId = this.addOilCard.oilCardId.replace(
        /[^\d]/g,
        ""
      );
    },
    goRule() {
      wx.navigateTo({
        url: "/pages/service/rule/main"
      });
    },
    goRecord() {
      wx.navigateTo({
        url: "/pages/service/record/main"
      });
    },
    goCheck() {
      // this.stlye.background = red;
    },
    getAdd() {
      this.up = true;
      this.down = false;
    },
    goClose() {
      this.down = false;
      this.showSurePay = false;
    },
    goSurePay(someCard) {
      this.cardData.forEach(item => (item.isActive = false));
      someCard.isActive = true;
      this.currPayObj = someCard;
      if (!this.currOilCar || !this.currOilCar.oilCardId) {
        wx.showToast({
          title: "请先绑定油卡",
          icon: "none"
        });
        return;
      }
      this.showSurePay = true;
    },
    goPay() {
      this.showSurePay = false;
      let url = path.getRecharge;
      let loginInfo = getLoginInfo();
      let queryData = {
        userOpenId: loginInfo.mpOpenid,
        userId: loginInfo.userid,
        oilCardId: this.currOilCar.oilCardId,
        tradeType: "JSAPI",
        oilSettingId: this.currPayObj.id
      };
      let orderId = "";
      let oilCardId = this.currOilCar.oilCardId;
      this.$fly
        .post(url, queryData)
        .then(data => {
          orderId = data.orderId;
          return this.goWxPay(data);
        })
        .then(() => {
          wx.navigateTo({
            url: `/pages/service/successPay/main?orderId=${orderId}&oilCardId=${oilCardId}`
          });
        })
        .catch(e => {
          console.log(e);
          wx.showToast({
            title: "充值失败",
            icon: "none"
          });
        });
    },
    goWxPay(payData) {
      return new Promise((resolve, reject) => {
        let paymentData = {
          timeStamp: payData.timeStamp,
          nonceStr: payData.nonceStr,
          package: payData.package,
          signType: "MD5",
          paySign: payData.sign
        };
        paymentData.success = res => {
          resolve(res);
        };
        paymentData.fail = res => {
          reject(res);
        };
        wx.requestPayment(paymentData);
      });
    },

    // 获取充值卡
    allSetting() {
      let url = path.getAllSetting;
      let promise = this.$fly.post(url, {});
      let cardIndex = 1;
      this.oilCarCount = 0;
      promise
        .then(data => {
          data.forEach(item => (item.isActive = false));
          data.forEach(item => {
            if (item.activityId) {
              this.oilCarCount++;
              item.oilCarIndex = cardIndex++;
            }
          });
          this.cardData = data;
        })
        .catch(e => apiFail(e));
      return promise;
    },
    // 获取绑定的油卡
    getOilCard() {
      let url = path.getOilCard;
      let loginInfo = getLoginInfo();
      let queryData = {
        userId: loginInfo.userid
      };
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          if (data.length !== 0) {
            this.currOilCar = data.find(item => item.mainFlag === 1);
            //没有找到主卡
            if (!this.currOilCar) {
              this.currOilCar = data[0];
            }
            this.allCardList = data;
          } else {
            //没有任何卡
            this.currOilCar = {};
            this.allCardList = [];
          }
        })
        .catch(e => apiFail(e));
      return promise;
    },
    // 绑定油卡
    bindCard() {
      if (this.addOilCard.oilCardId.trim().length === 0) {
        wx.showToast({
          title: "请输入卡号",
          icon: "none",
          duration: 1000
        });
        return;
      }
      if (this.addOilCard.oilCardId !== this.addOilCard.numCard) {
        wx.showToast({
          title: "卡号不一致",
          icon: "none"
        });
        return;
      }
      let url = path.bindOilCard;
      let loginInfo = getLoginInfo();
      let queryData = {
        userId: loginInfo.userid,
        oilCardId: this.addOilCard.oilCardId
      };
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          this.up = false;
          this.currOilCar = data;
          this.allCardList.push(data);
          this.addOilCard = {
            oilCardId: "",
            numCard: ""
          };
          wx.showToast({
            title: "绑定成功",
            icon: "none"
          });
          this.getOilCard();
        })
        .catch(e => apiFail(e));
    },
    //解绑
    getDelete(card) {
      let url = path.getDeleteCard;
      let loginInfo = getLoginInfo();
      let queryData = {
        userId: loginInfo.userid,
        oilCardId: card.oilCardId
      };
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          this.down = false;
          this.getOilCard();
        })
        .catch(e => apiFail(e));
      showLoading(promise);
    },
    //显示切换油卡
    getChange() {
      this.down = true;
    },
    //切换油卡
    cardChange(card) {
      let url = path.getOilCardChange;
      let loginInfo = getLoginInfo();
      let queryData = {
        userId: loginInfo.userid,
        oilCardId: card.oilCardId
      };
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          this.down = false;
          this.currOilCar = data;
        })
        .catch(e => apiFail(e));
      showLoading(promise);
    }
  }
};
</script>

<style lang="scss" scoped>
$jbColorTop: rgba(255,224,86,1);
$jbColorBottom: #FFCC00;
.main {
  width: 100%;
  height: 100%;
  position: fixed;
  .top {
    img {
      height: 135px;
      width: 100%;
    }
  }
  .center {
    .btn {
      width: 345px;
      height: 60px;
      text-align: center;
      line-height: 60px;
      border: 1px solid #FFCD00;
      background-color: #ffffff;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      color: #FFCC00;
      .btn_img {
        margin-top: 8px;
        margin-right: 0.16rem;
        // line-height: 70px;
      }
    }
    .btn:after{
      border: none;
    }
    .oilList {
      width: 345px;
      height: 60px;
      // text-align: center;
      line-height: 60px;
      border: 1px solid #ff5d5d;
      background-color: #ffffff;
      display: flex;
      flex-direction: row;
      margin-top: 50px;
      margin: auto;
      border-radius: 6px;
      div {
        .oilList_img {
          width: 35px;
          height: 35px;
          margin-top: 13px;
          margin-left: 15px;
        }
        .oilList_card {
          color: #000000;
          font-size: 15px;
          margin-left: 12px;
          font-weight: bold;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          width: 450rpx;
        }
      }
      .switch {
        position: fixed;
        background: #f5f5f5;
        width: 50px;
        height: 60px;
        margin-left: 295px;
        display: flex;
        border-radius: 0 6px 6px 0;
        // flex-direction: column;
        .switch_text {
          margin-top: 10px;
          color: #666666;
          font-size: 10px;
          position: absolute;
          margin-left: 6px;
        }
      }
    }
    .center_card_wrap{
      position: relative;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      -webkit-box-align: center;
      -webkit-align-items: center;
      align-items: center;
      padding: 0 0.3rem;
      margin-top: 0.47rem;
      .center_card {
        .center_card-item {
          width: 81px;
          height: 70px;
          background:rgba(245,245,245,1);
          border-radius:0.12rem;
          color: #000000;
          font-size: 16px;
          font-weight: bold;
          position: relative;
        }
        .mess{
          position: absolute;
          width: 100%;
          top: 50%;
          -webkit-transform: translateY(-50%);
          p{
            width: 100%;
            text-align: center;
          }
        }
        .active {
          background: linear-gradient(
            -52deg,
            $jbColorTop,
            $jbColorBottom
          );
          border-radius: 0.12rem;
          color: #000;
        }
      }
      .center_card:nth-child(2){
        margin: 0 0.14rem;
      }
      .center_card:nth-child(3){
        margin-right:0.14rem;
      }
    }
    .center_text {
      font-size: 12px;
      color: #999999;
      // margin-left: 15px;
      padding: 10px 0 0 15px;
    }
    .center_texts {
      font-size: 12px;
      color: #999999;
      display: flex;
      flex-direction: row;
      margin-left: 199px;
    }
  }
  .buttom {
    margin-top: 0.88rem;
    .buttom_title {
      display: flex;
      flex-direction: row;
      justify-content: center;
      .line {
        width: 135px;
        height: 1px;
        background: #EEEEEE;
        margin-top: 10px;
      }
      .title_text {
        font-size: 14px;
        color: #000000;
        font-weight: bold;
        margin: 0 9px;
      }
    }
    .buttom_text {
      padding: 35px 15px 0 15px;
      font-size: 14px;
      color: #666666;
      p{
        line-height: 0.4rem;
        margin-bottom: 0.2rem;
      }
    }
  }
  .up {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    background: rgba(0, 0, 0, 0.4);
    overflow: hidden;
    .up_main {
      position: fixed;
      width: 100%;
      bottom: 0;
      background-color: #ffffff;
      border-radius: 10px 10px 0 0;
      padding-bottom: 0.37rem;
    }
    .title {
      .title_first {
        text-align: center;
        color: #000000;
        font-size: 18px;
        font-weight: bold;
        margin: 0.4rem 0 0.1rem 0;
      }
      .title_sec {
        text-align: center;
        color: #999999;
        font-size: 14px;
        margin-bottom: 0.4rem;
      }
    }
    .card {
      display: flex;
      flex-direction: row;
      height: 54px;
      border-top: 1px solid #f2f3f5;
      border-bottom: 1px solid #f2f3f5;
      .card_title {
        line-height: 54px;
        margin-left: 15px;
        width: 100px;
      }
      input {
        height: 54px;
      }
      .close {
        width: 20px;
        height: 20px;
        margin-left: 163px;
        margin-top: 20px;
        background: #000000;
      }
    }
    .button {
      display: flex;
      flex-direction: row;
      margin-top: 19px;
      .btn1 {
        width: 2.5rem;
        height: 0.8rem;
        border-radius: 0.4rem;
        text-align: center;
        border: 1px solid rgba(153,153,153,1);
        margin-left: 0.88rem;
        color: #666;
        font-size: 16px;
        box-sizing: border-box;
      }
      .btn2 {
        width: 2.5rem;
        height: 0.8rem;
        border-radius: 20px;
        text-align: center;
        margin-right: 0.88rem;
        border: 1px solid #FFCC00;
        font-size: 16px;
        color: #000;
        background: linear-gradient($jbColorTop, $jbColorBottom);
        box-sizing: border-box;
      }
      button:after{
        border: none;
      }
    }
    .add {
      height: 60px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .switch_card {
      display: flex;
      flex-direction: row;
    }
  }
  .down {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    background: rgba(0, 0, 0, 0.4);
    overflow: hidden;
    .up_main {
      position: fixed;
      width: 100%;
      height: 266px;
      background-color: #ffffff;
      bottom: 0;
      border-radius: 10px 10px 0 0;
      .title {
        height: 79px;
        line-height: 40px;
        .title_first {
          text-align: center;
          color: #000000;
          font-size: 18px;
          font-weight: bold;
        }
        .title_sec {
          text-align: center;
          color: #999999;
          font-size: 14px;
        }
        img {
          width: 24px;
          height: 24px;
          position: absolute;
          background-color: rgba(0, 0, 0, 0.4);
          right: 10rpx;
          border-radius: 50%;
        }
      }
    }

    .card {
      display: flex;
      flex-direction: row;
      // justify-content: space-around;
      height: 60px;
      border-top: 1px solid #f2f3f5;
      border-bottom: 1px solid #f2f3f5;
      .close {
        width: 20px;
        height: 20px;
        margin-left: 10px;
        margin-top: 20px;
        // background: #000000;
      }
      .oilList_img {
        width: 30px;
        height: 30px;
        margin-top: 14px;
        margin-left: 15px;
      }
      .oilList_card {
        color: #000000;
        font-size: 17px;
        line-height: 60px;
        margin-left: 15px;
      }
    }

    .add {
      height: 60px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
  }
  .sure {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    background: rgba(0, 0, 0, 0.4);
    overflow: hidden;
    .sure_main {
      width: 100%;
      height: 596rpx;
      background: #fff;
      border-radius: 26rpx 26rpx 0 0;
      bottom: 0;
      position: absolute;
      .title {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 120rpx;
        border-radius: 26rpx 26rpx 0 0;
        justify-content: center;
        // text-align: center;
        line-height: 120rpx;
        font-size: 36rpx;
        font-weight: bold;
        position: relative;
        img {
          position: absolute;
          width: 26rpx;
          height: 24rpx;
          position: absolute;
          right: 0.33rem;
          top: 0.3rem;
        }
      }
      .card {
        width: 100%;
        height: 100rpx;
        line-height: 100rpx;
        border: 2rpx solid #eeeeee;
        p {
          margin-left: 38rpx;
          font-size: 32rpx;
          color: #666666;
          .span_first {
            margin-left: 20rpx;
          }
          .span_second {
            margin-left: 30rpx;
          }
          .icon{
            width:0.67rem;
            height:0.34rem;
            background:linear-gradient(176deg,$jbColorTop,$jbColorBottom);
            border-radius:0.04rem;
            font-size: 0.2rem;
            color: #000;
            margin-left: 0.17rem;
          }
        }
      }
      .button {
        width: 100%;
        height: 152rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        .btn {
          width: 598rpx;
          height: 90rpx;
          background: linear-gradient($jbColorTop, $jbColorBottom);
          border-radius: 46rpx;
          font-size: 36rpx;
          color: #000;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
