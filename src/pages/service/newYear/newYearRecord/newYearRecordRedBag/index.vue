<template>
  <div class="main">
    <img class="flower" src="http://bqyx-qiniu.bqrzzl.com/newyear/flower.png" />
    <div class="zs-left zs"></div>
    <div class="zs-right zs"></div>
    <div class="content" :style="{'min-height': windowHeight+'rpx'}">
      <!-- 邀请好友 -->
      <div class="topTitle"><p>已获得{{formRedBag.fromNickname}}的新年红包</p></div>
      <div class="moneyNumber">{{formRedBag.redPackage}}元</div>
      <div class="topTitle_sub"><p>已存入您的佰仟易行账户，满10元即可提现</p></div>
      <!-- 发起拜年 -->
      <div @click="sendNewYear" class="myButton">
        <p>给其他人拜年</p>
      </div>

      <!-- 祝福list表 -->
      <div class="friend">
        <div class="friendList">
          <ul>
            <li v-for="(item,index) in groupLsit" :key="index" :class="{'changeClass':item.sendType=='1'}" class="clearfix">
              <div class="friendName">
                <img :src="item.fromAvatarUrl" alt="">
                <p>{{item.fromNickname}}</p>
              </div>
              <div class="msg alreadyRead">
                <p>{{item.greetingsValue}}</p>
              </div>
            </li>
           
            <!-- <li class="clearfix changeClass">
              <div class="friendName ">
                <img src="http://bqyx-qiniu.bqrzzl.com//mp/logo@2x.png" alt="">
                <p>小明</p>
              </div>
              <div class="msg">
                <p>祝您猪年大吉，万事如意！</p>
              </div>
            </li> -->
          </ul>
        </div>
      </div>
          <!-- 返回主页 -->
      <div @click="goMinPage" class="goMinPage">
        <p>去活动主页看看</p>
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
      groupLsit:[],
      formRedBag:{}
    };
  },
  onLoad(options) {
    this.groupLsit=[];
    let systemInfo = getSystemInfo();
    this.windowHeight = systemInfo.windowHeight * 2 -60;
    this.getRecordDetail(options.groupMainId);
  },
  onShow() {
    if(!getLoginInfo() && !this.isGoLoginPage) {
      this.isGoLoginPage = true;
      const url = "/pages/login/main";
      wx.navigateTo({ url });
      return;
    }else{
      
    }
  },
  methods: {
    getRecordDetail(groupMainId){
      let loginInfo = getLoginInfo();
      let url = path.recordDetail+"/"+groupMainId;
      // let url = path.newYearRecord+"/fb8399eac56d4af0a7919502c3a36992";
      let queryData = {
       
      };
      let promise = this.$fly.get(url, queryData);
      promise
        .then(data => {
          if (data != null&&data.length>0) {
            this.isShow= true;
            var sendType2List = [];
            data.forEach((v,i)=> {
              if(v.sendType=="0"){
                this.groupLsit.push(v);
              }else if(v.sendType=="2"){
                sendType2List.push(v);
              }
            });
            console.log("aaa",sendType2List)
            sendType2List.forEach((v,i)=>{
               if(v.toUserId==loginInfo.userid){
                 this.formRedBag = v;
               }
            });
            this.toNickname = data[0].toNickname;
            console.log("祝福列表",this.groupLsit)
            console.log("formRedBag",this.formRedBag)
           
          } else {
            this.isShow= false;
          }
        })
        .catch(e => {
          // apiFail(e);
        });
      return promise;
    },

    sendNewYear(){//给其他人拜年
        wx.navigateTo({
            url: "/pages/service/newYear/groupList/main", 
            fail:(res)=>{
              wx.redirectTo({
                url: "/pages/service/newYear/groupList/main",
              });
            }
        });
    },
    goMinPage(){//去活动主页
      wx.navigateTo({
          url: "/pages/service/newYear/main",
          fail:(res)=>{
            wx.redirectTo({
              url: "/pages/service/newYear/main",
            });
          }
      });
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
      padding-bottom: 2rem;
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
  margin-top: 1.2rem;
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
.moneyNumber{
  font-size:0.6rem;
  font-family:PingFangSC-Medium;
  font-weight:700;
  color:rgba(210,42,42,1);
  line-height:0.9rem;
  text-align: center;
}
.topTitle_sub{
  font-size:0.26rem;
  font-weight:700;
  color:rgba(0,0,0,1);
  line-height:0.36rem;
  text-align: center;
  padding-top: 0.2rem;
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
.goMinPage{
  width:5.8rem;
  height:0.8rem;
  background:#f9c38a;
  box-shadow:0px 0.06rem 0px 0px #f3a967;
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

.friend{
  margin: 0 auto;
  margin-top: 0.3rem;
  width: 5.8rem;
  .title{
    font-size:0.49rem;
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
    padding-top: 0.1rem;
    padding-bottom: 1rem;
    ul{
      li{
        margin: 0.2rem 0 0 0.3rem;
        >div{
          float: left;
        }
        .friendName{
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
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;

          }
        }
        .msg{
            width:3.98rem;
            height:0.85rem;
            background:rgba(255,255,255,1);
            border-radius:0.09rem;
            position: relative;
            margin: 0.1rem 0 0 0.2rem;
            p{
              padding-top: 0.2rem;
              font-size:0.26rem;
              color:rgba(0,0,0,1);
              line-height:0.3rem;
              padding-left: 0.2rem;
            }
        }
        .alreadyRead{
          background: #F7D7C3;
        }
        .msg::before {
            content: "";
            display:block;
            width: 0.26rem;
            height:0.26rem;
            position: absolute;
            top: 50%;
            left: -0.1rem;
            background:#FFF;
            transform: translateY(-50%) rotate(-45deg);
        }
        .alreadyRead::before {
            content: "";
            display:block;
            width: 0.26rem;
            height:0.26rem;
            position: absolute;
            top: 50%;
            left: -0.1rem;
            background:#F7D7C3;
            transform: translateY(-50%) rotate(-45deg);

        }
      }
      .changeClass{
        .friendName{
          float: right;
        }
        .msg{
          float: right;
        }
      }
      .changeClass {
        margin: 0.2rem 0.3rem 0 0;
        .msg{
           background:#7BC93E;
           margin-right: 0.2rem;
        }
        .msg::before {
            content: "";
            display:block;
            width: 0.26rem;
            height:0.26rem;
            position: absolute;
            top: 50%;
            left: 3.8rem;
            background:#7BC93E;
            transform: translateY(-50%) rotate(-45deg);

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
</style>
