<template>
  <div class="main">
    <img class="flower" src="http://bqyx-qiniu.bqrzzl.com/newyear/flower.png" />
    <div class="zs-left zs"></div>
    <div class="zs-right zs"></div>
    <div class="content" :style="{'min-height': windowHeight+'rpx'}">
      <!-- 组团给XX拜年 -->
      <div class="newYearObj">
        <p class="title">给&nbsp;<span>{{passData.userNickName}}</span>&nbsp;拜年</p>
        <div @click="showMsgFun" class="newYearMsg">
          <p :class="{'isEdit':isEdit}">{{blessings.greetingsValue}}</p>
          <span v-if="!isEdit" class="editBtn">点击编辑</span>
        </div>
      </div>
      <!-- 邀请好友 -->
      <div class="friend">
        <p class="title">邀请好友一起拜年</p>
        <div class="friendList">
          <ul class="clearfix">
            <li v-for="(item,index) in renderData" :key="index">
              <img :src="item.wechatHeadImgUrl?item.wechatHeadImgUrl:'/static/img/sign/user.png'" alt="">
              <p>{{item.userNickName}}</p>
            </li>
            <li class="addBut" @click="goGroupList">
              <img src="http://bqyx-qiniu.bqrzzl.com/newyear/add.png" alt="">
            </li>
          </ul>
        </div>
      </div>
      <!-- 发起拜年 -->
      <div class="myButton" @click="goBn">
        <p>发起拜年</p>
      </div>

      <!-- 说明 -->
      <div class="warn">
        <p>
          注：您发起拜年后，会推送组团消息给您邀请的好友， 所有邀请的好友填写完祝福语后，系统会自动将拜年祝 福发送给拜年对象。
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
    <div class="footer">
      <image class="img" mode="widthFix" src="http://bqyx-qiniu.bqrzzl.com/newyear/footer-bg.png"></image>
    </div>
  </div>
</template>
<script>
import { path, getLoginInfo, getSystemInfo } from "@/utils/index";
import { setTimeout } from 'timers';
export default {
  components: {},
  data() {
    return {
      windowHeight: '',
      showMsg:false,
      index:0,
      blessings:{},//要发送的祝福语
      blessingsList:[],
      passData:{},//传过来的数据
      renderData:[], //添加的小伙伴
      isEdit:false //是否选择编辑祝福语
    };
  },
  onLoad(options) {
    this.passData = options;
    console.log("options",options)
    console.log("passData",this.passData)
    let systemInfo = getSystemInfo();
    console.log(systemInfo);
    
    var query = wx.createSelectorQuery();
    //选择id
    var that = this;
    query.select('.blessings').boundingClientRect(function (rect) {
      console.log(rect.height)
      // that.setData({
      //   height: rect.width + 'px'
      // })
    }).exec();

    if(wx.getStorageSync("passData")){
       this.passData = wx.getStorageSync("passData");
       console.log("保存的值",this.passData)
    }else{
      wx.setStorageSync("passData",options);
      this.passData = options;
      this.getAllMsg();
      console.log("设置的值",this.passData)
    };

  
  },
  onReady() {
    let that = this;
    wx.getSystemInfo({
      success({windowHeight}) {
        that.windowHeight = windowHeight * 2 -60;
      }
    });
  },
  onShow(options) {
    if(wx.getStorageSync("newYearIsSuccess")){
      wx.removeStorageSync("newYearIsSuccess");
      wx.redirectTo({
        url: "/pages/service/newYear/main",
      });
      return;
    };
    this.getSelectedData();
  },
  mounted() {
    
  },
  methods: {
    shadeFun(){
      this.showMsg = false;
    },
    showMsgFun(){
      this.showMsg=!this.showMsg;
      this.isEdit = true;
    },
    bindPickerChange(){

    },
    goGroupList(){
      console.log("点加了")
    	wx.navigateTo({
          // url: "/pages/service/newYear/secondGroupList/main?groupMainId="+this.passData.groupMainId,
          url: "/pages/service/newYear/groupUsers2/main?groupMainId="+this.passData.groupMainId,
          fail:(res)=>{
            wx.redirectTo({
               url: "/pages/service/newYear/groupUsers2/main?groupMainId="+this.passData.groupMainId,
            });
          }
      });
    },
    goBn(){
      wx.showLoading({
        title: '正在提交',
        mask: true,
        icon: 'loading'
      })
      this.creatGroup();//创键一个团
     
    
   
    	
    },
    getSelectedData(){
      console.log("加载了")
      var listData =[];
      if(wx.getStorageSync("allSelectedData")){
        this.renderData = wx.getStorageSync("allSelectedData");
      }else{
        this.renderData =[];
      };
    },
    //创建一个团
    creatGroup(){
      console.log("this.passData",this.passData)
      let userInfo = getLoginInfo();
      let url = path.saveGroupMain;
      // let url = "https://bqyx.bqzulin.com/bqyx/activity/groupMain/saveGroupMain";
      //var random =1 + Math.floor((Math.random()*9999));
      let queryData = {
        "groupCreateId":userInfo.userid,
        "groupName":this.passData.groupName,
        // "groupName":"乱组名2233662",
        "groupParentId":this.passData.groupMainId,
        // "groupParentId":"008c78c691f14ab18ffa7637652dbae9",
        "groupStatus":"1",//组织状态(0:作废;1:启用) ,
        "groupType":"2"//类型(1:普通组团;2:拜年组团)
      };
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          console.log("data",data)
          if(data){
           this.addGroupInfo(data.groupMainId);
          }
        })
        .catch(e => {
          wx.hideLoading();
          wx.showToast({
            title: "系统异常，请稍后再试",
            icon: "none"
          });
        });
      return promise;
    },
    // 添加团员数据
    addGroupInfo(groupMainId){
      let userInfo = getLoginInfo();
      console.log("userInfo",userInfo)
      var addInfoList =[
        {//创建者也要加入
          "groupMainId": groupMainId,
          "userId": userInfo.userid,   
          "userStatus": "1",// 0 未同意 1 同意加入
          "userType": "1", //0 群员  1群主
          "toUserNickName":this.passData.userNickName
        }
      ];
      this.renderData.forEach((v,i)=> {
        var obj = {
          "groupMainId": groupMainId,
          "userId": v.userId,   
          "userStatus": "1",// 0 未同意 1 同意加入
          "userType": "0", //0 群员  1群主
          "toUserNickName":this.passData.userNickName
        }
        addInfoList.push(obj);
      });
      
      let url = path.saveGroupUserInfo;
      // let url = "https://bqyx.bqzulin.com/bqyx/activity/groupUserInfo/saveGroupUserInfo";
      let queryData = addInfoList;
      console.log("queryData",queryData)
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          console.log("添加组员信息",data)
          this.sendNewYearInfo(groupMainId);
        })
        .catch(e => {
          console.log("eee",e)
          wx.hideLoading();
          wx.showToast({
            title: e.data.message,
            icon: "none"
          });
        });
      return promise;
    },
    // 发送拜年信息
    sendNewYearInfo(groupMainId){
      let userInfo = getLoginInfo();
      let url = path.sendNewYearInfo;
      let queryData = {
            "groupMainId":groupMainId,
            "fromUserId":userInfo.userid,
            "toUserId":this.passData.userId,
            "greetingsCode":this.blessings.greetingsCode,
            "greetingsValue":this.blessings.greetingsValue,
            "yearInfoType":"0",//0:文字;1:红包
            "sendType":"0"//(0:拜年;1:回复;2:打赏) ,
          };
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          if(data){
            console.log("发送拜年信息",data)
            wx.hideLoading();
            wx.removeStorageSync("passData");
            wx.removeStorageSync("allSelectedData");
            wx.reLaunch({
                url: "/pages/service/newYear/launchSuccess/main?groupMainId="+groupMainId, 
                fail:(res)=>{
                  wx.redirectTo({
                    url: "/pages/service/newYear/launchSuccess/main?groupMainId="+groupMainId,
                  });
                }
            });
          }
        })
        .catch(e => {
          wx.hideLoading();
          wx.showToast({
            title: "系统异常，请稍后再试",
            icon: "none"
          });
        });
      return promise;
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
 .clearfix:after{//清除浮动
    content:"";
    display:block;
    height:0;
    line-height:0;
    visibility:hidden;
    clear:both;
  }
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
      padding-bottom: 1rem;
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
//私有样式
  //组团给XX拜年
  .newYearObj{
    width: 5.8rem;
    margin: 0 auto;
    margin-top: 0.6rem;
    .title{
      font-size:0.38rem;
      font-weight:700;
      color:rgba(0,0,0,1);
      line-height:1.2rem;
      text-align: center;
      span{
        color: #D22A2A;
      }
    }
    .newYearMsg{
      width:5.8rem;
      height:1.7rem;
      background:rgba(210,42,42,1);
      border-radius:0.2rem;
      box-sizing: border-box;
      padding: 0.1rem 0 0 0.2rem;
     
      p{
        font-size:0.3rem;
        font-family:PingFangSC-Regular;
        color:#FF6868;
        line-height:0.36rem;
        margin-top: 0.1rem;
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
//邀请好友
.friend{
  margin: 0 auto;
  width: 5.8rem;
  .title{
    font-size:0.38rem;
    font-weight:700;
    color:rgba(0,0,0,1);
    line-height:1.2rem;
    text-align: center;
  }
  .friendList{
    width:5.8rem;
    min-height:2.41rem;
    background:rgba(210,42,42,1);
    border-radius:0.2rem;
    padding-bottom: 0.2rem;
    ul{
      li{
        width: 1.07rem;
        float: left;
        margin: 0.2rem 0 0 0.3rem;
        img{
          width: 0.88rem;
          height: 0.88rem;
          border-radius: 0.44rem;
          margin: 0 auto;
          display: block;
        }
        p{
          width:1.07rem;
          height:0.38rem;
          background:rgba(255,182,68,1);
          border-radius:0.19rem;
          line-height: 0.38rem;
          text-align: center;
          font-size:0.24rem;
          color: #fff;
          margin-top: -0.19rem;
          overflow:hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .addBut{
        img{
          margin-top: 0.1rem;
        }
      }
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


</style>
