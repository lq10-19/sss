<template>
  <div class="main">
    <img class="flower" src="http://bqyx-qiniu.bqrzzl.com/newyear/flower.png">
    <div class="zs-left zs"></div>
    <div class="zs-right zs"></div>
    <div class="content" :style="{'min-height': windowHeight+'rpx'}">
      
      <div class="friend">
        <p class="title">发起成功</p>
        <div class="friendList">
          <ul>
            <li v-for="(item,index) in renderData" :key="index" class="clearfix">
              <div class="friendName">
                <img :src="item.fromAvatarUrl" alt>
                <p>{{item.fromNickname}}</p>
              </div>
              <div class="msg" :class="{'alreadyRead':item.greetingsCode!='0'}">
                <p>{{item.greetingsValue?item.greetingsValue:"万般感谢不如红包给你"}}</p>
              </div>
            </li>
      
          </ul>
        </div>
      </div>

      <div class="warn">
        <p>注：您发起拜年后，会推送组团消息给您邀请的好友， 所有邀请的好友填写完祝福语后，系统会自动将拜年 祝福发送给拜年对象。</p>
      </div>
       <!-- 返回主页 -->
      <div @click="goMinPage" class="goMinPage">
        <p>去活动主页看看</p>
      </div>
    </div>
    <div class="footer">
      <img class="img" mode="widthFix" src="http://bqyx-qiniu.bqrzzl.com/newyear/footer-bg.png">
    </div>
  </div>
</template>
<script>
import { path, getLoginInfo, getSystemInfo } from "@/utils/index";
import { setTimeout } from "timers";
export default {
  components: {},
  data() {
    return {
      windowHeight: "",
      renderData:[]
    };
  },
  onLoad(options) {
    wx.setStorageSync("newYearIsSuccess","newYearIsSuccess");
    console.log("options",options)
    this.sendNewYearSuccess(options.groupMainId);
  },
  onShow() {
    
  },
  onReady() {
    let that = this;
    wx.getSystemInfo({
      success({ windowHeight }) {
        that.windowHeight = windowHeight * 2 - 60;
      }
    });
  },
  methods: {
    // 发送拜年信息
    sendNewYearSuccess(groupMainId){
      let userInfo = getLoginInfo();
      // let url = path.queryRecordByGroupMainId+"/"+groupMainId;
      let url = path.sendNewYearSuccess+"/"+groupMainId;
      let promise = this.$fly.get(url, {});
      promise
        .then(data => {
          if(data){
            console.log("拜年信息",data)
            data.forEach((v,i)=> {
              if(v.greetingsCode=="0"){
                v.greetingsValue="待回应...";
              }
            });
            // data.forEach((v,i)=> {
            //   if(v.greetingsCode!="0"){
            //    data.splice(i,1);
            //    data.unshift(v);
            //   }
            // });
            this.renderData =  data;
          }
        })
        .catch(e => {
          
        });
      return promise;
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
.clearfix:after {
  //清除浮动
  content: "";
  display: block;
  height: 0;
  line-height: 0;
  visibility: hidden;
  clear: both;
}
.main {
  width: 100%;
  min-height: 100%;
  background: #d22a2a;
  overflow: hidden;
  position: relative;
  .content {
    margin: 0.3rem;
    overflow: hidden;
    background: url("http://bqyx-qiniu.bqrzzl.com/newyear/bg.png") repeat-y top;
    background-size: 100% 7.5rem;
    border-radius: 0.06rem;
    padding-bottom: 2rem;
  }
  .flower {
    width: 3.78rem;
    height: 1.95rem;
    display: block;
    position: absolute;
    left: 0;
    top: 0;
  }
  .rule-text {
    padding: 0 0.3rem;
    font-size: 0.26rem;
    color: #000;
    margin-top: 1.77rem;
    line-height: 0.5rem;
    font-weight: bold;
  }
  .zs {
    width: 0.55rem;
    height: 100%;
    position: absolute;
    top: 3.5rem;
  }
  .zs-left {
    background: url("http://bqyx-qiniu.bqrzzl.com/newyear/zs-left.png") repeat-y
      top;
    background-size: 0.55rem 6.72rem;
    left: 0rem;
  }
  .zs-right {
    background: url("http://bqyx-qiniu.bqrzzl.com/newyear/zs-right.png")
      repeat-y top;
    background-size: 0.55rem 6.72rem;
    right: 0rem;
  }
  .footer {
    .img {
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
    }
  }
}

//邀请好友
.friend {
  margin: 0 auto;
  margin-top: 0.9rem;
  width: 5.8rem;
  .title {
    font-size: 0.49rem;
    font-weight: 700;
    color: rgba(0, 0, 0, 1);
    line-height: 1.2rem;
    text-align: center;
  }
  .friendList {
    width: 5.8rem;
    min-height: 2.41rem;
    background: rgba(210, 42, 42, 1);
    border-radius: 0.2rem;
    padding-top: 0.1rem;
    padding-bottom: 0.2rem;
    ul {
      li {
        margin: 0.2rem 0 0 0.3rem;
        > div {
          float: left;
        }
        .friendName {
          img {
            width: 0.88rem;
            height: 0.88rem;
            border-radius: 0.44rem;
            margin: 0 auto;
            display: block;
          }
          p {
            width: 1.07rem;
            height: 0.38rem;
            background: rgba(255, 182, 68, 1);
            border-radius: 0.19rem;
            line-height: 0.38rem;
            text-align: center;
            font-size: 0.24rem;
            color: #fff;
            margin-top: -0.19rem;
            text-overflow: ellipsis; 
            overflow:hidden;                     
            white-space: nowrap;
          }
        }
        .msg {
          width: 3.98rem;
          height: 0.85rem;
          background: rgba(255, 255, 255, 1);
          border-radius: 0.09rem;
          position: relative;
          margin: 0.1rem 0 0 0.2rem;
          p {
            font-size: 0.26rem;
            color: rgba(0, 0, 0, 1);
            line-height: 0.30rem;
            padding-left: 0.2rem;
            padding-top: 0.2rem;
          }
        }
        .alreadyRead {
          background: #f7d7c3;
        }
        .msg::before {
          content: "";
          display: block;
          width: 0.26rem;
          height: 0.26rem;
          position: absolute;
          top: 50%;
          left: -0.1rem;
          background: #fff;
          transform: translateY(-50%) rotate(-45deg);
        }
        .alreadyRead::before {
          content: "";
          display: block;
          width: 0.26rem;
          height: 0.26rem;
          position: absolute;
          top: 50%;
          left: -0.1rem;
          background: #f7d7c3;
          transform: translateY(-50%) rotate(-45deg);
        }
      }
      .addBut {
        img {
          margin-top: 0.1rem;
        }
      }
    }
  }
}
//说明
.warn {
  width: 6rem;
  margin: 0 auto;
  margin-top: 0.5rem;
  p {
    height: 0.96rem;
    font-size: 0.25rem;
    color: rgba(0, 0, 0, 1);
    line-height: 0.36rem;
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
</style>
