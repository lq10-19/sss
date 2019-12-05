<template>
  <div class="main">
    <div class="head">
      <div class="rule" @click="goRule">&nbsp;&nbsp;活动规则</div>
      <div class="title-banner">
        <swiper
          class="swiper"
          :circular="true"
          :vertical="true"
          :autoplay="true"
          :interval="3000"
          :duration="500"
        >
          <swiper-item v-for="item in titleBanner" :key="item.name">
            <p>{{item}}</p>
          </swiper-item>
        </swiper>
      </div>
    </div>
    <div class="section">
      <div class="join">
        <p>选择一款奖品开团，邀请新用户参团，团队满员并达到指定团数即可参与抽奖免费获得该款奖品！</p>
        <form report-submit @submit="getFormID" class="joinBtn">
          <!-- 判断新用户toTeam 老用户myTeam -->
          <!-- 获取FormID -->
          <button class="toTeam" @click="toTeam" form-type="submit" v-if="newUser" :disabled="status"
          :class="{stopTxt:status}">
            <div>去参团</div>
          </button>
          <button class="toTeam" @click="myTeam" form-type="submit" v-if="!newUser" :disabled="status" :class="{stopTxt:status}">
            <div>我的组团</div>
          </button>
          <button class="toGift" @click="myGift" form-type="submit">
            <div>我的奖品</div>
          </button>
        </form>
      </div>
      <div class="gift">
        <form report-submit @submit="getFormID">
        <button class="giftItem" v-for="(item,i) in giftList" :key="i" @click="giftItem(item)" form-type="submit" :disabled="status||item.timeOut=='1'">
          <img :src="item.ongImg">
          <div class="jb1">
            <h2 v-if="item.awardNumber>=1">
              <p class="time">{{item.firstAwardTime}}&nbsp;{{item.openAwardTime}}开奖</p>
              <div v-if="item.awardNumber>=1" class="timeExp">
                <!-- （每{{item.awardFrequency}}小时开奖一次） -->
                <div v-if="item.awardFrequency === 'a'">（该奖品于{{item.firstAwardTime}}{{item.openAwardTime}}开奖）</div>
                <div v-else-if="item.awardFrequency === 'b'">（每24小时开奖一次）</div>
                <div v-else-if="item.awardFrequency === 'c'">（每48小时开奖一次）</div>
                <!-- <div>{{item.awardFrequency}}</div> -->
              </div>
            </h2>
            <h3 v-if="item.awardNumber==0">该奖品已被抽完</h3>
          </div>
          <div class="jb2">
            <h1>【{{item.teamLimit}}人团】{{item.awardName}}</h1>
            <div class="joinBtn">
              <button 
                v-if="item.timeOut=='1'" :disabled="status||item.timeOut=='1'"
                :class="{stopBtn:status||item.timeOut=='1'}"
              >已结束</button>
              <button
                v-if="!item.secondInfo&&item.timeOut=='2'"
                :disabled="status"
                :class="{stopBtn:status}"
              >开团抽奖</button>
              <button
                v-if="item.secondInfo&&item.timeOut=='2'"
                :disabled="status"
                :class="{stopBtn:status}"
              >组团中</button>
            </div>
          </div>
        </button>
        </form>
      </div>
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
      userId: "",
      titleBanner: [], //气泡列表
      newUser: true, //新用户
      formId: "",
      giftList: [],
      isGoLoginPage: false,
      flag: false, //防止重复点击
      status: true, //活动状态
    };
  },
  onLoad(param) {
    //组团抽奖活动埋点
    getApp().aldstat.sendEvent(event["group.active"]);
    if (!this.loginCheck()) {
      wx.hideToast();
      return;
    };
  },

  onShow(options) {
    this.userId = getLoginInfo().userid;
    //判断新老用户
    this.queryIsNewUser();
    //获取商品信息
    this.queryPzizeList();
    this.flag = false;
    //获取活动状态
    this.queryActivityStatus();
  },
  onShareAppMessage() {
    return {
      title: "佰仟易行 5周年狂欢月 组团抽大奖！",
      path: "/pages/active/group/main",
      imageUrl: "http://bqyx-qiniu.bqrzzl.com/750_600.png",
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    };
  },
  // onHide() {
  //   //判断新老用户
  //   this.queryIsNewUser();
  // },

  methods: {
    //获取活动状态
    queryActivityStatus() {
      let url = path.allActivity;
      let promises = this.$fly.get(url); 
      promises.then(data => {
          console.log(data, 11);
          if (data && data.length > 0) {
            this.imgData = data;
            for (let elem of data) {
              if (elem.activityName == "组队抽奖活动") {
                //组团抽奖活动状态（A:未开始 B:进行中 C:已结束）
                if(elem.status == 'B') {
                  this.status = false;
                }
              } 
            }
          } else {
            wx.showModal({
              title: '',
              content: '不在活动参与时间内！',
              showCancel: false,
            })
            return
          }
        })
        .catch(e => {
            apiFail(e);
          });
    },
    //从分享进入判断是否登录
    loginCheck() {
      if (!getLoginInfo() && !this.isGoLoginPage) {
        this.isGoLoginPage = true;
        const url = "/pages/login/main";
        wx.navigateTo({ url });
        return false;
      }
      if (!getLoginInfo() && this.isGoLoginPage) {
        const url = "/pages/home/main";
        wx.reLaunch({ url });
        return false;
      }
      return true;
    },
    //获取商品信息
    queryPzizeList() {
      let url = path.queryPzizeList;
      let queryData = {
          userId: this.userId,
        };
      let promises = this.$fly.get(url,queryData);
      showLoading(promises);
      promises
        .then(data => {
          console.log(data);
          this.giftList = data;
          this.titleBanner = [...data[0].teamLimitTen, ...data[0].winLimitFive];
        })
        .catch(e => {
          apiFail(e);
        });
    },
    //判断新老用户
    queryIsNewUser() {
      let url = path.queryIsNewUser;
      let queryData = Object.assign(
        {},
        {
          userId: getLoginInfo().userid,
          activityNo: "bqyx_I_001"
        }
      );
      let promises = this.$fly.get(url, queryData);
      promises
        .then(data => {
          console.log("1是新用户 2是老用户:" + data);
          if (data == 1) {
            this.newUser = true;
          } else {
            this.newUser = false;
          }
        })
        .catch(e => {
          apiFail(e);
        });
    },
    //去参团（新用户）
    toTeam() {
      wx.navigateTo({
        url: `/pages/active/group/toTeam/main?formId=${this.formId}`,
        fail: res => {
          wx.reLaunch({
            url: "/pages/active/group/main"
          });
        }
      });
    },
    //我的组团（老用户）
    myTeam() {
      wx.navigateTo({
        url: `/pages/active/group/myTeam/main?formId=${this.formId}&isShowGoBack=false`,
        fail: res => {
          wx.reLaunch({
            url: "/pages/active/group/main"
          });
        }
      });
    },
    //我的奖品
    myGift() {
      wx.navigateTo({
        url: `/pages/active/group/myGift/main?formId=${this.formId}`,
        fail: res => {
          wx.reLaunch({
            url: "/pages/active/group/main"
          });
        }
      });
    },
    // 开团抽奖
    giftItem(restem) {
      console.log(restem)
      if(this.flag) return;
      if (restem.secondInfo) {
        this.flag = true;
        let url = "/pages/active/group/giftItem/main";
        url = url + `?teamId=${restem.secondInfo}` + `&formId=${this.formId}` + `&userId=${this.userId}` + `&teamCreateName=${getLoginInfo().nickname}` + `&teamCreatePhoto=${getLoginInfo().avatarurl}`;
        wx.navigateTo({
          url,
          fail: res => {
            wx.reLaunch({
              url: url
            });
          }
        });
      } else {
        console.log(restem.awardId,909)
        let url = path.isertCreateTeam;
        let queryData = {
          teamCreateId: this.userId,
          formId: this.formId,
          teamCreateName: getLoginInfo().nickname,
          teamCreatePhoto: getLoginInfo().avatarurl,
          awardId: restem.awardId
        };
        this.flag = true;
        let promises = this.$fly.post(url, queryData);
        promises
          .then(data => {
            //获得teamId
            //console.log(data,987);
            this.flag = false;
            let url = "/pages/active/group/giftItem/main";
            url = url + `?teamId=${data}` + `&formId=${this.formId}` + `&userId=${this.userId}` + `&teamCreateName=${getLoginInfo().nickname}` + `&teamCreatePhoto=${getLoginInfo().avatarurl}`;
            wx.navigateTo({
              url,
              fail: res => {
                wx.reLaunch({
                  url: "/pages/active/group/main"
                });
              }
            });
          })
          .catch(e => {
            this.flag = false;
            apiFail(e);
          });
      }
    },
    //活动规则
    goRule() {
      wx.navigateTo({
        url: "/pages/active/group/rule/main",
        fail: res => {
          wx.redirectTo({
            url: "/pages/active/group/main"
          });
        }
      });
    },
    getNearestReward() {
      let loginInfo = getLoginInfo();
      let url = path.getNearestReward;
      let queryData = {};
      let promises = this.$fly.get(url, queryData);
      //获取气泡内容
      promises
        .then(data => {
          console.log(data);
          if (data != "") {
            this.titleBanner = data;
          }
        })
        .catch(e => {
          apiFail(e);
        });
      return promises;
    },
    //获取FormID
    getFormID: function(e) {
      this.formId = e.mp.detail.formId;
      console.log(this.formId);
    }
  }
};
</script>

<style lang="scss" scoped>
$jb1ColorTop: #b39c73;
$jb1ColorBottom: #dcc7aa;
$jb2ColorTop: #ba996c;
$jb2ColorBottom: #ceb28a;

.main {
  width: 100%;
  overflow: hidden;
  color: #fff;

  .head {
    width: 100%;
    height: 7.5rem;
    position: relative;
    background: url("http://bqyx-qiniu.bqrzzl.com/%E5%A4%B4%E5%9B%BE2@2x.jpg");
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .headbg {
      width: 100%;
    }

    .rule {
      width: 1.46rem;
      height: 0.48rem;
      position: absolute;
      right: -0.2rem;
      top: 1.25rem;
      font-size: 0.26rem;
      line-height: 0.48rem;
      background: #fff;
      border: 0.01rem solid #fff;
      border-radius: 0.5rem;
      color: #000;
    }

    .title-banner {
      position: absolute;
      width: 80%;
      border: rgba(255, 255, 255, 0.3) solid 0.01rem;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 0.5rem;
      top: 0.25rem;
      left: 42%;
      -webkit-transform: translateX(-40%);

      img {
        width: 0.5rem;
        height: 0.5rem;
        position: relative;
        left: 0.5rem;
        display: inline-block;
      }

      .swiper {
        width: 100%;
        height: 50rpx;
        border-radius: 25rpx;
        background-color: rgba(255, 255, 255, 0.3);

        p {
          height: 100%;
          width: 100%;
          text-align: center;
          line-height: 50rpx;
          font-size: 28rpx;
          color: #fff;
          margin: 0;
        }
      }

      ul {
        width: 100%;
        overflow: hidden;
        position: absolute;
        left: 0;
        top: 0;
        transition: top 0.5s;

        li {
          width: 100%;
          display: block;
        }
      }

      p {
        color: rgb(255, 255, 255);
        font-weight: 600;
        font-size: 0.28rem;
        text-align: center;
        margin: 0 1rem;
        height: 0.6rem;
        line-height: 0.6rem;
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .section {
    width: 100%;
    position: relative;
    background: url("http://bqyx-qiniu.bqrzzl.com/bg@2x.png");
    //background: #0F0C0D;
    background-repeat: repeat-y;
    background-size: 100% 100%;

    .join {
      width: 100%;
      position: relative;
      top: 0;
      color: #fff;
      padding-top: 0.2rem;
      padding-bottom: 1rem;

      p {
        width: 84%;
        position: relative;
        left: 8%;
        font-size: 0.26rem;
        text-align: center;
        line-height: 0.52rem;
      }

      .joinBtn {
        padding: 0 8%;
        position: relative;
        top: 0.5rem;

        button {
          width: 33%;
          padding: 0;
          margin: 0.1rem 0.32rem;
          display: inline-block;
          div {
            width: 100%;
            height: 100%;
            font-size: 0.36rem;
            font-weight: 600;
            background-image: url("http://bqyx-qiniu.bqrzzl.com/btn_s@2x.png");
            background-repeat: no-repeat;
            background-size: cover;
          }
        }
        .stopTxt {
          color: #b2b2b2;
        }
      }
    }

    .gift {
      width: 95%;
      flex-wrap: wrap;
      //background-image: url("http://bqyx-qiniu.bqrzzl.com/2.png");
      //background: #0F0C0D;
      //background-repeat: repeat-y;
      // background-size: contain;
      //background-size: 100% ;
      justify-content: space-between;
      margin: 0 auto;
      font-size: 0.2rem;

      .giftItem {
        width: 3.15rem;
        display: inline-block;
        overflow: hidden;
        border: 0.01rem solid #bc996f;
        margin-top: 0rem;
        margin-left: 0.2rem;
        margin-right: 0.2rem;
        margin-bottom: 0.4rem;
        padding: 0;
        text-align: left;
        border-radius: 0; 
        img {
          width: 100%;
          height: 3.25rem;
          display: block;
        }

        .jb1 {
          background: linear-gradient(180deg, $jb1ColorTop, $jb1ColorBottom);
          color: #000;

          h2 {
            width: 100%;
            height: 0.65rem;
            font-size: 0.22rem;
            line-height: 0.34rem;

            .time {
              padding-left: 0.1rem;
            }

            .timeExp {
              div {
                color: #ff3c3c;
                font-size: 0.2rem;
              }
            }
          }

          h3 {
            color: #ff3c3c;
            font-size: 0.22rem;
            line-height: 0.5rem;
            padding-left: 0.1rem;
          }
        }

        .jb2 {
          background: linear-gradient(180deg, $jb2ColorTop, $jb2ColorBottom);
          padding-bottom: 0.1rem;
          padding-top: 0.1rem;
          color: #000;

          h1 {
            width: 100%;
            height: 0.8rem;
            font-size: 0.24rem;
            line-height: 0.36rem;
            font-weight: 500;
            word-break: break-all;
          }

          button {
            width: 55%;
            height: 0.5rem;
            font-size: 0.3rem;
            padding: 0;
            line-height: 0.5rem;
            color: #fff;
            background: #000;
            border-radius: 3px;
          }

          .stopBtn {
            background: #b2b2b2;
          }
        }
      }
    }
  }
}
</style>
