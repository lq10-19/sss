<template>
  <div class="main">
    <div class="backHome" @click="backHome" v-if="backShow== true"><img src="/static/img/sign/back.png" /></div>
    <div class="head">
      <image class="headBg" mode="widthFix" src="http://bqyx-qiniu.bqrzzl.com/signHeadBg.png" />
      <p class="opportunity">可拆红包次数：<span>{{redpacketAmount}}</span>次</p>
    </div>
    <div class="content">
      <image class="contentBg" mode="widthFix" src="http://bqyx-qiniu.bqrzzl.com/mp/signContentBg.png" />
      <div class="redBagList">
        <ul>
          <li class="list" v-for="(item,index) in redpacketList" :key="item.id" :index="index" @click="openPacket(item,index)">
            <img class="norml" v-if="item.openFlag == 1" src="/static/img/sign/red1@2x.png" />
            <img class="norml" v-if="item.openFlag == 0" src="/static/img/sign/red2@2x.png" />
            <p class="money" v-if="item.openFlag == 1">{{item.cashAmount}}元</p>
          </li>
        </ul>
      </div>
      <div class="section">
        <p class="cash-btn" @click="goWallet">提现</p>
        <p class="title">累计签到奖金：</p>
        <p class="moneny">￥<span>{{signBonus}}</span></p>
        <div class="btn-wrap">
          <div class="share-btn" @click="getEnjoy">
            <img class="btn" src="/static/img/sign/btn2@2x.png" />
            <p>邀请好友签到，领更多奖金</p>
          </div>
        </div>
      </div>
      <div class="invitation-record">
        <div class="title-box">
          <img class="title-icon" src="/static/img/sign/tittle@2x.png" />
          <p>邀请记录</p>
        </div>
        <div class="record-box">
          <ul>
            <li v-for="item in invitedList" :key="item.userId" @click="getEnjoy(item)">
              <img class="user" :src="item.avatarUrl" v-if="item.avatarUrl!=null || item.avatarUrl!=''" />
              <img class="user" src="/static/img/sign/user.png" v-if="item.avatarUrl==''" />
              <img class="record-icon" src="/static/img/sign/yaoqin@2x.png" />
              <div class="txt">
                <img class="statr" src="/static/img/sign/btn_s@2x.png" />
                <p v-if="item.avatarUrl ==null">待邀请</p>
                <p v-else>已邀请</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="rule">
        <div class="title-box">
          <img class="title-icon" src="/static/img/sign/tittle@2x.png" />
          <p>签到说明</p>
        </div>
        <ul class="rule-txt">
          <li v-for="item in rules" :key="item.rule">{{item.rule}}</li>
        </ul>
      </div>
    </div>
    <div class="enjoy" v-show="goEnjoy">
      <div class="enjoy_main">
        <div class="button">
          <button open-type="share">
              <img src="/static/redBag/weixin@2x.png" class="weChat" />
              <p>微信好友</p>
          </button>
          <button  @click="enjoyFriend">
              <img src="/static/redBag/pengyouquan@2x.png" class="friend" />
              <p>朋友圈</p>
          </button>
        </div>
        <div class="buttom" @click="know">
            我知道了
        </div>
      </div>
    </div>
    <div class="openRedBagPop" v-if="openRedBagShow == true">
      <div class="light animated rotateAnimate"><img src="/static/img/sign/line@2x.png" /></div>
      <div class="redBagBox">
        <img src="/static/img/sign/X@2x.png" class="close" @click="closeRedBag" />
        <img src="/static/img/sign/2@2x.png" class="redBagActive" />
        <div class="noramlRed">
          <img src="/static/img/sign/1@2x.png" class="redBag" />
          <img src="/static/img/sign/yb@2x.png" class="yb anim ated ybAnimate" />
        </div>
        <p class="redBagMoney">￥{{redBagMoney}}</p>
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
import { setTimeout } from 'timers';
export default {
  components: {},
  data() {
    return {
      isGoLoginPage: false,
      signBonus: '0.00',
      redpacketAmount: '0',
      showLoading: false,
      redpacketList: [],
      invitedList: [],
      goEnjoy: false,
      rules: [],
      redBagMoney: '0.00',
      openRedBagShow: false,
      aidUserId: '',
      backShow: false,
      backShowInd: '0'
    };
  },
  onLoad(options) {
    console.log(options)
    if (options.scene) {
      this.backShow = true;
      setSceneCode(options.scene);
      this.aidUserId = options.scene;
      console.log(this.aidUserId)
    } else {
      setSceneCode(options.aidUserId);
      this.aidUserId = options.aidUserId;
      if (options.aidUserId){
        this.backShow = true;
      }
      console.log(this.aidUserId)
    }
  },
  onShow() {
    this.backShowInd = this.backShowInd * 1 + 1;
    if(this.backShowInd > 1){
      this.backShow = false;
    }
    console.log(this.backShowInd)
    this.goEnjoy = false;
    if (!getLoginInfo() && !this.isGoLoginPage) {
      this.backShowInd = 0;
      this.isGoLoginPage = true;
      const url = "/pages/login/main";
      wx.navigateTo({ url });
      return;
    }else{
      if(this.aidUserId !=undefined){
        this.saveInv();
      }
      showLoading(
        this.doSign(),
        this.getRules()
      );
    }
  },
  onShareAppMessage(params) {
    if (!isBindPhone()) {
      let url = "/pages/login/bindPhone/main";
      wx.navigateTo({ url });
      return;
    }else{
      let loginInfo = getLoginInfo();
      let userid = loginInfo.userid;
      this.goEnjoy = false;
      return {
        title: "天天签到领现金",
        path: `/pages/service/sign/main?aidUserId=${userid}`
      };
    }
  },
  methods: {
    doSign(){
      let url = path.doSign;
      let loginInfo = getLoginInfo();
      let queryData = {
        userId: loginInfo.userid
      };
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          if (data != null) {
            console.log(data);
            this.redpacketAmount = data.redpacketAmount;
            var signBonus = this.returnFloat(data.signBonus)
            this.signBonus = signBonus;
            for(var i=0;i<data.redpacketList.length;i++){
              if(data.redpacketList[i].openFlag == 1){
                data.redpacketList[i].cashAmount = this.returnFloat(data.redpacketList[i].cashAmount);
              }
            }
            if(data.invitedList.length == 0){
              this.invitedList = [
                {'avatarUrl': null},
                {'avatarUrl': null},
                {'avatarUrl': null},
                {'avatarUrl': null},
                {'avatarUrl': null}
              ]
              console.log(this.invitedList)
            }else{
              this.invitedList = [];
              for(var i=0;i<data.invitedList.length;i++){
                this.invitedList.push(data.invitedList[i]);
              }
              console.log(data.invitedList.length);
              var len = 5 - data.invitedList.length;
              console.log(len);
              console.log('----');
              for(var i=0;i<len;i++){
                this.invitedList.push({'avatarUrl': null});
              }
              console.log(this.invitedList);
            }
            this.redpacketList = [];
            this.redpacketList = data.redpacketList;
          } else {
            
          }
          console.log(this.invitedList);
        })
        .catch(e => {
          apiFail(e);
        });
      return promise;
    },
    returnFloat(value){
      var value=Math.round(parseFloat(value)*100)/100;
      var xsd=value.toString().split(".");
      if(xsd.length==1){
      value=value.toString()+".00";
      return value;
      }
      if(xsd.length>1){
      if(xsd[1].length<2){
      value=value.toString()+"0";
      }
      return value;
      }
    },
    openPacket(e,ind){
      console.log(ind);
      var ind = ind;
      if (!isBindPhone()) {
        let url = "/pages/login/bindPhone/main";
        wx.navigateTo({ url });
        return;
      }
      if(e.openFlag == 1){
        wx.showToast({
          title: "这个红包被打开过了哦~",
          icon: "none"
        });
        return false;
      }else if(e.openFlag == 0){
        let url = path.openPacket;
        let loginInfo = getLoginInfo();
        let queryData = {
          userId: loginInfo.userid,
          redpacketId: e.id
        };
        let promise = this.$fly.post(url, queryData);
        promise
          .then(data => {
            if(data != null){
              this.openRedBagShow = true;
              this.redpacketAmount = data.redpacketAmount;
              var signBonus = this.returnFloat(data.signBonus);
              var that = this;
              setTimeout(function(){
                that.signBonus = signBonus;
              },3000)
              for(var i=0;i<data.redpacketList.length;i++){
                if(data.redpacketList[i].openFlag == 1){
                  data.redpacketList[i].cashAmount = this.returnFloat(data.redpacketList[i].cashAmount);
                  this.redBagMoney = data.redpacketList[ind].cashAmount;
                }
              }
              console.log(this.redBagMoney);
              this.invitedList = data.invitedList;
              this.redpacketList = [];
              this.redpacketList = data.redpacketList;
              if(data.invitedList.length == 0){
                this.invitedList = [
                  {'avatarUrl': null},
                  {'avatarUrl': null},
                  {'avatarUrl': null},
                  {'avatarUrl': null},
                  {'avatarUrl': null}
                ]
              }else{
                this.invitedList = [];
                for(var i=0;i<data.invitedList.length;i++){
                  this.invitedList.push(data.invitedList[i]);
                }
                var len = 5 - data.invitedList.length;
                console.log(len);
                console.log('----');
                for(var i=0;i< len;i++){
                  this.invitedList.push({'avatarUrl': null});
                }
                console.log(this.invitedList);
              }
            }
            setTimeout(function(){
              this.openRedBagShow = false;
            },4000)
            console.log(data);
          })
          .catch(e => {
            apiFail(e);
          });
        return promise;
      }
    },
    goWallet(){
      wx.navigateTo({
        url: "/pages/user/wallet/main"
      });
    },
    getEnjoy(e) {
      if (!isBindPhone()) {
        let url = "/pages/login/bindPhone/main";
        wx.navigateTo({ url });
        return;
      }else{
        console.log(e);
        if(e.avatarUrl == null){
          this.goEnjoy = true;
        }else{
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
        url: "/pages/service/posterSign/main"
      });
    },
    getRules(){
      let url = path.getRules;
      let loginInfo = getLoginInfo();
      let queryData = {
        
      };
      let promise = this.$fly.post(url, queryData);
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
    },
    closeRedBag(){
      this.redBagMoney = '0.00';
      this.openRedBagShow = false;
    },
    saveInv(){
      let url = path.saveInvitation;
      let loginInfo = getLoginInfo();
      let queryData = {
        userId: loginInfo.userid,
        aidUserId: getSceneCode()
      };
      console.log(queryData)
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          if(data != null){
            console.log('增加红包次数+1');
          }
          console.log('增加红包次数+1s')
        })
        .catch(e => {
          //apiFail(e);
        });
      return promise;
    },
    backHome(){
      wx.switchTab({
        url: "/pages/home/main"
      })
    }
  }
};
</script>

<style lang="scss" scoped>
  .main{
    width: 100%;
    overflow: hidden;
    padding-bottom: 0.58rem;
    background: -webkit-linear-gradient(left,#ff2e3d,#af40d3);
    .head{
      position: relative;
      .headBg{
        width: 100%;
        display: block;
      }
      .opportunity{
        position: absolute;
        width:4.20rem;
        height:0.58rem;
        background:rgba(255,255,255,1);
        border:0.05rem solid #FFA837;
        border-radius:0.28rem;
        left: 50%;
        -webkit-transform: translateX(-50%);
        top: 0.7rem;
        font-size:0.32rem;
        color: #B54505;
        line-height: 0.58rem;
        text-align: center;
        span{
          margin: 0 0.1rem;
        }
      }
    }
    .content{
      position: relative;
      .contentBg{
        width: 100%;
        display: block;
      }
      .redBagList{
        position: absolute;
        width: 100%;
        text-align: center;
        top: 0.4rem;
        ul{
          margin: 0 auto;
          display: inline-table;
          margin-top: 0.12rem;
          li{
            width: 0.92rem;
            height: 1.12rem;
            float: left;
            margin: 0 0.08rem;
            position: relative;
            .norml{
              width: 0.92rem;
              height: 1.12rem;
              display: block;
            }
            .money{
              position: absolute;
              width: 100%;
              left: 0;
              text-align: center;
              color: #fff;
              font-size: 0.2rem;
              bottom: 0.18rem;
            }
          }
        }
      }
      .section{
        position: absolute;
        width: 100%;
        left: 0;
        top: 2.3rem;
        .title{
          width: 100%;
          text-align: center;
          float: left;
          font-size: 0.26rem;
          color: #666666;
          margin: 0.5rem 0 0.3rem 0;
        }
        .cash-btn{
          width: 0.7rem;
          height: 0.53rem;
          line-height: 0.53rem;
          font-size: 0.28rem;
          color: #C83B0B;
          border-radius: 0.24rem 0px 0px 0.24rem;
          background: #FFCD21;
          right: 0.42rem;
          bottom: 2.3rem;
          position: absolute;
          font-weight: bold;
          padding-left: 0.26rem;
        }
        .moneny{
          width: 100%;
          text-align: center;
          float: left;
          font-size: 0.65rem;
          color: #B54505;
          font-weight: bold;
          margin-bottom: 0.4rem;
        }
        .btn-wrap{
          width:100%;
          float: left;
          text-align: center;
          .share-btn{
            width: 5.54rem;
            height: 0.92rem;
            position: relative;
            margin: 0 auto;
            line-height: 0.92rem;
            text-align: center;
            .btn{
              width: 5.54rem;
              height: 0.92rem;
              position: absolute;
              left: 0;
              top: 0;
            }
            p{
              position: absolute;
              width: 100%;
              height: 0.92rem;
              line-height: 0.85rem;
              left: 0;
              top: 0;
              font-size: 0.34rem;
              color: #fff;
              font-weight: bold;
            }
          }
        }
      }
      .invitation-record{
        margin: 0 0.35rem;
        overflow: hidden;
        margin-top: 0.8rem;
        background: #fff;
        border-radius:0.3rem;
        padding: 0.5rem 0;
        .title-box{
          width: 100%;
          float: left;
          height: 0.5rem;
          line-height: 0.5rem;
          text-align: center;
          position: relative;
          margin-bottom: 0.5rem;
          p{
            font-size: 0.36rem;
            color: #CE5634;
            font-weight: bold;
            position: absolute;
            left: 50%;
            -webkit-transform: translateX(-50%);
            top: 0.1rem;
          }
        }
        .title-icon{
          width: 2.32rem;
          height: 0.11rem;
        }
        .record-box{
          width: 100%;
          float: left;
          text-align: center;
          ul{
            margin: 0 auto;
            display: inline-table;
          }
          li{
            float: left;
            width: 1.2rem;
            position: relative;
            margin: 0 0.05rem;
            .user{
              width: 1rem;
              height: 1rem;
              position: absolute;
              left: 50%;
              -webkit-transform: translateX(-50%);
              top: 0.1rem;
              border-radius: 50%;
            }
            .record-icon{
              width: 1.2rem;
              height: 1.2rem;
            }
            .txt{
              width: 1.34rem;
              height: 0.56rem;
              line-height: 0.56rem;
              position: absolute;
              left: 50%;
              -webkit-transform: translateX(-50%);
              bottom: -0.1rem;
              z-index: 9;
              .statr{
                width: 1.34rem;
                height: 0.56rem;
              }
              p{
                width: 1.34rem;
                height: 0.56rem;
                position: absolute;
                left: 0;
                top: 0;
                z-index: 9;
                font-size: 0.22rem;
                color: #C83B0C;
              }
            }
          }
        }
      }
      .rule{
        margin: 0 0.35rem;
        overflow: hidden;
        margin-top: 0.8rem;
        background: #fff;
        border-radius:0.3rem;
        padding: 0.5rem 0 0.9rem 0;
        .title-box{
          width: 100%;
          float: left;
          height: 0.5rem;
          line-height: 0.5rem;
          text-align: center;
          position: relative;
          margin-bottom: 0.8rem;
          p{
            font-size: 0.36rem;
            color: #CE5634;
            font-weight: bold;
            position: absolute;
            left: 50%;
            -webkit-transform: translateX(-50%);
            top: 0.1rem;
          }
        }
        .title-icon{
          width: 2.32rem;
          height: 0.11rem;
        }
        li{
          width: 100%;
          float: left;
          margin-bottom: 0.3rem;
        }
        .rule-txt{
          margin: 0 0.4rem;
          font-size: 0.26rem;
          color: #C83B0B;
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
    .openRedBagPop{
      background: rgba(0,0,0,0.9);
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      .light{
        width: 9.04rem;
        height: 9.22rem;
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 9;
        -webkit-transform: translate(-50%,-50%);
        -webkit-transform-origin: left top;
        -webkit-transform-origin: left top;
        img{
          width: 9.04rem;
          height: 9.22rem;
          display: block;
        }
      }
      .light.rotateAnimate{
        -webkit-animation: light 5s linear infinite;
        -webkit-transform-origin: left top;
      }
      .redBagBox{
        width: 3.81rem;
        height: 5.16rem;
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 9;
        -webkit-transform: translate(-50%,-50%) scale(0.5,0.5);
        -webkit-animation: redBagBox 2s forwards;
        .redBag{
          width: 3.81rem;
          height: 4.73rem;
          position: absolute;
          left: 0;
          bottom: 0;
          -webkit-animation: redBag 2s 2s linear forwards;
        }
        .noramlRed{
          -webkit-animation: normlRedBag 1s 3s linear forwards;
        }
        .yb{
          width: 1.74rem;
          height: 1.74rem;
          position: absolute;
          top: 1rem;
          left: 50%;
          z-index: 99999;
          -webkit-transform-origin: left top;
          -webkit-transform: translateX(-50%);
        }
        .ybAnimate{
          -webkit-animation: yb 1s 1.5s linear infinite;
        }
        .redBagActive{
          width: 3.81rem;
          height: 5.16rem;
          position: absolute;
          left: 0;
          bottom: 0;
          opacity: 0;
          -webkit-animation: redActive 1s 3.7s linear forwards;
        }
        .redBagMoney{
          width: 100%;
          color: #fff;
          font-size: 0.7rem;
          text-align: center;
          position: absolute;
          bottom: 0.9rem;
          opacity: 0;
          -webkit-animation: redBagMoney 1s 3.9s linear forwards;
        }
        .close{
          width: 0.6rem;
          height: 0.6rem;
          position: absolute;
          right: -1rem;
          top: -1rem;
          opacity: 0;
          -webkit-animation: redActive 1s 3.7s linear forwards;
        }
      }
    }
    .animated{-webkit-animation-duration:1s;animation-duration:1s;-webkit-animation-fill-mode:both;animation-fill-mode:both}
    @-webkit-keyframes light {
      0%{
        -webkit-transform-origin: left top;
        -webkit-transform: rotate(0deg) translate(-50%,-50%);
      }
      100%{
        -webkit-transform-origin: left top;
        -webkit-transform: rotate(360deg) translate(-50%,-50%);
      }
    }
    @-webkit-keyframes yb {
      0%{
        width: 1.74rem;
          height: 1.74rem;
        -webkit-transform: rotateY(0deg) translateX(-50%);
      }
      100%{
        width: 1.74rem;
          height: 1.74rem;
        -webkit-transform: rotateY(360deg) translateX(-50%);
      }
    }
    @-webkit-keyframes redBag {
      0%{
        opacity: 1;
      }
      100%{
        opacity: 1;
      }
    }
    @-webkit-keyframes redActive {
      0%{
        opacity: 0;
      }
      30%{
        opacity: 0.7;
      }
      100%{
        opacity: 1;
      }
    }
    @-webkit-keyframes redBagMoney {
      0%{
        opacity: 0;
      }
      100%{
        opacity: 1;
      }
    }
    @-webkit-keyframes redBagBox {
      0%{
        -webkit-transform: translate(-50%,-50%) scale(0.5,0.5);
      }
      100%{
        -webkit-transform: translate(-50%,-50%) scale(1,1);
      }
    }
    @-webkit-keyframes normlRedBag {
      0%{
        opacity: 1;
      }
      100%{
        opacity: 0;
      }
    }
    .backHome{
      width: 0.6rem;
      height: 0.6rem;
      position: absolute;
      left: 0.3rem;
      top: 0.3rem;
      z-index: 99;
      img{
        width: 0.6rem;
        height: 0.6rem;
      }
    }
  }
</style>
