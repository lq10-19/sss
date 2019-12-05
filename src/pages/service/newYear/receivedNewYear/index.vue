<template>
  <!-- 拜年对象收到拜年 -->
  <div class="main">
    <img class="flower flowerShow" src="http://bqyx-qiniu.bqrzzl.com/newyear/flower.png">
    <div class="zs-left zs"></div>
    <div class="zs-right zs"></div>
    <div class="content" :style="{'min-height': windowHeight+'rpx'}">
      <div class="title">小伙伴们给您拜年啦！</div>
      <ul class="list">
        <li class="item" v-for="(item,index) in groupUsersFilter" :key="index">
          <div class="user-info">
            <img class="avatar" :src="item.fromAvatarUrl">
            <div class="name">{{item.fromNickname}}</div>
          </div>
          <div class="msg">{{item.greetingsValue}}</div>
        </li>
        <li class="item-thanks" v-if="showThanks">
          <div class="msg">{{blessings.greetingsValue}}</div>
          <div class="user-info">
            <img class="avatar" :src="loginInfo.avatarurl">
            <div class="name">{{loginInfo.nickname}}</div>
          </div>
        </li>
      </ul>
      <div class="title-2">打赏一下可爱的小伙伴们！</div>
      <div class="money-list">
        <div :class="moneyIndex == 1?'selected':''" class="item" @click="changeMoney(1,1)">￥1</div>
        <div :class="moneyIndex == 2?'selected':''" class="item" @click="changeMoney(8.88,2)">￥8.88</div>
        <div :class="moneyIndex == 3?'selected':''" class="item" @click="changeMoney(58.88,3)">￥58.88</div>
        <div :class="moneyIndex == 4?'selected':''" class="item" @click="changeMoney(88.88,4)">￥88.88</div>
      </div>
      <input class="input" v-model="money" type="number" placeholder="请输入发放红包总额">
      <div class="btn-reward" @click="redPacket">塞钱进红包</div>
      <button class="btn-thank" @click="thanks">送上祝福</button>
    </div>
    <div class="footer">
      <img class="img" mode="widthFix" src="http://bqyx-qiniu.bqrzzl.com/newyear/footer-bg.png">
    </div>
    <div class="mask" v-if="showMask">
      <img class="img-fireworks" src="http://bqyx-qiniu.bqrzzl.com/newyear/fireworks@2x.png">
      <img class="img-txt showMaskAn" src="http://bqyx-qiniu.bqrzzl.com/newyear/txt@2x.png">
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
export default {
  components: {},
  data() {
    return {
      windowHeight: "",
      groupMainId: "",
      money: 1,
      showThanks: false,
      isGoLoginPage: false,
      groupUsers: [],
      loginInfo: {},
      showMask: true,
      canSend: true, //防止二次点击
      blessings:{},
      blessingsList:[],
      moneyIndex:1
    };
  },
  onLoad(query) {
    console.log(query);
    this.groupMainId = query.groupMainId;
    this.loginInfo = getLoginInfo();
    this. getAllMsg();
  },
  onShow() {
    if (!getLoginInfo() && !this.isGoLoginPage) {
      this.isGoLoginPage = true;
      const url = "/pages/login/main";
      wx.navigateTo({ url });
      return;
    }else{
      this.hasSendToGroup(this.groupMainId);
    };
    if (this.groupMainId) {
      this.getRecordDetail(this.groupMainId);
    }
    setTimeout(() => {
      this.showMask = false;
    }, 2000);
  },
  onReady() {
    wx.getSystemInfo({
      success: ({ windowHeight }) => {
        this.windowHeight = windowHeight * 2 - 60;
      }
    });
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
            url: "/pages/service/newYear/main",
            fail:()=>{
              wx.redirectTo({
                url: "/pages/service/newYear/main",
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
    getRecordDetail(groupMainId) {
      let url = path.getRecordDetail + "/" + groupMainId;
      let promise = this.$fly.get(url);
      promise
        .then(data => {
          console.log(data);
          this.groupUsers = data;
        })
        .catch(e => apiFail(e));
    },
    /**
     * 红包打赏
     */
    redPacket() {
      if (this.money < 1 || this.money > 5000) {
        wx.showToast({
          title: "请输入1-5000元红包金额",
          mask: true,
          icon: "none"
        });
        return;
      }

      let url = path.redPacketPay;
      let queryData = {
        fromUserId: this.loginInfo.userid,
        groupMainId: this.groupMainId,
        redPackage: this.money
      };
      console.log(queryData);
      wx.showLoading({
        title: "打赏中..."
      });
      let promise = this.$fly.post(url, queryData);
      promise
        .then(obj => {
          console.log(obj);
          if (obj) {
            wx.requestPayment({
              appid: obj.appId,
              timeStamp: obj.timeStamp,
              nonceStr: obj.nonceStr,
              package: obj.package,
              orderId: obj.orderId,
              signType: "MD5",
              paySign: obj.sign,
              success: function(res) {
                wx.hideLoading();
                console.log(res);
                wx.showToast({
                  title: "打赏成功",
                  icon: "success"
                });
                wx.navigateTo({
                  url:
                    "/pages/service/newYear/receivedNewYear/rewardSuccess/main"
                });
              },
              fail: function(res) {
                wx.hideLoading();
                console.log("支付失败:" + res);
                wx.showToast({
                  title: "支付失败",
                  icon: "none"
                });
              }
            });
          }
        })
        .catch(e => {
          wx.hideLoading();
          apiFail(e);
        });
    },
    /**
     * 文字祝福
     */
    thanks() {
      if (!this.canSend) {
        return;
      }
      this.loginInfo = getLoginInfo();
      this.canSend = false;
      this.showThanks = true;
      let url = path.bnRecodeSave;
      let queryData = {
        fromUserId: this.loginInfo.userid,
        groupMainId: this.groupMainId,
        greetingsCode: this.blessings.greetingsCode,
        greetingsValue: this.blessings.greetingsValue,
        sendType: "1",
        yearInfoType: "0"
      };
      console.log(queryData);
      let promise = this.$fly.post(url, queryData);
      promise
        .then(obj => {
          this.canSend = true;
          console.log(obj);
          wx.showToast({
            title: "祝福成功",
            icon: "success"
          });
          wx.navigateTo({
            url: "/pages/service/newYear/newYearRecord/newYearRecordObj/main?groupMainId="+this.groupMainId+"&status=7",
            fail:(res)=>{
              wx.redirectTo({
                url: "/pages/service/newYear/newYearRecord/newYearRecordObj/main?groupMainId="+this.groupMainId+"&status=7"
              });
            }
          });
        })
        .catch(e => {
          this.canSend = true;
          apiFail(e);
        });
      showLoading(promise);
    },
    changeMoney(val,i) {
      this.money = val;
      this.moneyIndex =i;
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
              if(v.greetingsType=="2"){
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
   
    
  },
  computed: {
    groupUsersFilter: function() {
      return this.groupUsers.filter(
        item => item.fromUserId != this.loginInfo.userid
      );
    }
  }
};
</script>

<style lang="scss" scoped>
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
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .title {
      font-size: 38rpx;
      font-weight: 600;
      margin-top: 108rpx;
    }
    .list {
      width: 580rpx;
      display: block;
      background-color: #d22a2a;
      border-radius: 20rpx;
      margin-top: 37rpx;
      padding: 0 24rpx;
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 24rpx;
        margin-bottom: 24rpx;
        .user-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .avatar {
            width: 88rpx;
            height: 88rpx;
            border-radius: 50%;
          }
          .name {
            color: #ffffff;
            font-size: 24rpx;
            background-color: #ffb644;
            text-align: center;
            border-radius: 19rpx;
            width: 107rpx;
            height: 38rpx;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            margin-top: -6rpx;
          }
        }
        .msg {
          width: 400rpx;
          height: 85rpx;
          font-size: 26rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 36rpx;
          padding-left: 16rpx;
          background-color: #f7d7c3;
          border-radius: 9rpx;
        }
      }
      .item-thanks {
        display: flex;
        margin-top: 24rpx;
        margin-bottom: 24rpx;
        justify-content: space-between;
        align-items: center;
        .user-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .avatar {
            width: 88rpx;
            height: 88rpx;
            border-radius: 50%;
          }
          .name {
            color: #ffffff;
            font-size: 24rpx;
            background-color: #ffb644;
            text-align: center;
            border-radius: 19rpx;
            width: 107rpx;
            height: 38rpx;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        }
        .msg {
          width: 400rpx;
          height: 85rpx;
          font-size: 26rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #8fc654;
          border-radius: 9rpx;
        }
      }
    }
    .title-2 {
      margin-top: 60rpx;
      color: black;
      font-size: 38rpx;
      font-weight: bold;
    }
    .money-list {
      width: 580rpx;
      font-size: 32rpx;
      font-weight: bold;
      margin-top: 40rpx;
      display: flex;
      justify-content: center;
      color: #d22a2a;
      .item {
        text-align: center;
        width: 140rpx;
        height: 0.6rem;
        border: 1px solid #FFC444;
        margin-right: 20rpx;
        background:#FFC444;
        border-radius:0.1rem;
        font-size: 0.3rem;
        line-height: 0.6rem;
        box-sizing: border-box;
      }
      .selected{
        color:blue;
        background:#D22A2A;
        border:1px solid #FFC444;
        color: #FFC444;
        border-radius: 0.1rem;
      }
    }
    .input {
      margin-top: 40rpx;
      margin-bottom: 70rpx;
      padding: 0 18rpx;
      display: block;
      width: 544rpx;
      height: 90rpx;
      background-color: #ffffff;
      border-radius: 6px;
    }
    .btn-reward {
      width: 580rpx;
      height: 86rpx;
      color: #d22a2a;
      margin-bottom: 30rpx;
      background: url("http://bqyx-qiniu.bqrzzl.com/newyear/btn2@2x.png")
        repeat-y top;
      background-size: 580rpx 86rpx;
      text-align: center;
      line-height: 86rpx;
    }
    .btn-thank {
      width: 580rpx;
      background-color: rgba(235, 235, 235, 1);
      color: rgba(220, 220, 220, 1);
      border-radius: 18px;
      margin-bottom: 180rpx;
    }
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
  .mask {
    position: absolute;
    z-index: 99;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    .img-fireworks {
      width: 538rpx;
      height: 469rpx;
      position: relative;
      margin: 0 auto;
      margin-top: 40%;
      display: block;
    }
    .img-txt {
      width: 538rpx * 0.8;
      height: 469rpx * 0.6;
      position: relative;
      margin: 0 auto;
      margin-top: -40%;
      display: block;
    }
  }
}
.showMaskAn {
  animation: showMaskAn 1.8s ease-in-out;
}
@keyframes showMaskAn {
  0%,
  30% {
    transform: scale(0.2);
  }
  50%,
  80% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
