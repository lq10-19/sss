<template>
  <div class="main">
    <div class="box" v-if="EnableTimesValBj == true">
      <image :src="shopUrl" mode="aspectFit" class="show-pic" v-if="shopUrl"></image>
      <image mode="aspectFit" class="border" src="http://bqyx-qiniu.bqrzzl.com/sweep/border.png"></image>
      <div class="scan-box" v-if="lineAniState == true">
        <div class="line ani"></div>
        <div class="tranpbox"></div>
      </div>
    </div>
    <div class="result" v-if="result == true">
      <p class="title">扫描结果</p>
      <p class="xx">车辆信息：{{year}}  <span>{{name}}</span></p>
      <div class="toast" v-if="resultState == true">{{tips1}}</div>
    </div>
    <div class="mess-wrap" :class="EnableTimesValBj == false?'no':''" v-if="EnableTimesValBj == false">
      <div class="state1" v-if="enableTimes == 2">
        <image src="http://bqyx-qiniu.bqrzzl.com/sweep/iocn1@2x.png"></image>
        <p>扫描次数已用完</p>
        <div class="btn share-btn" @click="getEnjoy">去邀请好友增加次数</div>
      </div>
      <div class="state2" v-if="enableTimes == 0">
        <image src="http://bqyx-qiniu.bqrzzl.com/sweep/icon2@2x.png"></image>
        <p>今日扫红包次数已用完<br>亲，明天再来</p>
        <div class="btn back-btn" @click="backActiveHome">确定</div>
      </div>
    </div>
    <div class="red-pop" v-if="popState == 1">
      <div class="red-box" v-if="redBagState == 0">
        <div class="open" @click="openRedBag"></div>
        <div class="close" @click="closePop(1)"></div>
      </div>
      <div class="open-red-box" v-if="redBagState == 1">
        <div class="content">
          <p class="red-money">{{redBagMoney}}<span>元</span></p>
          <p class="desc">红包金额已存入您的佰仟易行账户</p>
          <p class="go" @click="goWallet">点击前往查看</p>
          <div class="comfirm-btn" @click="backActiveHome"></div>
        </div>
        <div class="close" @click="closePop(2)"></div>
      </div>
    </div>
    <div class="not-pop" v-if="popState == 0">
      <div :class="'pop '+randPopClass">
        <div class="mess" v-if="popTextState == 0">
          <p>哎呀，没扫中</p>
          <p>换个姿势再来一次</p>
        </div>
        <div class="mess" v-if="popTextState == 1">
          <p>据说，红色车的</p>
          <p>中奖率更高哦，</p>
          <p>赶紧试试？</p>
        </div>
        <div class="mess" v-if="popTextState == 2">
          <p>不要半途而废，</p>
          <p>换台车再扫一次吧</p>
        </div>
        <div class="mess" v-if="popTextState == 3">
          <p>别灰心，</p>
          <p>把手机倒过来再扫一次</p>
        </div>
        <div class="mess" v-if="popTextState == 4">
          <p>很遗憾，没中奖</p>
          <p>据说分享更容易中奖</p>
        </div>
        <div class="mess" v-if="popTextState == 5">
          <p>好可惜，离红包</p>
          <p>就差0.1厘米了~</p>
        </div>
        <div class="mess" v-if="popTextState == 6">
          <p>不多扫几次，</p>
          <p>你永远不知道自己</p>
          <p>啥时候会中奖</p>
        </div>
        <div class="mess" v-if="popTextState == 7">
          <p>1次没中没关系</p>
          <p>扫10次还不中？</p>
          <p>你来找我</p>
        </div>
        <div class="mess" v-if="popTextState == 8">
          <p>中奖率超高der</p>
          <p>没中是因为</p>
          <p>玩的次数不够</p>
        </div>
        <div class="mess" v-if="popTextState == 9">
          <p>再来N次</p>
          <p>保证会中奖</p>
        </div>
        <div class="btn" @click='backActiveHome(1)'>再扫一次</div>
        <div class="close" @click="closePop(2)"></div>
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
  </div>
</template>
<script>
import { path, getLoginInfo, getSystemInfo,showLoading,apiFail } from "@/utils/index";
import { setTimeout } from 'timers';
export default {
  components: {},
  data() {
    return {
      shopUrl: '',
      showLoading: true,
      base64:'',
      year: '',
      name: '',
      popState: 2,
      popTextState: 0,
      randPopClass: 'pop0',
      lineAniState: true, //扫描动画
      result: false, //扫描完成,
      enableTimes: 10,
      redBagState: 0, //红包状态
      redpacketId: '',
      redBagMoney: '0',
      goEnjoy: false,
      resultState: true,
      EnableTimesValBj: true,
      tips1: '正获取红包结果，请稍等...',
      enable: 10
    };
  },
  onLoad(options) {
    //this.shopUrl = 'http://bqyx-qiniu.bqrzzl.com/sweep/open-redbag.png';
    this.popState = 2;
    this.redBagMoney = 0;
    this.popState = 2;
    this.goEnjoy = false;
    this.lineAniState = true;
    this.result = false;
    this.resultState = true;
    this.redBagState = 0;
    this.EnableTimesValBj = true;
    if(options.imgsrc){
      this.EnableTimesValBj = true;
      this.lineAniState = true;
      this.shopUrl = options.imgsrc;
      console.log(this.EnableTimesValBj);
      console.log('---*---')
      var aa = wx.getFileSystemManager();
      var that = this;
      aa.readFile({
        filePath: this.shopUrl,
        encoding:'base64',
        success:function(data){
          that.base64 = data.data;
          that.doScanning();
        },
        fail:function(){
          console.log('转换失败');
        }
      });
    }else{ 
      if(options.EnableTimesVal == 2 || options.EnableTimesVal == 3){
        this.lineAniState = false;
        this.EnableTimesValBj = false;
        this.enableTimes = 2;
        this.result = false;
        return false;
      }else if(options.EnableTimesVal == 0 || options.EnableTimesVal == 4){
        this.lineAniState = false;
        this.EnableTimesValBj = false;
        this.enableTimes = 0;
        this.result = false;
        return false;
      }
    }
  },
  onShow() {
    
  },
  onReady() {
    
  },
  onShareAppMessage(params) {
    let loginInfo = getLoginInfo();
    let userid = loginInfo.userid;
    let nickname = loginInfo.nickname;
    this.goEnjoy = false;
    return {
      title: nickname+"邀你一起瓜分百万现金，扫扫就能领哦~",
      imageUrl: 'http://bqyx-qiniu.bqrzzl.com/sweep/banner.jpg',
      path: `/pages/active/sweeping/main?aidUserId=${userid}`
    };
  },
  methods: {
    doScanning(){
      let userInfo = getLoginInfo();
      let url = path.doScanning;
      let queryData = {
        "userId": userInfo.userid,
        "image": this.base64
      };
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          console.log(data);
          this.enable = data.enableTimes;
          var that = this;
          setTimeout(function(){
            that.lineAniState = false;
            that.result = true;
            if(data.result){
              if(data.result.name == '非车类'){
                that.year = data.result.year;
                that.name = data.result.name;
                that.tips1 = '只有扫车才有红包哦~';
                return false;
              }else{
                that.tips1 = '正获取红包结果，请稍等...';
                that.year = data.result.year;
                that.name = data.result.name;
              }
            }
            setTimeout(function(){
              that.resultState = false;
              if(data.hasRedpacket == 1){
                that.popState = 1;
                that.redBagState = 0;
                that.redpacketId = data.redpacketId;
              }else{
                if(data.enableTimes >=0){
                  that.popState = 0;
                  var randTextState = Math.floor(Math.random()*10);
                  var randPopClass = Math.floor(Math.random()*3);
                  that.popTextState = randTextState;
                  that.randPopClass = 'pop'+randPopClass;
                  console.log(that.randPopClass)
                }
              }
            },5000)
          },3000);
        })
        .catch(e => {
          apiFail(e);
        });
      return promise;
    },
    openRedBag(){
      let url = path.openRedpacket+'/'+this.redpacketId;
      let queryData = {
      };
      let promise = this.$fly.get(url, queryData);
      promise
        .then(data => {
          console.log(data);
          this.redBagState = 1;
          this.redBagMoney = this.returnFloat(data);
        })
        .catch(e => {
          apiFail(e);
        });
      return promise;
    },
    closePop(e){
      var that = this;
      if(e == 1){
        wx.showToast({
          title: "记得打开红包哦~",
          icon: "none"
        });
        return false;
      }else if(e == 2){
        this.popState = 2;
        setTimeout(function(){
          that.redBagState = 0;
        },500);
        wx.reLaunch({
          url: "/pages/active/sweeping/main"
        })
      }
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
    goWallet() {
      //getApp().aldstat.sendEvent(event["my.balance"]);
      wx.navigateTo({
        url: "/pages/user/wallet/main"
      });
    },
    backActiveHome(e){
      if(e == 1){
        if(this.enable <= 0){
          wx.reLaunch({
            url: "/pages/active/sweeping/main"
          })
        }else{
          wx.reLaunch({
            url: "/pages/active/sweeping/main?scann=true"
          })
        }
        
      }else{
        wx.reLaunch({
          url: "/pages/active/sweeping/main"
        })
      }
    },
    getEnjoy(e) {
      console.log(e);
      if(e.avatarUrl == null){
        this.goEnjoy = true;
      }else{
        this.goEnjoy = false;
      }
    },
    know() {
      this.goEnjoy = false;
    },
    enjoyFriend() {
      this.goEnjoy = false;
      wx.navigateTo({
        url: "/pages/active/sweeping/posterScanning/main"
      });
    },
  }
};
</script>

<style lang="scss" scoped>
  .main{
    background: #fff;
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
    .box{
      width: 100%;
      overflow: hidden;
      height: 6.16rem;
      position: relative;
      .show-pic{
        width: 100%;
        height: 100%;
      }
      .border{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1.06rem;
        z-index: 99;
      }
      .scan-box{
        width: 100%;
        height: 6.16rem;
        position: absolute;
        left: 0;
        -webkit-transform: translateY(-100%);
        z-index: 98;
        .line{
          width: 100%;
          height: 1px;
          background:#FF9800;
          position: absolute;
          left: 0;
          -webkit-transform: translateY(-100%);
          z-index: 98;
        }
        .line.ani{
          -webkit-animation: scanAni 3s 1s ease-in-out infinite;
        }
        .tranpbox{
          height: 6.16rem;
          background:linear-gradient(178deg,rgba(255,152,0,0) 0%, rgba(255,152,1,1) 100%);
opacity:0.47;
        }
        @keyframes scanAni {
          0% {-webkit-transform: translateY(-100%);}
          50% {-webkit-transform: translateY(6.16rem);}
          100% {-webkit-transform: translateY(-100%);}
        }
      }
      
    }
    .mess-wrap{
      width: 100%;
      text-align: center;
      position: absolute;
      bottom: 0.87rem;
      opacity: 0;
      -webkit-animation: showAni 1s ease-in-out forwards;
      .state1{
        image{
          width: 3.33rem;
          height: 1.86rem;
          margin: 0 auto;
          margin-bottom: 0.85rem;
        }
        p{
          font-size: 0.3rem;
          color: #000;
          width: 100%;
          text-align: center;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }
      }
      .state2{
        image{
          width: 3.35rem;
          height: 1.87rem;
          margin: 0 auto;
          margin-bottom: 0.58rem;
        }
        p{
          font-size: 0.3rem;
          color: #000;
          width: 100%;
          text-align: center;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }
      }
      .btn{
        width: 5rem;
        height: 0.8rem;
        border-radius: 0.4rem;
        background:linear-gradient(180deg,rgba(255,195,37,1),rgba(255,151,0,1));
        text-align: center;
        line-height: 0.8rem;
        font-size: 0.26rem;
        color:#fff;
        font-weight: bold;
        margin: 0 auto;
      }
    }
    .mess-wrap.no{
      top: 50%;
      -webkit-transform: translateY(-50%);
    }
    @keyframes showAni {
      0% {opacity: 0;}
      100% {opacity: 1;}
    }
    .red-pop{
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.75);
      z-index: 999;
      opacity: 0;
      -webkit-animation: showAni 1s ease-in-out forwards;
      .red-box{
        width: 7.5rem;
        height: 8.86rem;
        left: 50%;
        top: 0.7rem;
        position: absolute;
        -webkit-transform: translateX(-50%);
        background: url('http://bqyx-qiniu.bqrzzl.com/sweep/redbag.png') no-repeat center;
        background-size: 100% 100%;
      }
      .open-red-box{
        width: 7.5rem;
        height: 9.51rem;
        left: 50%;
        top: 0;
        position: absolute;
        -webkit-transform: translateX(-50%);
        background: url('http://bqyx-qiniu.bqrzzl.com/sweep/open-redbag.png') no-repeat center;
        background-size: 100% 100%;
        .content{
          margin-top: 5.5rem;
          text-align: center;
          .red-money{
            font-size: 1rem;
            font-weight: bold;
            color:rgba(255,219,123,1);
            text-shadow:0px 0px 15px rgba(209,32,32,0.59);
            margin-bottom: 0.1rem;
            span{
              font-size: 0.48rem;
              font-weight: 100;
            }
          }
          .desc{
            font-size: 0.24rem;
            color: #FFDB7B;
          }
          .go{
            font-size: 0.24rem;
            color: #fff;
            position: relative;
            padding-right: 0.3rem;
            display: inline-block;
          }
          .go:after{
            position: absolute;
            content:  '';
            width: 0.2rem;
            height: 0.12rem;
            background: url('http://bqyx-qiniu.bqrzzl.com/sweep/more.png') no-repeat center;
            background-size: 100% 100%;
            right: 0;
            top: 50%;
            -webkit-transform: translateY(-50%);
          }
          .comfirm-btn{
            width: 3rem;
            height: 0.83rem;
            background: url('http://bqyx-qiniu.bqrzzl.com/sweep/comfirm-btn.png') no-repeat center;
            background-size: 100% 100%;
            margin: 0 auto;
            margin-top: 0.18rem;
          }
        }
      }
      .open{
        width: 1.68rem;
        height: 1.68rem;
        position: absolute;
        left: 50%;
        -webkit-transform: translateX(-50%);
        top: 3.7rem;
      }
      .close{
        width: 0.57rem;
        height: 0.57rem;
        position: absolute;
        left: 50%;
        bottom: -0.9rem;
        -webkit-transform: translateX(-50%);
        background: url('http://bqyx-qiniu.bqrzzl.com/sweep/close-icon.png') no-repeat center;
        background-size: cover;
      }
    }
    .not-pop{
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.75);
      z-index: 999;
      opacity: 0;
      -webkit-animation: showAni 1s ease-in-out forwards;
      .pop{
        width: 5.7rem;
        height: 6.88rem;
        left: 50%;
        top: 50%;
        -webkit-transform: translate(-50%,-50%);
        position: absolute;
        .mess{
          margin-top: 1.08rem;
          width: 100%;
          overflow: hidden;
          p{
            font-size: 0.4rem;
            color: #fff;
            text-align: center;
            font-weight: bold;
            line-height: 0.7rem;
          }
        }
        .close{
          width: 0.57rem;
          height: 0.57rem;
          position: absolute;
          left: 50%;
          bottom: -0.9rem;
          -webkit-transform: translateX(-50%);
          background: url('http://bqyx-qiniu.bqrzzl.com/sweep/close-icon.png') no-repeat center;
          background-size: cover;
        }
      }
      .pop0{
        background: url('http://bqyx-qiniu.bqrzzl.com/sweep/pop1.png') no-repeat center;
        background-size: 100% 100%;
      }
      .pop1{
        background: url('http://bqyx-qiniu.bqrzzl.com/sweep/pop2.png') no-repeat top left;
        background-size: 6.32rem 6.88rem;
      }
      .pop2{
        background: url('http://bqyx-qiniu.bqrzzl.com/sweep/pop3.png') no-repeat center;
        background-size: 100% 100%;
      }
      .btn{
        width:3.5rem;
        height:0.83rem;
        background:linear-gradient(180deg,rgba(255,195,37,1),rgba(255,151,0,1));
        border-radius:0.42rem;
        left: 50%;
        -webkit-transform: translateX(-50%);
        bottom: 0.38rem;
        font-size: 0.34rem;
        position:absolute;
        color: #fff;
        font-weight: bold;
        line-height: 0.83rem;
        text-align: center;
      }
    }
    .result{
      margin-top: 0.59rem;
      width: 100%;
      overflow: hidden;
      text-align: center;
      opacity: 0;
      -webkit-animation: showAni 1s 1s ease-in-out forwards;
      .title{
        font-size: 0.3rem;
        color: #FF9902;
        display: inline-block;
        position: relative;
      }
      .title:before{
        content: '';
        position: absolute;
        left: -1.3rem;
        background: #FF9902;
        height: 1px;
        width:1rem;
        top: 50%;
        -webkit-transform: translateY(-50%);
      }
      .title:after{
        content: '';
        position: absolute;
        right: -1.3rem;
        background: #FF9902;
        height: 1px;
        width:1rem;
        top: 50%;
        -webkit-transform: translateY(-50%);
      }
      .xx{
        font-size: 0.3rem;
        color: #000;
        width: 100%;
        overflow:hidden;
        margin: 0.78rem 0 1.58rem 0;
        span{
          margin-left: 0.2rem;
        }
      }
      .toast{
        font-size: 0.28rem;
        color: #fff;
        background: rgba(0,0,0,0.47);
        border-radius: 0.12rem;
        padding:0.12rem 0.25rem;
        display: inline-block;
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
  }
</style>
