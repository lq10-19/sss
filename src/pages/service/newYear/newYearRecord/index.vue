<template>
  <div class="main">
    <img class="flower" src="http://bqyx-qiniu.bqrzzl.com/newyear/flower.png" />
    <div class="zs-left zs"></div>
    <div class="zs-right zs"></div>
    <div class="content" :style="{'min-height': windowHeight+'rpx'}">
      <div v-show="!isShow" class="topTitle">
        <p>当前还没有拜年记录哦，<br>赶紧去组团拜年吧！</p>
      </div>
      <!-- list -->
      <div v-show="isShow" class="dataList">
        <ul>
          <li @click="goNewYearRecordGroup(item.groupMainId,item.status)" v-for="(item,index) in gourpList" :key="index">
            <div class="leftBox">
              <p v-if="item.createByMyself==1"><span>我邀请了</span><span>我发起的</span></p>
              <p v-else-if="item.createByMyself==0&&item.greetToMe==0"><span><div class="creatorNickname">{{item.creatorNickname}}</div><div>邀请了你</div></span><span class="yellowBackgound">我参与的</span></p>
              <p v-else-if="item.greetToMe==1"><span>我收到了</span><span class="blueBackground">我收到的</span></p>
              <!-- greetToMe=1表示当前用户是被拜年对像 -->
              <p v-if="item.createByMyself==1&&item.greetToMe==0"><span>{{item.memberCount}}人一起给<div class="toNickname">{{item.toNickname}}</div>拜年</span></p>
              <p v-else-if="item.createByMyself==0&&item.greetToMe==0"><span>一起给<div class="toNickname">{{item.toNickname}}</div>拜年</span></p>
              <p v-else-if="item.greetToMe==1"><span><div class="toNickname">{{item.creatorNickname}}</div>组团的拜年祝福</span></p>
            </div>
            <div class="rightBox">
              <p v-if="item.status==1">待发送祝福</p>
              <p v-else-if="item.status==2">已发送祝福</p>
              <p v-else-if="item.status==3">已收到打赏</p>
              <p v-else-if="item.status==4">已收到答谢</p>
              <p v-else-if="item.status==5">未答谢</p>
              <p v-else-if="item.status==6||item.status==7">已答谢</p>
              <p>{{item.createTime}}</p>
            </div>
          </li>
        </ul>
      </div>
        <!-- 发起拜年 -->
      <div v-show="!isShow" @click="goGroupList" class="myButton">
        <p>去组团拜年</p>
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
      isShow:false,
      gourpList:[]
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
  onShow() {
    this.getNewYearRecord();
  },
  methods: {
     getNewYearRecord(){
      wx.showLoading({
        title: '正在查询',
        mask: true,
        icon: 'loading'
      })
      let loginInfo = getLoginInfo();
      console.log(loginInfo)
      // let url = path.newYearRecord+"/userId="+loginInfo.appUserId;
      let url = path.newYearRecord+"/"+loginInfo.userid;
      let queryData = {
       
      };
      let promise = this.$fly.get(url, queryData);
      promise
        .then(data => {
          console.log("拜年记录",data)
          wx.hideLoading();
          if (data != null&&data.length>0) {
            // data[0].status = 2;//未答谢
            // data[0].greetToMe = 1;
            // data[3].status = 3;//3 红包或 4 文字已答谢  2未答谢
            // data[3].greetToMe = 1;

            data.forEach((v,i)=>{//按时间排序
              if(v.greetToMe==1){//自定义拜年对像状态
                if(v.status==2){
                  v.status = 5;//自定义未答谢
                }else if(v.status==3){
                  v.status = 6;//自定义已答谢红包
                }else if(v.status==4){
                  v.status = 7;//自定义已答谢文字
                }
              }
              v.timeIndex = v.createTime;
              v.timeIndex = v.timeIndex.replace(/-/g,"");
              v.timeIndex = v.timeIndex.replace(/:/g,"");
              v.timeIndex = v.timeIndex.replace(/\s/g,"");
              if(v.timeIndex.length=="13"){
                  v.timeIndex = v.timeIndex.substring(0,8) + "0" + v.timeIndex.substring(8,13);
              };
            });
            function sortTime(a,b){  
              return b.timeIndex-a.timeIndex;
            }
            data.sort(sortTime);
            this.isShow= true;
            this.gourpList = data;

            
            
          } else {
            this.isShow= false;
          }
          
        })
        .catch(e => {
          wx.hideLoading();
          wx.showToast({
            title: "系统异常，请稍后再试",
            icon: "none"
          });
          apiFail(e);
        });
      return promise;
    },
    goGroupList(){
      wx.navigateTo({
        url: "/pages/service/newYear/groupList/main",
        fail:()=>{
          wx.redirectTo({
            url: "/pages/service/newYear/groupList/main",
          });
        }
      });
    },
    goNewYearRecordGroup(groupMainId,status){
      if(status=="5"||status=="6"||status=="7"){
        wx.navigateTo({
          url: "/pages/service/newYear/newYearRecord/newYearRecordObj/main?groupMainId="+groupMainId+"&status="+status,
          fail:(res)=>{
            wx.redirectTo({
              url: "/pages/service/newYear/newYearRecord/newYearRecordObj/main?groupMainId="+groupMainId+"&status="+status
            });
          }
        });
        return;
      };
      if(status=="3"){
        wx.navigateTo({
          url: "/pages/service/newYear/newYearRecord/newYearRecordRedBag/main?groupMainId="+groupMainId+"&status="+status,
          fail:(res)=>{
            wx.redirectTo({
              url: "/pages/service/newYear/newYearRecord/newYearRecordRedBag/main?groupMainId="+groupMainId+"&status="+status
            });
          }
        });
      }else{
        wx.navigateTo({
          url: "/pages/service/newYear/newYearRecord/newYearRecordGroup/main?groupMainId="+groupMainId+"&status="+status,
          fail:(res)=>{
          wx.redirectTo({
            url: "/pages/service/newYear/newYearRecord/newYearRecordGroup/main?groupMainId="+groupMainId+"&status="+status
          });
          }
        });
      }
      
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
      padding-bottom:1rem;

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
//内容区
.topTitle{
  font-size:0.38rem;
  font-weight:700;
  color:rgba(0,0,0,1);
  line-height: 0.6rem;
  text-align: center;
  margin-top: 1rem;
}
//list 
.dataList{
  width: 6.11rem;
  height: 100%;
  margin: 0 auto;
  padding-top: 1.8rem;
  ul{
    li{
      width: 6.11rem;
      height: 1.57rem;
      margin-bottom: 0.32rem;
      padding-left: 0.2rem;
      padding-right: 0.2rem;
      box-sizing: border-box;
      background:url("http://bqyx-qiniu.bqrzzl.com/newyear/group-list-bg.png") no-repeat center/100%;
      >div{
        float: left;
      }
      .leftBox{
        width: 57%;
        overflow: hidden;
        p{
          color: #D22A2A;
          font-weight: 700;
          padding-top: 0.08rem;
          span{
            display: inline-block;
          }
          span:nth-of-type(1){
            height: 0.42rem;
            line-height: 0.42rem;
            font-size: 0.30rem;
          }
          span:nth-of-type(2){
            color: #fff;
            background: #7DB85C;
            height: 0.42rem;
            line-height: 0.42rem;
            font-size: 0.22rem;
            padding: 0 0.1rem;
            border-radius: 0.08rem;
            margin-left: 0.14rem;
          }
          .yellowBackgound{
            background:#F4C33E !important;
          }
          .blueBackground{
            background:#32ACF3 !important;
          }
          div{
            display: inline-block;
            height: 0.42rem;
            line-height: 0.42rem;
            font-size: 0.30rem;
            vertical-align: top;
          }
          .creatorNickname{
            display: inline-block;
            height: 0.42rem;
            line-height: 0.42rem;
            font-size: 0.30rem;
            max-width: 0.8rem;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space:nowrap;
          }
          .toNickname{
            display: inline-block;
            height:0.42rem;
            line-height:0.42rem;
            font-size:0.3rem;
            max-width: 1.06rem;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space:nowrap;
          }
        }
        p:nth-of-type(1){
          padding-top: 0.15rem;
        }
        p:nth-of-type(2){
        }
      }
      .rightBox{
        float: right !important;
        margin-top: 0.05rem;
        p:nth-of-type(1){
          width:1.72rem;
          height:0.49rem;
          background:rgba(210,42,42,1);
          border-radius:0.24rem;
          font-size:0.26rem;
          font-weight:700;
          color:rgba(255,182,68,1);
          line-height:0.49rem;
          margin-top: 0.2rem;
          text-align: center;
          float: right;
        }
        p:nth-of-type(2){
          font-size:0.24rem;
          font-weight:400;
          color:rgba(210,42,42,1);
          line-height:0.7rem;
         
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

</style>
