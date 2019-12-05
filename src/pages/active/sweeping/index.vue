<template>
  <div class="main">
    <div class="backHome" @click="backHome" v-if="backShow== true">
      <img src="/static/img/sign/back.png">
    </div>
    <div class="content">
      <div class="mess-wrap">
        <p class="label">今日还剩
          <span>{{getEnableTimes}}次</span>扫车领红包机会
        </p>
        <button class="photo" @click="uploadPhoto">扫一扫</button>
        <div class="share-btn" @click="getEnjoy">邀请好友一起玩</div>
      </div>
      <div class="section">
        <div class="title">
          <p>扫车玩法</p>
        </div>
        <ul>
          <li>
            <img class="icon" src="http://bqyx-qiniu.bqrzzl.com/sweep/xicon-1.png">
            <p class="label">拍车扫红包</p>
          </li>
          <li>
            <img class="icon" src="http://bqyx-qiniu.bqrzzl.com/sweep/xicon-2.png">
            <p class="label">扫描车身</p>
          </li>
          <li>
            <img class="icon" src="http://bqyx-qiniu.bqrzzl.com/sweep/xicon-3.png">
            <p class="label">邀请好友
              <br>增加扫红包次数
            </p>
          </li>
        </ul>
        <div class="clear"></div>
      </div>
      <div class="section">
        <div class="title">
          <p>活动说明</p>
        </div>
        <ul>
          <li class="list" v-for="(item,index) in rules" :key="index">{{item.rule}}</li>
        </ul>
        <div class="clear"></div>
      </div>
    </div>
    <div class="enjoy" v-show="goEnjoy">
      <div class="enjoy_main">
        <div class="button">
          <button open-type="share">
            <img src="/static/redBag/weixin@2x.png" class="weChat">
            <p>微信好友</p>
          </button>
          <button @click="enjoyFriend">
            <img src="/static/redBag/pengyouquan@2x.png" class="friend">
            <p>朋友圈</p>
          </button>
        </div>
        <div class="buttom" @click="know">我知道了</div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  path,
  getLoginInfo,
  getSystemInfo,
  apiFail,
  getSceneCode,
  setSceneCode,
  showLoading,
  event
} from "@/utils/index";
import { setTimeout } from "timers";
export default {
  components: {},
  data() {
    return {
      img: "",
      getEnableTimes: "0",
      goEnjoy: false,
      aidUserId: "",
      backShow: true,
      isGoLoginPage: false,
      remainFlag: 0,
      rules: ""
    };
  },
  onLoad(options) {
    console.log(options);
    if (options.scene) {
      setSceneCode(options.scene);
      this.aidUserId = options.scene;
      console.log(this.aidUserId);
    } else {
      setSceneCode(options.aidUserId);
      this.aidUserId = options.aidUserId;
      console.log(this.aidUserId);
    }

    if (options.scann) {
      this.getEnableTimess();
      var that = this;
      setTimeout(function() {
        that.uploadPhoto();
      }, 300);
    }
    if (options.from) {
      getApp().aldstat.sendEvent(event["from"],options.from);
    }
    this.getRules();
  },
  onShow() {
    this.goEnjoy = false;
    if (!getLoginInfo() && !this.isGoLoginPage) {
      this.isGoLoginPage = true;
      const url = "/pages/login/main";
      wx.navigateTo({ url });
      return;
    } else {
      if (this.aidUserId != undefined) {
        this.saveInv();
      }
      showLoading(this.getEnableTimess());
    }
  },
  onReady() {},
  onShareAppMessage(params) {
    let loginInfo = getLoginInfo();
    let userid = loginInfo.userid;
    let nickname = loginInfo.nickname;
    this.goEnjoy = false;
    return {
      title: nickname + "邀你一起瓜分百万现金，扫扫就能领哦~",
      imageUrl: "http://bqyx-qiniu.bqrzzl.com/sweep/banner.jpg",
      path: `/pages/active/sweeping/main?aidUserId=${userid}`
    };
  },
  methods: {
    uploadPhoto(e) {
      if (!getLoginInfo()) {
        const url = "/pages/login/main";
        wx.navigateTo({ url });
        return;
      } else {
        if (this.getEnableTimes == 0) {
          wx.navigateTo({
            url:
              "/pages/active/sweeping/scanning/main?EnableTimesVal=" +
              this.remainFlag
          });
        } else {
          var that = this;
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ["compressed"], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ["camera"], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
              console.log(res);
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              var tempFilePaths = res.tempFilePaths;
              console.log("本地图片的路径:", tempFilePaths);
              that.img = tempFilePaths;
              wx.navigateTo({
                url:
                  "/pages/active/sweeping/scanning/main?imgsrc=" + tempFilePaths
              });
            }
          });
        }
      }
    },
    getEnableTimess() {
      let userInfo = getLoginInfo();
      let url = path.getEnableTimes + "/" + userInfo.userid;
      let queryData = {};
      let promise = this.$fly.get(url, queryData);
      promise
        .then(data => {
          console.log(data);
          if (data < 0) {
            this.getEnableTimes = 0;
          } else {
            this.getEnableTimes = data.enableTimes;
          }
          this.remainFlag = data.remainFlag;
        })
        .catch(e => {
          apiFail(e);
        });
      return promise;
    },
    getEnjoy(e) {
      console.log(e);
      if (!getLoginInfo()) {
        const url = "/pages/login/main";
        wx.navigateTo({ url });
        return;
      } else {
        if (e.avatarUrl == null) {
          this.goEnjoy = true;
        } else {
          this.goEnjoy = false;
        }
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
    saveInv() {
      let url = path.scanSaveInvitation;
      let loginInfo = getLoginInfo();
      let queryData = {
        userId: loginInfo.userid,
        aidUserId: getSceneCode()
      };
      console.log(queryData);
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          if (data != null) {
            console.log("保存邀请关系");
          }
          console.log("保存邀请关系s");
        })
        .catch(e => {
          //apiFail(e);
        });
      return promise;
    },
    backHome() {
      wx.switchTab({
        url: "/pages/home/main"
      });
    },
    getRules() {
      let url = path.getscanRules;
      let loginInfo = getLoginInfo();
      let queryData = {};
      let promise = this.$fly.get(url, queryData);
      promise
        .then(data => {
          if (data != null) {
            this.rules = data;
          }
          console.log(this.rules);
        })
        .catch(e => {
          apiFail(e);
        });
      return promise;
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  padding-bottom: 0.66rem;
  background: url("http://bqyx-qiniu.bqrzzl.com/sweep/head-bg.jpg") no-repeat
    top;
  background-color: #ffd83b;
  background-size: 100% 4.95rem;
  overflow: hidden;
  .content {
    margin-top: 5.08rem;
    width: 100%;
    overflow: hidden;
  }
  .mess-wrap {
    width: 6.61rem;
    margin: 0 auto;
    height: 4.09rem;
    background: url("http://bqyx-qiniu.bqrzzl.com/sweep/content.png") no-repeat
      center;
    background-size: 100% 100%;
    overflow: hidden;
    .label {
      width: 100%;
      overflow: hidden;
      margin-top: 0.63rem;
      font-size: 0.26rem;
      color: #000;
      text-align: center;
      span {
        color: #c54e00;
        margin: 0 0.05rem;
      }
    }
    .photo {
      width: 4.83rem;
      height: 0.8rem;
      background: linear-gradient(
        180deg,
        rgba(255, 195, 37, 1),
        rgba(255, 151, 0, 1)
      );
      border-radius: 0.4rem;
      color: #fff;
      font-size: 0.3rem;
      margin: 0.49rem auto.4rem auto;
    }
    .photo:after {
      border: none;
    }
    .share-btn {
      width: 4.83rem;
      height: 0.8rem;
      border: 1px solid #ffc325;
      border-radius: 0.4rem;
      color: #fff;
      font-size: 0.3rem;
      line-height: 0.8rem;
      text-align: center;
      margin: 0 auto;
      color: #ff9902;
    }
  }
  .section {
    width: 6.2rem;
    background: rgba(255, 245, 196, 1);
    border-radius: 0.1rem;
    margin: 0 auto;
    position: relative;
    margin-top: 0.84rem;
    padding-bottom: 0.15rem;
    .title {
      width: 3.73rem;
      height: 0.58rem;
      background: url("http://bqyx-qiniu.bqrzzl.com/sweep/title-bg.png")
        no-repeat center;
      background-size: 100% 100%;
      position: absolute;
      left: 50%;
      -webkit-transform: translateX(-50%);
      top: -0.16rem;
      p {
        font-size: 0.3rem;
        color: #c54e00;
        width: 100%;
        text-align: center;
        margin-top: 0.08rem;
        font-weight: bold;
      }
    }
    ul {
      margin-top: 0.85rem;
      float: left;
      width: 100%;
      li {
        width: 33.3333%;
        float: left;
        text-align: center;
        img {
          width: 0.9rem;
          height: 0.7rem;
          margin: 0 auto;
        }
        .label {
          width: 100%;
          text-align: center;
          font-size: 0.24rem;
          color: #c06e1f;
          font-weight: bold;
        }
      }
      li:nth-child(1) .label {
        margin-top: 0.15rem;
      }
      li:nth-child(2) .label {
        margin-top: 0.15rem;
      }
      .list {
        font-size: 0.26rem;
        color: #c06e1f;
        width: 100%;
        text-align: left;
        padding: 0 0.3rem;
        box-sizing: border-box;
        margin-bottom: 0.3rem;
      }
    }
    .clear {
      clear: both;
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
  .backHome {
    width: 0.6rem;
    height: 0.6rem;
    position: absolute;
    left: 0.3rem;
    top: 0.3rem;
    z-index: 99;
    img {
      width: 0.6rem;
      height: 0.6rem;
    }
  }
}
</style>
