<template>
  <div class="main">
    <img class="flower" src="http://bqyx-qiniu.bqrzzl.com/newyear/flower.png" />
    <div class="zs-left zs"></div>
    <div class="zs-right zs"></div>
    <div class="content" :style="{'min-height': windowHeight+'rpx'}">
      <div class="title-box">
        <p>给“佰仟租赁”送新春祝福</p>
        <p>领取随机大红包</p>   
      </div>
      <div class="textarea" @click="showMsgFun">
        <p>{{blessings.greetingsValue}}</p>
        <span class="editBtn">点击编辑</span>
      </div>
      <div class="btn-wrap">
        <div class="grouplist-btn btn" @click="goActiveHome">确定发送</div>
      </div>
      <!-- 祝福语 -->
      <div @click="shadeFun" v-show="showMsg" class="shade"></div>
      <div ref="blessings2"  class="blessings" :class="{'blessingsShow':showMsg}">
        <ul>
          <li @click="selectMsg(item)" v-for="(item,index) in blessingsList" :key="index"><p>{{item.greetingsValue}}</p></li>
        </ul>
      </div>
    </div>
    <div class="footer">
      <image class="img" mode="widthFix" src="http://bqyx-qiniu.bqrzzl.com/newyear/footer-bg.png"></image>
    </div>
  </div>
</template>
<script>
import { path, getLoginInfo, getSystemInfo, apiFail } from "@/utils/index";
import { setTimeout } from 'timers';
export default {
  components: {},
  data() {
    return {
      isGoLoginPage: false,
      windowHeight: '',
      showMsg:false,
      index:0,
      blessings:{},//要发送的祝福语
      blessingsList:[]
    };
  },
  onLoad(options) {
    
  },
  onShow() {
    if (!getLoginInfo() && !this.isGoLoginPage) {
      this.isGoLoginPage = true;
      const url = "/pages/login/main";
      wx.navigateTo({ url });
      return;
    }else{
      this.getAllMsg();
      this.hasGreetedToBQ();
    }
  },
  onReady() {
    let that = this;
    wx.getSystemInfo({
      success({windowHeight}) {
        that.windowHeight = windowHeight * 2 -60;
      }
    });
  },
  onShareAppMessage(params) {
    let loginInfo = getLoginInfo();
    let userid = loginInfo.userid;
    let nickname = loginInfo.nickname;
    this.goEnjoy = false;
    return {
      title: nickname+"向您拜年",
      path: `/pages/service/newYear/main`
    };
  },
  methods: {
    goActiveHome(){
      let userInfo = getLoginInfo();
      let url = path.greetBQ;
      let queryData = {
        "fromUserId": userInfo.userid,
        "toUserId":"BaiQianLeasing",
        "greetingsCode":this.blessings.greetingsCode,
        "greetingsValue":this.blessings.greetingsValue,
        "yearInfoType":"0",//0:文字;1:红包
        "sendType":"0"//(0:拜年;1:回复;2:打赏)
      };
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          if(data){
            console.log(data);
            wx.navigateTo({
              url: "/pages/service/newYear/main?bqzpGiveRedBag="+data
            });
          }
        })
        .catch(e => {
          apiFail(e);
        });
      return promise;
      
    },
    shadeFun(){
      this.showMsg = false;
    },
    showMsgFun(){
      this.showMsg=!this.showMsg;
    },
    //获取祝福语
    getAllMsg(){
      let userInfo = getLoginInfo();
      let url = path.findAll;
      let queryData = {
          };
      let promise = this.$fly.get(url, queryData);
      promise
        .then(data => {
          if(data){
            console.log("祝福语",data)
            data.forEach((v,i)=> {
              if(v.greetingsType=="1"){
                this.blessingsList.push(v);
              }
            });
            var blessingsListIndex =0 + Math.floor((Math.random()*this.blessingsList.length));//随机生成一条祝福语
            this.blessings = this.blessingsList[blessingsListIndex];
          }
        })
        .catch(e => {
          
        });
      return promise;
    },
    // 选择祝福语
    selectMsg(item){
      this.blessings = item;
      this.showMsg = false;
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
              title: "已向佰仟拜年过~",
              icon: "none"
            });
            setTimeout(function(){
              wx.navigateTo({
                url: "/pages/service/newYear/main"
              });
            },2000)
            return false;
          }else if(data == 2){
            wx.showToast({
              title: "红包已派完!",
              icon: "none"
            });
            setTimeout(function(){
              wx.navigateTo({
                url: "/pages/service/newYear/main"
              });
            },2000);
            return false;
          }
        })
        .catch(e => {
          apiFail(e);
        });
      return promises;
    }
  }
};
</script>

<style lang="scss" scoped>
  .main{
    width: 100%;
    min-height: 100%;
    background: #D22A2A;
    overflow: hidden;
    position: relative;
    .content{
      margin: 0.3rem;
      box-sizing: border-box;
      background: url('http://bqyx-qiniu.bqrzzl.com/newyear/bg.png') repeat-y top;
      background-size: 100% 7.5rem;
      border-radius: 0.06rem;
      padding-bottom: 2rem;
      .title-box{
        width: 100%;
        text-align: center;
        overflow: hidden;
        padding-top: 0.88rem;
        p{
          font-size: 0.38rem;
          color: #000;
          margin-bottom: 0.3rem;
          font-weight: bold;
        }
      }
      .textarea{
        width: 5.8rem;
        height: 1.7rem;
        background:rgba(210,42,42,1);
        border-radius:0.2rem;
        margin: 0 auto;
        margin-bottom: 0.7rem;
        padding: 0.25rem 0.2rem;
        box-sizing: border-box; 
      }
      .textarea p{
        font-size: 0.3rem;
        color: #FF6868;
      }
      .grouplist-btn{
        background: url('http://bqyx-qiniu.bqrzzl.com/newyear/btn3@2x.png') repeat-y top;
        background-size: 5.8rem 0.86rem;
        font-size: 0.3rem;
        color: #D22A2A;
        text-align: center;
        line-height: 0.86rem;
        font-weight: bold;
      }
      .isEdit{
        color:#FFB644;
      }
      .editBtn{
        display: block;
        font-size:0.28rem;
        font-weight:400;
        color:#fff;
        line-height:0.56rem;
        text-align: center;
      }
    }
    .flower{
      width: 3.78rem;
      height: 1.95rem;
      display: block;
      position: absolute;
      left: 0;
      top: 0;
    }
    .zs{
      width: 0.55rem;
      height: 100%;
      position: absolute;
      top: 3.5rem;
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
    // 祝福
    .blessings{
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      border-top-right-radius: 0.26rem;
      border-top-left-radius: 0.26rem;
      background:#fff;
      z-index: 100;
      max-height: 0;
      transition: max-height 0.1s ease-out;
      overflow-Y: auto;
      overflow: auto;
      ul{
        background:#CE2222;
        padding:0 0.3rem;
        box-sizing: border-box;
        li{
          border-bottom: 1px solid #FF5252;
          padding:0.3rem 0;
          p{
            text-align: center;
            font-size:0.28rem;
            font-weight:400;
          color:#FFB644;
            line-height:0.36rem;
          }
        }
      }
    }
    .blessingsShow{
      max-height: 4.8rem;
      transition: max-height 0.1s ease-in;
    }
    .shade{
      position: fixed;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
      z-index: 99;
    }
    .footer{
      .img{
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
      }
    }
  }
</style>
