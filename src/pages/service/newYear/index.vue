<template>
  <div class="main">
    <div class="head">
      <image class="headbg" mode="widthFix" src="http://bqyx-qiniu.bqrzzl.com/newyear/bg2@2x.png"></image>
      <img class="rule" src="http://bqyx-qiniu.bqrzzl.com/newyear/rule-icon.png" alt @click="goRule" />
      <div class="title-banner">
        <div class="ul-box">
          <ul :style="{'top':top}">
            <li v-for="(item,index) in titleBanner" :key="index"><p>{{item.fromNickname}}刚刚给拜年团打赏了一个大红包~！</p></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="zs-left zs"></div>
      <div class="zs-right zs"></div>
      <div class="pb-box">
        <div class="redBagDetailed" @click="goRedBagDetailed">明细</div>
        <img class="user" v-if="avatarurl!='' || avatarurl!=null" :src="avatarurl" />
        <img class="user" v-else src="/static/img/sign/user.png" />
        <p class="pb-title">获得拜年压岁钱总额</p>
        <p class="moneny">{{sumRedPacket}}元</p>
        <div class="grouplist-btn" @click="goGroupList">发起组团拜年</div>
      </div> 
      <div class="btn-box">
        <div class="x-btn myOrganize-btn" @click="goMyOrganize">我的组织</div>
        <div class="x-btn newYearRecord-btn" @click="goNewYearRecord">拜年记录</div>
      </div>
      <div class="btn-wrap">
        <div class="rank-btn" @click="goBqzl">向佰仟租赁拜年</div>
      </div>
      <div class="btn-wrap">
        <div class="rank-btn" @click="goRank">英雄榜</div>
      </div>
      <div class="pb-1-box">
        <p class="title">新年贺岁</p>
        <div class="ulbox">
          <ul>
            <li v-for="(item,index) in allListInfo" :key="index"><span>{{item.fromNickname}}</span>组团给<span>{{item.toNickname}}</span>拜年啦，祝{{item.greetingsValue}}</li>
            <li v-for="(item,index) in allListInfo" :key="index"><span>{{item.fromNickname}}</span>组团给<span>{{item.toNickname}}</span>拜年啦，祝{{item.greetingsValue}}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="pop-wrap" v-if="popShow == true">
      <div class="pop-box follow-public-pop">
        <div class="text-box">
          <p class="msg">关注佰仟融资租赁</p>
          <p class="msg">公众号领取拜年红包</p>
          <p class="desc">佰仟易行关联的公众号“佰仟融资租赁”</p>
          <div class="bbtn" @click="closePop">确定</div>
        </div>
      </div>
      <div class="official-box">
        <official-account class="official-account"></official-account>
      </div>
    </div>
    <div class="pop-wrap" v-if="bqzpGiveRedBagPop == true">
      <div class="pop-box bqzp-give-redBag-pop">
        <div class="text-box">
          <p class="msg">拜年祝福发送成功！ </p>
          <p class="msg">恭喜您获得 </p>
          <p class="desc">{{bqzpGiveRedBag}}元</p>
          <div class="bbtn" @click="closeGivePop">确定</div>
        </div>
      </div>
    </div>
    <div class="form-box" v-if="followPublic == true">
      <div class="form">
        <p class="msg">关注佰仟融资租赁公众号</p>
        <p class="msg">领取拜年红包</p>
        <button open-type="contact" show-message-card="true" send-message-img="http://bqyx-qiniu.bqrzzl.com/newyear/newYearBanner2.jpg" class="btn" @click="closeFormBox">关注公众号</button>
        <p class="tips">点击按钮后请如下图操作 识别二维码关注公众号</p>
        <img class="step-ani" src="http://bqyx-qiniu.bqrzzl.com/newyear/stepani.gif" />
      </div>
    </div>
    <div class="footer">
      <image class="img" mode="widthFix" src="http://bqyx-qiniu.bqrzzl.com/newyear/footer-bg.png"></image>
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
let titlteBannerTime = -1;
export default {
  components: {},
  data() {
    return {
      avatarurl: '',
      sumRedPacket: '0.00',
      titleBanner:'',
      popShow: false,
      allListInfo: '',
      followPublic: false,
      bqzpGiveRedBagPop: true,
      bqzpGiveRedBag: '0.00',
      activeIndex: 0,
      top: '0'
    };
  },
  onLoad(options) {
    console.log(options);
    if(options.bqzpGiveRedBag){
      this.bqzpGiveRedBag = options.bqzpGiveRedBag;
      this.bqzpGiveRedBagPop = true;
    }else{
      this.bqzpGiveRedBagPop = false;
    };
    //只要进入此页面就清除拜年成功缓存flag
    if(wx.getStorageSync("newYearIsSuccess")){
      wx.removeStorageSync("newYearIsSuccess");
    };
  },
  onShow(options) {
    if (!getLoginInfo() && !this.isGoLoginPage) {
      this.isGoLoginPage = true;
      const url = "/pages/login/main";
      wx.navigateTo({ url });
      return;
    }else{
      console.log(options)
      this.getAllListInfo();
      this.getSumRedPacket();
      this.subscribe();
      var sceneVal = wx.getStorageSync("sceneVal");
      let loginInfo = getLoginInfo();
      this.avatarurl = loginInfo.avatarurl;
      var that = this;
      that.getNearestReward();
      clearInterval(titlteBannerTime);
      titlteBannerTime = setInterval(this.tops,2000);
    }
  },
  onHide(){
    
  },
  onShareAppMessage(params) {
    console.log(params);
    var newYearShareTitle = [
      '来组团拜年吧，新年一起旺旺旺！',
      '不是好友也能给他拜年？不信戳我',
      '创意拜年新方式，一起组队忒好玩！',
      '金猪贺岁，组队拜年领红包！',
      '新年红包大派送，猪年好运连连来',
      '迎新春、贺新年，组个团队来拜年',
      '2019好彩头 拜年就能领红包',
      '新春开门红 贺岁红包一起领',
      '咚咚锵 咚咚锵 红包来了 开！',
      '猪年行大运  红包拿不停',
      '你有一个新年红包  快拆开',
      '一大波组队拜年消息袭来，赶紧去试试吧'
    ];
    console.log(newYearShareTitle);
    var num=Math.floor(Math.random()*12);
    console.log(num)
    return {
      title: newYearShareTitle[num],
      imageUrl: 'http://bqyx-qiniu.bqrzzl.com/newyear/newYearBanner2.jpg',
      path: `/pages/service/newYear/main`
    };
  },
  methods: {
    goGroupList(){
      wx.navigateTo({
        url: "/pages/service/newYear/groupList/main",
        fail:(res)=>{
          wx.reLaunch({
            url: "/pages/service/newYear/groupList/main"
          });
        }
      });
    },
    goMyOrganize(){
      wx.navigateTo({
        url: "/pages/service/newYear/myOrganize/main",
        fail:(res)=>{
          wx.redirectTo({
            url: "/pages/service/newYear/myOrganize/main"
          });
        }
      });
    },
    goNewYearRecord(){
      wx.navigateTo({
        url: "/pages/service/newYear/newYearRecord/main",
        fail:(res)=>{
          wx.redirectTo({
            url: "/pages/service/newYear/newYearRecord/main"
          });
        }
      });
    },
    goRank(){
      wx.navigateTo({
        url: "/pages/service/newYear/rank/main",
        fail:(res)=>{
          wx.redirectTo({
            url: "/pages/service/newYear/rank/main"
          });
        }
      });
    },
    goRule(){
      wx.navigateTo({
        url: "/pages/service/newYear/rule/main",
        fail:(res)=>{
          wx.redirectTo({
            url: "/pages/service/newYear/rule/main"
          });
        }
      });
    },
    goRedBagDetailed(){
      wx.navigateTo({
        url: "/pages/service/newYear/redBagDetailed/main",
        fail:(res)=>{
          wx.redirectTo({
            url: "/pages/service/newYear/redBagDetailed/main"
          });
        }
      });
    },
    getSumRedPacket(){
      let loginInfo = getLoginInfo();
      let url = path.getSumRedPacket+'/'+loginInfo.userid;
      let queryData = {
        
      };
      let promises = this.$fly.get(url, queryData);
      promises
        .then(data => {
          // console.log(data);
          this.sumRedPacket = this.returnFloat(data);
        })
        .catch(e => {
          apiFail(e);
        });
      return promises;
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
    getNearestReward(){
      let loginInfo = getLoginInfo();
      let url = path.getNearestReward;
      let queryData = {
        
      };
      let promises = this.$fly.get(url, queryData);
      promises
        .then(data => {
          console.log(data);
          if(data != ''){
            this.titleBanner = data;
          }
        })
        .catch(e => {
          apiFail(e);
        });
      return promises;
    },
    closePop(){
      this.popShow = false;
    },
    closeGivePop(){
      this.bqzpGiveRedBagPop = false;
    },
    getAllListInfo(){
      let loginInfo = getLoginInfo();
      let url = path.getAllListInfo;
      let queryData = {
        
      };
      let promises = this.$fly.get(url, queryData);
      promises
        .then(data => {
          console.log(data);
          this.allListInfo = data;
        })
        .catch(e => {
          apiFail(e);
        });
      return promises;
    },
    subscribe(){
      var sceneVal = wx.getStorageSync("sceneVal");
      console.log(sceneVal);
      let loginInfo = getLoginInfo();
      console.log(loginInfo);
      let url = path.subscribe;
      var unionid = loginInfo.unionid
      let queryData = {
        "unionid": unionid
      };
      let promises = this.$fly.post(url, queryData);
      promises
        .then(data => {
          console.log('是否关注公众号');
          console.log(data);
          if(data.data[unionid] == 1){
            this.followPublic = false;
            this.popShow = false;
            console.log('yes关注公众号了')
          }else{
            console.log('no关注公众号了')
            if(sceneVal == 1011 || sceneVal == 1047 || sceneVal == 1083){
              console.log('启动关注公众号组件')
              this.popShow = true;
              this.followPublic = false;
            }else{
              this.followPublic = true;
              this.popShow = false;
            }
          }
        })
        .catch(e => {
          apiFail(e);
        });
      return promises;
    },
    closeFormBox(){
      this.followPublic = false;
    },
    goBqzl(){
      this.hasGreetedToBQ();
    },
    hasGreetedToBQ(){
      let loginInfo = getLoginInfo();
      let url = path.hasGreetedToBQ + '/' +loginInfo.userid;
      let queryData = {};
      let promises = this.$fly.get(url, queryData);
      promises
        .then(data => {
          console.log(data);
          if(data == 1){
            console.log('已经向佰仟拜年过啦');
            wx.showToast({
              title: "已经向佰仟拜年过啦~",
              icon: "none"
            });
            return false;
          }else if(data == 2){
            wx.showToast({
              title: "红包已派完!",
              icon: "none"
            });
            setTimeout(function(){
              wx.navigateTo({
                url: "/pages/service/newYear/main",
                fail:(res)=>{
                  wx.redirectTo({
                    url: "/pages/service/newYear/main"
                  });
                }
              });
            },2000);
            return false;
          } else{
            console.log('还没给佰仟拜年过');
            wx.navigateTo({
              url: "/pages/service/newYear/bqzpNewYear/main",
              fail:(res)=>{
                wx.redirectTo({
                  url: "/pages/service/newYear/bqzpNewYear/main"
                });
              }
            });
          }
        })
        .catch(e => {
          apiFail(e);
        });
      return promises;
    },
    tops() {
      if(this.activeIndex < this.titleBanner.length - 1) {
        this.activeIndex += 1;
        this.top =  -this.activeIndex * 92 + 'rpx';
      } else {
        this.activeIndex = 0;
        this.top =  -this.activeIndex * 92 + 'rpx';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .main{
    width: 100%;
    background: url('http://bqyx-qiniu.bqrzzl.com/newyear/bg.png') repeat-y top;
    background-size: 100% 7.5rem;
    .head{
      position: relative;
      .headbg{
        width: 100%;
      }
      .rule{
        width: 0.86rem;
        height: 0.82rem;
        position: absolute;
        right: 0.5rem;
        top: 0;
      }
      .title-banner{
        position: absolute;
        width: 6.56rem;
        height: 1.42rem;
        background: url('http://bqyx-qiniu.bqrzzl.com/newyear/calligraphy.png') repeat-y top;
        background-size: 6.56rem 1.42rem;
        bottom: 0.25rem;
        left: 50%;
        -webkit-transform: translateX(-50%);
        .ul-box{
          width: 100%;
          overflow: hidden;
          height: 0.92rem;
          position: relative;
          margin-top: 0.3rem;
        }
        ul{
          width: 100%;
          overflow: hidden;
          position: absolute;
          left: 0;
          top: 0;
          transition: top 0.5s;
          li{
            width: 100%;
          }
        }
        p{
          color: #FDC254;
          font-size: 0.22rem;
          text-align: center;
          margin: 0 1rem;
          height: 0.92rem;
          line-height: 0.92rem;
          box-sizing: border-box;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }
      }
    }
    .section{
      width: 100%;
      position: relative;
      .zs{
        width: 0.55rem;
        height: 100%;
        position: absolute;
        top: 0;
      }
      .zs-left{
        background: url('http://bqyx-qiniu.bqrzzl.com/newyear/zs-left.png') repeat-y top;
        background-size: 0.55rem 6.72rem;
        left: 0rem;
      }
      .zs-right{
        background: url('http://bqyx-qiniu.bqrzzl.com/newyear/zs-right.png') repeat-y top;
        background-size: 0.55rem 6.72rem;
        right: 0rem;
      }
      .pb-box{
        width: 7.17rem;
        height: 5.08rem;
        background: url('http://bqyx-qiniu.bqrzzl.com/newyear/pb1.png') repeat-y top;
        background-size: 7.17rem 5.08rem;
        margin: 0 auto;
        position: relative;
        .redBagDetailed{
          width: 0.7rem;
          height: 0.41rem;
          line-height: 0.41rem;
          font-size: 0.24rem;
          color: #D22A2A;
          border-radius: 0.21rem 0px 0px 0.21rem;
          background: #FFB644;
          right: 0.72rem;
          top: 2.01rem;
          position: absolute;
          font-weight: bold;
          padding-left: 0.17rem;
          box-sizing: border-box;
        }
        .user{
          width: 1.07rem;
          height: 1.07rem;
          display: block;
          border-radius: 50%;
          border:0.05rem solid #F9BE4D;
          position: absolute;
          top: 0.34rem;
          left: 50%;
          -webkit-transform: translateX(-50%);
        }
        .pb-title{
          width: 100%;
          text-align: center;
          font-size: 0.28rem;
          color: #FBD175;
          padding-top: 1.95rem;
          padding-bottom: 0.3rem;
          font-weight: bold;
        }
        .moneny{
          width: 100%;
          text-align: center;
          font-size: 0.54rem;
          color: #FDC254;
          font-weight: bold;
        }
        .grouplist-btn{
          width: 3.56rem;
          height: 0.77rem;
          background: url('http://bqyx-qiniu.bqrzzl.com/newyear/btn2@2x.png') repeat-y top;
          background-size: 3.56rem 0.77rem;
          position: absolute;
          bottom: 0.65rem;
          left: 50%;
          -webkit-transform: translateX(-50%);
          font-size: 0.3rem;
          text-align: center;
          color: #D22A2A;
          font-weight: bold;
          line-height: 0.7rem;
        }
      }
      .btn-box{
        width: 100%;
        overflow: hidden;
        padding: 0 0.86rem;
        box-sizing: border-box;
        margin-top: 0.2rem;
        .x-btn{
          width: 2.6rem;
          height: 0.86rem;
          font-size: 0.3rem;
          color: #D22A2A;
          text-align: center;
          line-height: 0.86rem;
          font-weight: bold;
        }
        .myOrganize-btn{
          float: left;
          background: url('http://bqyx-qiniu.bqrzzl.com/newyear/btn1@2x.png') repeat-y top;
          background-size: 2.6rem 0.86rem;
        }
        .newYearRecord-btn{
          float: right;
          background: url('http://bqyx-qiniu.bqrzzl.com/newyear/btn1@2x.png') repeat-y top;
          background-size: 2.6rem 0.86rem;
        }
      }
      .btn-wrap{
        padding: 0 0.87rem;
        width: 100%;
        overflow: hidden;
        box-sizing: border-box;
        margin-top: 0.5rem;
        .rank-btn{
          width: 100%;
          height: 0.88rem;
          background:linear-gradient(#ec8d65,rgba(210,42,42,1));
          border-radius:0.20rem;
          font-size: 0.3rem;
          color: #FFD29C;
          text-align: center;
          line-height: 0.88rem;
          font-weight: bold;
        }
      }
      .pb-1-box{
        width: 7.11rem;
        height: 5.08rem;
        background: url('http://bqyx-qiniu.bqrzzl.com/newyear/pb2.png') repeat-y top;
        background-size: 7.11rem 5.08rem;
        margin: 0 auto;
        position: relative;
        overflow: hidden;
        margin-top: 0.56rem;
        .title{
          padding-top: 0.78rem;
          font-size: 0.32rem;
          color: #FBD175;
          width: 100%;
          text-align: center;
          font-weight: bold;
          overflow: hidden;
        }
        .ulbox{
          width: 100%;
          height: 2.85rem;
          overflow: hidden;
          margin-top: 0.44rem;
          position: relative;
        }
        ul{
          width: 100%;
          padding: 0 1.2rem;
          box-sizing: border-box;
          position: absolute;
          left: 0;
          -webkit-transform: translateY(0);
          -webkit-animation: myfirst 5s 1s ease-in infinite;
        }
        @-webkit-keyframes myfirst {
          0% {-webkit-transform: translateY(0);}
          100% {-webkit-transform: translateY(-50%);}
        }
        ul li{
          width: 100%;
          font-weight: bold;
          font-size: 0.22rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow:ellipsis;
          margin-bottom: 0.3rem;
          color: #FBD175;
          span{
            color: #F6FF00
          }
        }
      }
    }
    .pop-wrap{
      width: 100%;
      height: 100%;
      position: fixed;
      left: 0;
      top: 0;
      background: rgba(0,0,0,0.7);
      z-index: 999;
    }
    .official-box{
      position: absolute;
      left: 50%;
      -webkit-transform: translateX(-50%);
      bottom: 10%;
      width: 100%;
    }
    .pop-box{
      width: 4.74rem;
      height: 5.4rem;
      background: url('http://bqyx-qiniu.bqrzzl.com/newyear/pop-bg.png') repeat-y top;
      background-size: 4.74rem 5.4rem;
      left: 50%;
      top: 50%;
      -webkit-transform: translate(-50%,-50%);
      position: absolute;
      .text-box{
        width: 100%;
        overflow: hidden;
        margin-top: 2.5rem;
      }
      .msg{
        color: #FDC254;
        font-size: 0.32rem;
        width: 100%;
        text-align: center;
        font-weight: bold;
      }
      .desc{
        font-size: 0.19rem;
        width: 100%;
        text-align: center;
        color: #FDC254;
        margin-top: 0.25rem;
        overflow: hidden;
      }
      .dmsg{
        margin-top: 2.8rem;
      }
      .bbtn{
        width: 3.2rem;
        height: 0.76rem;
        line-height: 0.76rem;
        text-align: center;
        font-weight: bold;
        font-size: 0.3rem;
        background: url('http://bqyx-qiniu.bqrzzl.com/newyear/btn4.png') no-repeat;
        background-size: 3.2rem 0.76rem;
        color: #D22A2A;
        position: absolute;
        bottom: 0.4rem;
        left: 50%;
        -webkit-transform: translateX(-50%);
      }
      
    }
    .bqzp-give-redBag-pop{
      .desc{
        font-size: 0.4rem;
        margin-top: 0.1rem;
      }
    }
    .form-box{
      position: fixed;
      width: 100%;
      height: 100%;
      left: 0;
      top:0;
      background: rgba(0,0,0,0.7);
      z-index: 99999;
      .form{
        overflow: hidden;
        border-radius: 0.2rem;
        background: #fff;
        box-sizing: border-box;
        padding: 0.25rem 0.5rem;
        position: absolute;
        left: 50%;
        top: 50%;
        -webkit-transform: translate(-50%,-50%);
        .msg{
          width: 100%;
          overflow: hidden;
          text-align: center;
          font-size: 0.3rem;
          color: #000;
          font-weight: bold;
          margin-bottom: 0.1rem;
        }
        .btn{
          width: 4.5rem;
          height: 0.86rem;
          line-height: 0.86rem;
          text-align: center;
          font-weight: bold;
          font-size: 0.3rem;
          background: url('http://bqyx-qiniu.bqrzzl.com/newyear/btn6.png') no-repeat;
          background-size: 4.5rem 0.86rem;
          color: #D22A2A;
          margin: 0 auto;
          border: none;
          padding: 0;
          margin-top: 0.1rem;
        }
        .btn::after{
          border: none;
        }
        .tips{
          width: 3rem;
          margin: 0 auto;
          font-size: 0.26rem;
          color: #000;
          text-align: center;
          margin-top: 0.17rem;
          margin-bottom: 0.22rem;
        }
        .step-ani{
          width: 4.6rem;
          height: 5.5rem;
          margin: 0 auto;
        }
      }
    }
    
    .footer{
      .img{
        width: 100%;
      }
    }
  }
</style>
