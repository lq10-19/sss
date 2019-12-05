<template>
  <div class="bigbox">
    <!--头部-->
    <div class="header">
      <h1>我的V币余额
        <!-- <span @click="goMyVb">查看明细</span> -->
      </h1>
      <h2>{{vbNum}}</h2>
    </div>
    <!-- 签到 -->
    <div class="module-wrap">
      <p class="title">明天签到可获{{tomorrow}}V币</p>
      <ul>
        <li v-for="(item,i) in week" :key="i">
          <!-- 未签到 -->
          <div v-if="item.signed == 0">
            <img src="../../../../static/img/money_small@2x.png">
            <span>+{{item.vcoinAmount}}</span>
          </div>
          <!-- 已签到 -->
          <div class="sign" v-if="item.signed == 1">
            <h3>已领</h3>
            <span>+{{item.vcoinAmount}}</span>
          </div>
          <p class="days">{{item.dayOfPeriod}}天</p>
        </li>
      </ul>
    </div>
    <!-- 日常任务 -->
    <div class="module-other">
      <h1>日常任务</h1>
      <ul>
        <li v-for="(item,i) in taskList" :key="i">
          <div>
            <p>{{item.taskName}}</p>
            <p>
              <img src="../../../../static/img/money_small@2x.png">
              <span>+{{item.vcoinAmount}}V币</span>
            </p>
          </div>
          <!-- <button @click="share(item.taskId)" v-if="item.taskCode == 'D001'">{{item.completeStatus == 1?"已完成":"去分享"}}</button> -->
          <button @click="goDownload(item.taskId)" v-if="item.taskCode == 'D001'">{{item.completeStatus == 1?"已完成":"去下载"}}</button>
          <button @click="invitation(item.taskId)" v-if="item.taskCode == 'D002'">{{item.completeStatus == 1?"已完成":"去邀请"}}</button>
          <button @click="goHelp(item.taskId)" v-if="item.taskCode == 'D003'">{{item.completeStatus == 1?"已完成":"去查看"}}</button>
          <button @click="goSuggest(item.taskId)" v-if="item.taskCode == 'D004'">{{item.completeStatus == 1?"已完成":"去反馈"}}</button>
          <button @click="goDjcx(item.taskId)" v-if="item.taskCode == 'D005'">{{item.completeStatus == 1?"已完成":"去留资"}}</button>
        </li>
      </ul>
    </div>
    <!-- 选择微信好友、朋友圈 -->
    <!-- <div class="share" v-if="choose" catchtouchmove="ture">
      <div class="box">
        <div class='maskLayer'>
          请选择分享平台
        </div>
        <view class='choose'>
          <button plain open-type='share' class="friend">
            <img src="/static/redBag/weixin@2x.png">
            <p>微信好友</p>
          </button>
          <button plain class="friends" @click="showImg()">
            <img src="/static/redBag/pengyouquan@2x.png">
            <p>朋友圈</p>
          </button>
        </view>
        <button @click="cancelShare" class="cancel">取消分享</button>
      </div>  
    </div> -->
    <!-- 成功签到弹窗 -->
    <div v-if="signFail" class="mark" :style="{height:height+'px',width:width+'px'}" catchtouchmove="ture">
      <div class="boxs">
        <img src="http://bqyx-qiniu.bqrzzl.com/VB@2x.png">
        <h1>恭喜您签到成功</h1>
        <h1>{{today}}V币已入袋</h1>
        <button @click="closeMark">确定</button>
      </div>
    </div>
    <!-- 完成任务弹窗 -->
    <div v-if="finish" class="mark" :style="{height:height+'px',width:width+'px'}" catchtouchmove="ture">
      <div class="boxs">
        <img src="http://bqyx-qiniu.bqrzzl.com/VB@2x.png">
        <h1>恭喜您完成{{task}}任务,</h1>
        <h1>{{taskVbNum}}V币已入袋</h1>
        <button @click="closeFinish">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
import utils from "@/utils/index";
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
  getSceneCode,
  setSceneCode,
  link
} from "@/utils/index";

export default {
  data() {
    return {
      vbNum: 0, //用户V币数量
      tomorrow: 0, //明日可领数量
      today: 0, //今日领取（弹窗）
      week: [], //周期签到
      taskList: [], //日常任务列表
      choose: false, //分享开关
      height: "", //屏幕高度
      width: "", //屏幕宽度
      signFail: false, //签到成功
      finish: false, //完成任务
      //vbNewUser: false, //vb活动新用户
      task: "", //任务名
      taskVbNum: 0, //任务对应vb数量
      taskMsgId: "", //完成的任务msgId
      //是否去过绑定手机号页面
      goBindPhonePage: false,
    };
  },
  onLoad() {
    //授权登陆
    if (!getLoginInfo()) {
      const url = "/pages/login/main";
      wx.navigateTo({
        url
      });
      return;
    }
    const value = wx.getStorageSync("systemInfo");
    this.height = value.screenHeight;
    this.width = value.screenWidth;
    //转发回调标识
    // wx.showShareMenu({
    //   withShareTicket: true
    // })
  },
  onShow() {
    //绑定手机号
    if (!isBindPhone()) {
      if (this.goBindPhonePage) {
        this.goBindPhonePage = false;
        wx.switchTab({
          url: "/pages/home/main"
        });
      } else {
        this.goBindPhonePage = true;
        wx.navigateTo({ 
          url: "/pages/login/bindPhone/main"
        });
      }
      return
    }
    //分享关
    this.choose = false;
    // //生成新人礼包
    // this.getGeneratePackage();
    //获取V币余额
    this.queryBalance();
    //获取V币签到信息
    this.doSign();
    //获取日常任务列表
    this.getTaskList();
    //获取完成任务通知消息
    this.getNotifyMessage();
  }, 
  onShareAppMessage(res) {
    this.choose = false;
    return {
      title: "【天天领V币】分享赚V币，好礼拿不停！",
      path: `/pages/service/vb/main`,
      imageUrl: "http://bqyx-qiniu.bqrzzl.com/VB@2x.png",
      success: function(res) {
        // 转发成功
        // console.log(res)
        // let shareTickets = res.shareTickets;
        // if (shareTickets.length == 0) {
        //     return false;
        // }
        // wx.getShareInfo({
        //   shareTicket: shareTickets[0],
        //   success: function(res){
        //     let encryptedData = res.encryptedData;
        //     let iv = res.iv;
        //     console.log("群iv："+iv)
        //   }
        // })
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  methods: {
    //判断vb活动新人
    // getGeneratePackage() {
    //   let url = path.generatePackage;
    //   let queryData = {
    //     userId: getLoginInfo().userid
    //     //userId: "7dac24c95e7c4d829002537f5192b5b6"
    //   }
    //   let promises = this.$fly.post(url, queryData);
    //   promises.then(data => {
    //     if(data != null && data.openFlag != 1){
    //       //是新用户
    //       this.vbNewUser = true;
    //     }
    //   })
    //   .catch(e => {
    //     apiFail(e);
    //   });
    // },
    //获取V币余额
    queryBalance() {
      let url = path.queryBalance;
      let queryData = {
        userId: getLoginInfo().userid
      }
      let promises = this.$fly.post(url, queryData);
      promises.then(data => {
        this.vbNum = data.vcoinBalance;
      })
      .catch(e => {
        apiFail(e);
      });
    },
    //获取签到信息
    doSign() {
      let url = path.doSign;
      let queryData = {
        userId: getLoginInfo().userid
      }
      let promises = this.$fly.post(url, queryData);
      promises.then(data => {
        this.week = data.signInPeriod;
        this.tomorrow = data.nextVcoinAmount;
        //是否重复签到
        if(data.repeatedSign == 1){
          this.signFail = false;
        }else if(data.repeatedSign == 0){
          this.signFail = true;
          this.today = data.vcoinAmount;
          this.queryBalance();
        }
      })
      .catch(e => {
        apiFail(e);
      });
    },
    //获取日常任务列表
    getTaskList() {
      let url = path.getTaskList;
      let queryData = {
        userId: getLoginInfo().userid,
        systemType: "MP"
      }
      let promises = this.$fly.post(url, queryData);
      promises.then(data => {
        this.taskList = data;
      })
      .catch(e => {
        apiFail(e);
      });
    },
    //获取完成任务通知消息
    getNotifyMessage() {
      let url = path.getNotifyMessage;
      let queryData = {
        userId: getLoginInfo().userid,
      }
      let promises = this.$fly.post(url, queryData);
      promises.then(data => {
        if(data.length > 0){
          this.taskMsgId = data[0].id;
          this.task = data[0].taskName;
          this.taskVbNum = data[0].vcoinAmount;
          if(this.signFail == false && this.finish == false){
            this.finish = true;
          }
        }
      })
      .catch(e => {
        apiFail(e);
      });
    },
    //关闭任务弹窗
    closeFinish() {
      this.finish = false;
      //确认消息通知
      let url = path.confirmNotifyMessage;
      let queryData = {
        msgId: this.taskMsgId
      }
      let promises = this.$fly.post(url, queryData);
      promises.then(code => {
        if(code == 200){
          this.getNotifyMessage();
        }
      })
      .catch(e => {
        apiFail(e);
      });
    },
    //查看明细（暂关闭）
    goMyVb() {
      wx.navigateTo({
        url: `/pages/service/vb/myVb/main`,
      });
    },
    //点击去分享
    share(taskId) {
      this.choose = true;
      //领取奖励
      let url = path.getTaskReward;
      let queryData = {
        userId: getLoginInfo().userid,
        taskId: taskId
      }
      let promises = this.$fly.post(url, queryData);
      promises.then(data => {
        console.log("share")
      })
      .catch(e => {
        apiFail(e);
      });
    },
    //取消分享
    cancelShare() {
      this.choose = false;
    },
    //关闭签到弹窗
    closeMark() {
      this.signFail = false;
      this.getNotifyMessage();
    },
    //邀请好友
    invitation(taskId) {
      wx.navigateTo({
        url: `/pages/service/vb/vbShare/main?taskId=${taskId}&inviterUserId=${getLoginInfo().userid}`,
      });
    },
    //朋友圈
    showImg() {
      this.choose = false;
      const url = "/pages/service/vb/poster/main";
      wx.navigateTo({ url });
    },
    //常见问题
    goHelp(taskId) {
      const url = "/pages/user/help/main";
      wx.navigateTo({ url });
      //领取奖励
      let queryData = {
        userId: getLoginInfo().userid,
        taskId: taskId
      }
      let promises = this.$fly.post(path.getTaskReward, queryData);
      promises.then(data => {
        console.log("help")
      })
      .catch(e => {
        apiFail(e);
      });
    },
    //意见反馈
    goSuggest(taskId) {
      if (isBindPhone()) {
        const url = `/pages/user/feedback/main?taskId=${taskId}`;
        wx.navigateTo({ url });
      } else {
        const url = "/pages/login/bindPhone/main";
        wx.navigateTo({ url });
      }
    },
    //车险留资
    goDjcx(taskId) {
      if (isBindPhone()) {
        const url = `/pages/djcx/main?taskId=${taskId}`;
        wx.navigateTo({ url });
      } else {
        const url = "/pages/login/bindPhone/main";
        wx.navigateTo({ url });
      }
    },
    //下载app
    goDownload() {
      const url = "/pages/service/vb/poster/main";
      wx.navigateTo({ url });
    }
  }
};
</script>

<style lang="scss" scoped>
.bigbox {
  height: 100%;
  background: #f6f6f6;
  padding-bottom: 46rpx;
}
.header {
  width: 100%;
  height: 335rpx;
  background-image: url('http://bqyx-qiniu.bqrzzl.com/banner_VB@2x.png');
  background-size: 100% 100%;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  overflow: hidden;
  h1{
    font-size: 36rpx;
    margin-top: 50rpx;
    margin-left: 50rpx;
    span{
      display: inline-block;
      width: 120rpx;
      height: 42rpx;
      background: rgba(255,255,255,1);
      border-radius: 21rpx 0rpx 0rpx 21rpx;
      font-size: 26rpx;
      font-weight: 400;
      line-height: 42rpx;
      text-align: center;
      position: absolute;
      right: 0rpx;
    }
  }
  h2{
    font-size: 72rpx;
    margin-top: 30rpx;
    margin-left: 50rpx;
  }
}
.module-wrap{
  height: 290rpx;
  background: #fff;
  border-radius: 16rpx;
  margin: 0 20rpx;
  margin-top: -40rpx;
  position: relative;
  overflow: hidden;
  .title{
    margin-top: 33rpx;
    margin-left: 30rpx;
    font-size: 33rpx;
    font-weight: 500;
  }
  ul{
    margin-left: 30rpx;
    margin-top: 30rpx;
    margin-right: 30rpx;
    display: flex;
    justify-content: space-between;
    li{
      width: 85rpx;
      height: 150rpx;
      div{
        width: 85rpx;
        height: 100rpx;
        background:rgba(255,248,230,1);
        border-radius: 8rpx;  
        img{
          width: 46rpx;
          height: 46rpx;
          display: inline-block;
          margin: 10rpx 19rpx; 
        }
        span{
          display: inline-block;
          font-size: 20rpx;
          text-align: center;
          width: 85rpx;
          position: relative;
          top: -30rpx;
          color: rgba(236, 131, 39, 1);
        }
      }
      .sign{
        background:linear-gradient(
          180deg,
          rgba(254,215,52,1),
          rgba(253,170,28,1));
        overflow: hidden;
        font-weight:500;
        h3{
          font-size: 24rpx;
          color: #fff;
          text-align: center;
          margin: 20rpx auto; 
        }
        span{
          color: #fff;
        }
      }
      .days{
        font-size: 25rpx;
        text-align: center;
        margin-top: 25rpx;
      }
    }
  }
}
.module-other {
  background: #fff;
  margin: 20rpx 20rpx 0 20rpx;
  overflow: hidden;
  border-radius: 16rpx;
  font-weight: 400;
  h1{
    font-weight: 500;
    font-size: 33rpx;
    margin-top: 33rpx;
    margin-left: 30rpx;
  }
  ul{
    width: 650rpx;
    margin: 0rpx auto;
    li{
      border-bottom: 1rpx solid rgba(238,238,238,1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10rpx;
      padding-bottom: 30rpx;
      div{

        p{
          font-size: 32rpx;
          margin-top: 20rpx;
          img{
            width: 43rpx;
            height: 43rpx;

          }
          span{
            position: relative;
            top: -8rpx;
            font-size: 28rpx;
            color: rgba(236, 131, 39, 1);
            margin-left: 10rpx;
          }
        }
      }
      button{
        margin-right: 0rpx;
        font-size: 26rpx;
        min-width: 144rpx;
        height: 56rpx;
        line-height: 56rpx;
        background:linear-gradient(176deg,rgba(254,235,167,1),rgba(255,204,0,1));
        border-radius: 28rpx;
      }
    }
  }
}
.share {
  width: 100%;
  height: 100%;
  position: fixed;
  bottom: 0;
  z-index: 99;
  background: rgba(0, 0, 0, 0.5);
  .box {
    width: 100%;
    height: 4.6rem;
    position: fixed;
    bottom: 0;
    z-index: 999;
    background: #fff;
    .maskLayer {
      font-size: 0.4rem;
      width: 100%;
      line-height: 1.68rem;
      font-weight: 900;
      text-align: center;
    }
    .choose {
      height: 2rem;
      width: 100%;
      display: flex;
      .friend {
        width: 20%;
        display: inline-block;
        padding: 0;
        border: transparent;
        img {
          width: 1rem;
          height: 1rem;
        }
        p {
          font-weight: 400;
          height: 40%;
          width: 100%;
          margin-top: -30%;
          font-size: 0.32rem;
        }
      }
      .friends {
        width: 20%;
        display: inline-block;
        padding: 0;
        border: transparent;
        img {
          width: 1rem;
          height: 1rem;
        }
        p {
          font-weight: 400;
          height: 40%;
          width: 100%;
          margin-top: -30%;
          font-size: 0.32rem;
        }
      }
    }
  }
}
.mark {
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;

  .boxs {
    position: relative;
    top: 22%;
    left: 135rpx;
    z-index: 999;
    width: 480rpx;
    height: 563rpx;
    background:rgba(255,255,255,1);
    border-radius: 12rpx;
    font-weight: 400;
    overflow: hidden;
    img{
      display: block;
      width: 295rpx;
      height: 230rpx;
      margin: 35rpx auto;
    }
    h1{
      font-weight: 500;
      text-align: center;
      font-size: 34rpx;
      height: 70rpx;
      width: 400rpx;
      margin: 0 auto;
      line-height: 60rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    button{
      width: 77%;
      background: linear-gradient(
        180deg,
        rgba(254, 235, 167, 1),
        rgba(255, 204, 0, 1)
      );
      font-size: 36rpx;
      border-radius: 40px;
      margin-bottom: 12rpx;
      font-weight: 500;
    }
  }
}
</style>
