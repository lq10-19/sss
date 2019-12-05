<template>
  <div class="main">
    <img class="flower" src="http://bqyx-qiniu.bqrzzl.com/newyear/flower.png" />
    <div class="zs-left zs"></div>
    <div class="zs-right zs"></div>
    <div class="content" :style="{'min-height': windowHeight+'rpx'}">
      <!-- 邀请好友 -->
      <div class="topTitle"><p>{{grouperNickName}}邀请您一起给 <span>{{renderData.toNickname}}</span> 拜年</p></div>
      <div class="friend">
        <div class="friendList">
          <ul class="clearfix">
            <li>
              <img :src="grouperAvatarUrl" alt="">
              <p>发起者</p>
              <p>{{grouperNickName}}</p>
            </li>
          </ul>
        </div>
        <div @click="showMsgFun" class="msgBox">
          <p :class="{'isEdit':isEdit}">{{blessings.greetingsValue}}</p>
          <span v-if="!isEdit" class="editBtn">点击编辑</span>
        </div>
      </div>
      <!-- 发起拜年 -->
      <div @click="sendData"  class="myButton">
        <p>确定发送祝福</p>
      </div>
      <!-- 说明 -->
      <div class="warn">
        <p>
            注：您发送祝福后，祝福消息会在全体团员祝福集齐后一起发送给拜年对象。
        </p>
      </div>
      <!-- 祝福语 -->
      <div @click="shadeFun" v-show="showMsg" class="shade"></div>
      <div ref="blessings2"  class="blessings" :class="{'blessingsShow':showMsg}">
        <ul>
          <li @click="selectMsg(item)" v-for="(item,index) in blessingsList" :key="index"><p>{{item.greetingsValue}}</p></li>
        </ul>
      </div>
    </div>
    <!-- 弹窗 -->
    <div class="pop-wrap" v-if="popShow == true">
      <div class="pop-box">
        <p class="msg dmsg">加入成功！</p>
        <div class="bbtn" @click="closePop">确定</div>
      </div>
    </div>
    <div class="footer">
      <image class="img" mode="widthFix" src="http://bqyx-qiniu.bqrzzl.com/newyear/footer-bg.png"></image>
    </div>
  </div>
</template>
<script>
import { path, getLoginInfo, getSystemInfo,apiFail } from "@/utils/index";
import { setTimeout } from 'timers';
export default {
  components: {},
  data() {
    return {
      windowHeight: '',
      showMsg:false,
      renderData:{},
      popShow:false,
      blessings:{},//要发送的祝福语
      blessingsList:[],
      grouperNickName:"",//群主昵称
      grouperAvatarUrl:"",//群主微信头像
      isEdit:false, //是否选择编辑祝福语
      groupMainId:""
    };
  },
  onLoad(options) {
    console.log("传的值",options.groupMainId);
    this.groupMainId = options.groupMainId;
  },
  onReady() {
    let that = this;
    wx.getSystemInfo({
      success({windowHeight}) {
        that.windowHeight = windowHeight * 2 -60;
      }
    });
    this.getAllMsg();
  },
  onShow() {
    if(!getLoginInfo() && !this.isGoLoginPage) {
      this.isGoLoginPage = true;
      const url = "/pages/login/main";
      wx.navigateTo({ url });
      return;
    }else{
      this.hasSendToGroup(this.groupMainId);
      let systemInfo = getSystemInfo();
      this.sendNewYearSuccess(this.groupMainId);
    }
  },
  methods: {
    //是否已回应过
    hasSendToGroup(groupMainId){
      let userInfo = getLoginInfo();
      let url = path.hasSendToGroup+"/"+groupMainId+"/"+userInfo.userid;
      let promise = this.$fly.get(url, {});
      promise
        .then(data => {
          console.log("是否已回应过",data)
          if(data==1){//1 已回复 0 未回复
             wx.navigateTo({
              url: "/pages/service/newYear/newYearRecord/newYearRecordGroup/main?groupMainId="+groupMainId+"&status=2",
              fail:(res)=>{
                wx.redirectTo({
                  url: "/pages/service/newYear/newYearRecord/newYearRecordGroup/main?groupMainId="+groupMainId+"&status=2"
                });
              }
            });
          }
        })           
        .catch(e => {
          apiFail(e);
        });
      return promise;
    },
    shadeFun(){
      this.showMsg=false;
    },
    showMsgFun(){
      this.showMsg=!this.showMsg;
      this.isEdit = true;
    },
    // 获取用户信息
    sendNewYearSuccess(groupMainId){
      console.log("调用了")
      let userInfo = getLoginInfo();
      let url = path.sendNewYearSuccess+"/"+groupMainId;
      let promise = this.$fly.get(url, {});
      promise
        .then(data => {
          console.log("aa",data)
          if(data){
            var flag = true;
            data.forEach((v,i)=>{
              if(v.toUserId){
                if(flag){
                  this.renderData = v;
                  flag = false;
                }
              };
              if(v.grouperNickName){
                this.grouperNickName = v.grouperNickName;
                this.grouperAvatarUrl = v.grouperAvatarUrl;
              }
            })
            console.log("拜年信息", this.renderData)
          }
        })
        .catch(e => {
          apiFail(e);
        });
      return promise;
    },
    //点击发起拜年
    sendData(){
      wx.showLoading({
        title: '正在提交',
        mask: true,
        icon: 'loading'
      })
      this.sendNewYearInfo(this.renderData.groupMainId);
    },
     // 发送拜年信息
    sendNewYearInfo(groupMainId){
      let userInfo = getLoginInfo();
      let url = path.sendNewYearInfo;
      let queryData = {
            "groupMainId":this.renderData.groupMainId,
            "fromUserId":userInfo.userid,
            "toUserId":this.renderData.toUserId,
            "greetingsCode":this.blessings.greetingsCode,
            "greetingsValue":this.blessings.greetingsValue,
            "yearInfoType":"0",//0:文字;1:红包
            "sendType":"0"//(0:拜年;1:回复;2:打赏),
          };
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          if(data){
            wx.hideLoading();
            console.log("发送拜年信息",data)
            this.popShow = true;
          }
        })
        .catch(e => {
          wx.hideLoading();
          wx.showToast({
            title: e.data.message,
            icon: "none"
          });
        });
      return promise;
    },
    closePop(){
      this.popShow = false;
        wx.reLaunch({
            url: "/pages/service/newYear/launchSuccess/main?groupMainId="+this.renderData.groupMainId, 
            fail:(res)=>{
              wx.redirectTo({
                url: "/pages/service/newYear/launchSuccess/main?groupMainId="+this.renderData.groupMainId,
              });
            }
        });
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
      overflow: hidden;
      background: url('http://bqyx-qiniu.bqrzzl.com/newyear/bg.png') repeat-y top;
      background-size: 100% 7.5rem;
      border-radius: 0.06rem;
    }
    .flower{
      width: 3.78rem;
      height: 1.95rem;
      display: block;
      position: absolute;
      left: 0;
      top: 0;
    }
    .rule-text{
      padding: 0 0.3rem;
      font-size: 0.26rem;
      color: #000;
      margin-top: 1.77rem;
      line-height: 0.5rem;
      font-weight: bold;
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
    .footer{
      .img{
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
      }
    }
  }
//标题 
.topTitle{
  margin: 0 auto;
  margin-top: 0.6rem;
  width: 5rem;
  p{
   font-size:0.38rem;
    font-weight:700;
    color:rgba(0,0,0,1);
    line-height:0.6rem;
    text-align: center;
  }
  span{
    color:#D22A2A;
  }
}
//邀请好友
.friend{
  margin: 0 auto;
  width: 5.8rem;
  min-height: 3.47rem;
  margin-top: 0.9rem;
  background:rgba(210,42,42,1);
  border-radius:0.2rem;
  position: relative;
  .friendList{
    width:1.2rem;
    height: 1.2rem;
    position: absolute;
    top: -0.5rem;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(210,42,42,1);
    border-radius: 50%;
    ul{
      li{
        width: 1.07rem;
        float: left;
        margin: 0.2rem 0 0 0.09rem;
        img{
          width: 0.88rem;
          height: 0.88rem;
          border-radius: 0.44rem;
          margin: 0 auto;
          display: block;
        }
        p:nth-of-type(1){
          width:1.07rem;
          height:0.38rem;
          background:rgba(255,182,68,1);
          border-radius:0.19rem;
          line-height: 0.38rem;
          text-align: center;
          font-size:0.24rem;
          color: #fff;
          margin-top: -0.19rem;
        }
        p:nth-of-type(2){
          color: #000;
          font-size: 0.25rem;
          font-weight: 700;
          text-align: center;
          line-height: 0.5rem;;
          width:5rem;
          margin-left: -2rem;
        }
      }
      .addBut{
        img{
          margin-top: 0.1rem;
        }
      }
    }
  }
  .msgBox{
    position: absolute;
    top: 50%;
    left: 0.3rem;
    transform: translateY(-50%);
    p{
      font-size:0.3rem;
      font-weight:400;
      color:#FF6868;
      line-height:0.36rem
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
}
.myButton{
  width:5.8rem;
  height:0.8rem;
  background:rgba(255,182,68,1);
  box-shadow:0px 0.06rem 0px 0px rgba(245,131,30,1);
  border-radius:0.38rem;
  margin: 0 auto;
  margin-top: 0.69rem;
  p{
    font-size:0.3rem;
    font-weight:700;
    color:rgba(210,42,42,1);
    line-height:0.8rem; 
    text-align: center;
  }
}
//说明
.warn{
  width: 6rem;
  margin: 0 auto;
  margin-top: 0.5rem;
  p{
    height:0.96rem;
    font-size:0.25rem;
    color:rgba(0,0,0,1);
    line-height:0.36rem;
  }
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
  max-height: 5.91rem;
  box-shadow:0px 0.03rem 1.22rem 0px rgba(0, 0, 0, 0.66);
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

// 确定
  .confirmBox{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0; 
    z-index: 200;
    background: rgba(0,0,0,0.7);
    .confirm{
      width: 4.74rem;
      height: 5.4rem;
      background:url("http://bqyx-qiniu.bqrzzl.com/newyear/pop-bg.png") no-repeat center/100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      .text{
        font-size:0.36rem;
        font-weight:700;
        color:rgba(253,194,84,1);
        position: absolute;
        top: 55%;
        left: 0;
        transform: translateY(-50%);
        text-align: center;
        width: 100%;
      }
      .confirmBtn{
        width: 3.2rem;
        height: 0.74rem;
        background:rgba(255,182,68,1);
        box-shadow:0px 0.06rem 0px 0px rgba(245,131,30,1);
        position: absolute;
        bottom: 0.79rem;
        left: 50%;
        transform: translateX(-50%);
        font-size:0.3rem;
        font-weight:500;
        color:rgba(210,42,42,1);
        line-height:0.74rem;  
        text-align: center;
        border-radius: 0.37rem; 
      }
    }
  }
  // 弹窗
  .pop-wrap{
      width: 100%;
      height: 100%;
      position: fixed;
      left: 0;
      top: 0;
      background: rgba(0,0,0,0.7);
      z-index: 999;
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
      .msg{
        color: #FDC254;
        font-size: 0.36rem;
        width: 100%;
        text-align: center;
        font-weight: bold;
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
        bottom: 0.73rem;
        left: 50%;
        -webkit-transform: translateX(-50%);
      }
    }
</style>
