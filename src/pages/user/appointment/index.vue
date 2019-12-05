<template>
  <div :style="{'min-height':height+50+'px'}" class="bgc">
    <div class="tabber">
      <button @click="openCar" plain :class="{index:carAppointment}">车辆预约</button>
      <button @click="openSafe" plain :class="{index:!carAppointment}">车险预约</button>
    </div>
    <!-- 车辆预约 -->
    <div class="bigbox" v-if="carAppointment">
      <div class="bigbox1" v-if="noCar">
        <img class="nullImg" src="../../../../static/img/group/wu@2x.png">
        <p class="nullTxt">暂时没有预约~</p>
      </div>
      <div v-else>
        <div class="box" v-for="(item,index) in goods" :key="index">
          <div class="goodState">
            <span class="span1"></span>
            {{item.reservationType == 1 ? "新车预约" : "二手车预约"}}
            <span class="span2" v-if="item.reservationStatus==0">已废弃</span>
            <span class="span2" v-if="item.reservationStatus==1">已预约</span>
            <span class="span2" v-if="item.reservationStatus==2">已处理</span>
          </div>
          <div class="goodMain">
            <div class="goodImg" @click="oldCarToHV(item.productId)">
              <img :src="item.carImage">
            </div>
            <div class="goodMsg">
              <p class="goodName" @click="oldCarToHV(item.productId)">{{item.productName}}</p>
              <p class="goodPrice" @click="openDetails(index)">售价：
                <span class="span3">{{item.salePrice}}</span>万元
                <span class="span4" :class="{rotate:item.flag}"></span>
              </p>
            </div>
          </div>
          <div class="userMsg" v-if="item.flag">
            <p>
              <span class="span5">预约城市：</span>
              <span class="span6">{{item.cityName}}</span></p>
            <p>
              <span class="span5">预约人姓名：</span>
              <span class="span6">{{item.appName}}</span></p>
            <p>
              <span class="span5">预约人手机号：</span>
              <span class="span6">{{item.appMobile}}</span></p>
          </div>
        </div>
      </div>
    </div>
    <!-- 车险预约 -->
    <div class="bigbox" v-if="!carAppointment">
      <div class="bigbox1" v-if="noInsurance">
        <img class="nullImg" src="../../../../static/img/group/wu@2x.png">
        <p class="nullTxt">暂时没有预约~</p>
      </div>
      <div v-else>
        <div class="box" v-for="(item,index) in insuranceData" :key="index">
          <div class="goodState">
            <span class="span1"></span>
            车险预约
            <span class="span2">已预约</span>
          </div>
          <p><span class="span7">预约城市</span><span class="span8">{{item.insureCity}}</span></p>
          <p><span class="span7">预约人姓名</span><span class="span8">{{item.carOwnerName}}</span></p>
          <p><span class="span7">手机号</span><span class="span8">{{item.mobile}}</span></p>
          <p><span class="span7">车牌号</span><span class="span8">{{item.carNumber}}</span></p>
          <p><span class="span7">险种</span><span class="span8">{{item.insuranceType}}</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  path,
  dataConfig,
  getUserInfo,
  isBindPhone,
  getLoginInfo,
  apiFail,
  showLoading,
  hideLoading,
  isHuaWei,
  isOppo,
  getSystemInfo,
  event,
  compareVersion,
  link,
  getSceneCode,
  setSceneCode
} from "@/utils/index";
import { fail } from "assert";
export default {
  components: {},
  data() {
    return {
      goods: [], //车辆数据
      insuranceData: [], //车险数据
      height: "", //屏幕高度
      width: "", //屏幕宽度
      animationData: {}, //动画
      isGoLoginPage: false, //判断登录开关
      noCar: true, //默认无车辆预约
      noInsurance: true, //默认无车险预约
      carAppointment: true, //默认车辆预约
    };
  },
  onLoad(param) {
    
  },
  onShow() {
    //判断登录
    this.loginCheck();
    //车辆预约
    this.getReservationList();
    //车险预约
    this.queryCarInsurance();
    const animation = wx.createAnimation({
      duration: 100,
      timingFunction: "ease"
    });
    this.animation = animation;
    this.animationData = animation.export();
  },
  onReady() {
    const value = wx.getStorageSync("systemInfo");
    console.log(value);
    this.height = value.windowHeight;
    this.width = value.windowWidth;
  },

  created() {},

  methods: {
    //判断是否登录
    loginCheck() {
      if (!getLoginInfo() && !this.isGoLoginPage) {
        this.isGoLoginPage = true;
        const url = "/pages/login/main";
        wx.navigateTo({ url });
        return false;
      }
      if (!getLoginInfo() && this.isGoLoginPage) {
        const url = "/pages/home/main";
        wx.reLaunch({ url });
        return false;
      }
      return true;
    },
    //获取车辆预约
    getReservationList() {
      let url = path.getReservationList;
      let userId = getLoginInfo().userid;
      let queryData = {
        userId,
      };
      let promises = this.$fly.get(url, queryData);
      showLoading(promises);
      promises
        .then(data => {
          if(data.length > 0 && data){
            this.noCar = false;
            this.goods = data;
            console.log(this.noCar,data)
          }else{
            this.noCar = true
          }
        })
        .catch(e => {
          apiFail(e);
        });
    },
    //获取车险预约
    queryCarInsurance() {
      let url = path.queryCarInsurance;
      let userId = getLoginInfo().userid;
      let queryData = {
        userId,
      };
      let promises = this.$fly.get(url, queryData);
      showLoading(promises);
      promises
        .then(data => {
          if(data.length > 0 && data){
            this.noInsurance = false;
            this.insuranceData = data;
            console.log(this.noCar,data)
          }else{
            this.noInsurance = true
          }
        })
        .catch(e => {
          apiFail(e);
        });
    },
    openCar() {
      this.carAppointment = true;
    },
    openSafe() {
      this.carAppointment = false;
    },
    //预约详情开关
    openDetails(item) {
      this.goods[item].flag = !this.goods[item].flag;
    },
    //跳转H5详情
    oldCarToHV(options) {
      let carId = encodeURIComponent(options);
      wx.navigateTo({
        url: `/pages/carItem/main?carId=${carId}`
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.bgc {
  background: #f2f3f5;
  width: 100%;
}
.tabber{
  display: flex;
  justify-content: space-between;
  button{
    display: inline-block;
    margin: 0;
    padding: 0;
    border-radius: 0;
    width: 50%;
    height: 100rpx;
    border: 1rpx solid rgba(238,238,238,1);
    font-size:28rpx;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(153,153,153,1);
    line-height:100rpx; 
    background-color: #fff;
  }
  .index{
    font-weight:500;
    color:rgba(0,0,0,1);
    border-bottom: 5rpx solid #FFD013;
  }
}
.bigbox1 {
  position: absolute;
  width: 100%;
  font-size: 0.28rem;
  background: #f2f3f5;
  .nullImg {
    width: 3rem;
    height: 2rem;
    display: block;
    margin: 0 auto;
    margin-top: 3rem;
  }
  .nullTxt {
    width: 50%;
    margin: 0 auto;
    margin-top: 0.5rem;
    text-align: center;
    color: rgba(208, 208, 208, 1);
    font-size: 0.3rem;
  }
}

.box {
  position: relative;
  width: 100%;
  margin: 0.24rem auto;
  background: #ffffff;
  overflow: hidden;
  .goodState{
    padding-left: 30rpx;
    border-bottom: 1rpx solid #F2F3F5;
    height: 90rpx;
    line-height: 90rpx;
    font-size:30rpx;
    font-family:PingFangSC-Semibold;
    font-weight:600;
    .span1{
      display: inline-block;
      width: 8rpx;
      height: 30rpx;
      margin: auto 0;
      background:linear-gradient(180deg,rgba(254,235,167,1),rgba(255,204,0,1));
      border-radius:4rpx;
      margin-right: 5rpx;
    }
    .span2{
      display: inline-block;
      position: absolute;
      right: 30rpx;
      color:rgba(255,208,19,1);
    }
  }
  .goodMain{
    display: flex;
    justify-content: space-between;
    height: 274rpx;
    align-items: center;
    .goodImg {
      display: inline-block;
      width: 258rpx;
      height: 190rpx;
      margin-left: 30rpx;
      img {
        display: inline-block;
        border: 1rpx solid black;
        width: 100%;
        height: 100%;
        border-radius:6rpx;
      }
    }
    .goodMsg{
      width: 385rpx;
      display: inline-block;
      height: 1.4rem;
      margin-right: 30rpx;
      word-break:break-all;
      font-size:30rpx;
      font-family:PingFangSC-Semibold;
      font-weight:600;
      color:rgba(51,51,51,1);
      line-height:48rpx;
      .goodName{
        height: 156rpx;
        margin-top: -32rpx;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .goodPrice{
        color: #FF5C5D;
        .span3{
          font-size: 40rpx;
        }
        .span4{
          display: inline-block;
          width: 22rpx;
          height: 12rpx;
          //border: 1rpx solid #000;
          position: absolute;
          right: 30rpx;
          margin-top: 25rpx;
          background: url('../../../../static/img/la_down.png') no-repeat;
          background-size: 100% 100%;
        }
        .rotate{
          transform:rotate(180deg);
        }
      }
    }
  }
  .userMsg{
    margin: 0rpx 0rpx 20rpx 30rpx;
    p{
      font-size:27rpx;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(102,102,102,1);
      line-height: 50rpx;
      .span5{
        display: inline-block;
        width: 200rpx;
      }
      .span6{
        color: #000000;
      }
    }
  }
  .span7{
    font-size:30rpx;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(102,102,102,1);
    padding-left: 30rpx;
    line-height: 72rpx;
  }
  .span8{
    position: absolute;
    right: 30rpx;
    font-size:30rpx;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(0,0,0,1);
    line-height: 72rpx;
  } 
}
</style>
