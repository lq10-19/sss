<template>
  <div class="bigbox" :style="{'min-height':height+50+'px'}">
    <div class="box" v-if="isHaveData" :style="{height:height+'px'}">
      <img class="nullImg" src="/static/img/group/wu@2x.png">
      <p class="nullTxt">暂时没有信息~</p>
    </div>
    <div class="box">
      <ul>
        <li v-for="(item,index) in goodList" :key="index">
          <div class="teamIndex">
            <div class="goodImg">
              <div class="img" :style="{backgroundImage: 'url(' +item.awardImage[0].httpUrl+ ')'}">
                <p>{{item.teamLimit}}人成团</p>
              </div>
            </div>
            <div class="mid">
              <div>
                <p class="myOpen" v-if="item.type=='1'">我开的团</p>
                <p class="myJoin" v-else>我参与的团</p>
              </div>
              <h1>{{item.awardName}}</h1>
              <p class="joinMen">
                已有
                <span>{{item.teamNumber}}</span>
                人参团
              </p>
            </div>
            <div class="title">
              <form report-submit @submit="getFormID" class="joinBtn">
                <button
                  plain
                  @click="look(item)"
                  class="look1"
                  v-if="item.isPrizeWinning==4"
                  form-type="submit"
                >组团中</button>
                <span
                  class="look2"
                  v-else-if="item.isPrizeWinning==3"
                >{{item.firstAwardTime}}{{item.openAwardTime}}开奖
                <img src="http://bqyx-qiniu.bqrzzl.com/tab.png">
                </span>
                <span class="look3" v-else-if="item.isPrizeWinning==2">未中奖</span>
                <button
                  plain
                  @click="look(item)"
                  class="look4"
                  v-else-if="item.isPrizeWinning==1"
                >已中奖</button>
              </form>
              <div class="title-detail" @click="toggle(item,'down')">
                <img class="icon" v-if="item.up" src="/static/img/la_up.png">
                <img class="icon" v-if="item.down" src="/static/img/la_down.png">
              </div>
            </div>
          </div>
          <div v-show="item.up" class="users">
            <div class="hr"></div>
            <div v-for="(info,i) in item.result" :key="i" class="usersItem">
              <img :src="info.photo">
              <p>{{info.name}}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div v-if="homeTo" style="height:40px"></div>
    <div v-if="homeTo" class="goBack" @click="goBack">
      <img class="img" src="/static/img/group/back.png" alt> 返回主页
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
      goodList: [],
      isGoLoginPage: false, //判断登录
      formId: "",
      getFormId: "",
      height: "", //屏幕高度
      width: "", //屏幕宽度
      isHaveData: false, //防止多次点击
      homeTo: true
    };
  },
  onLoad(param) {
    this.getFormId = param.formId;
    const value = wx.getStorageSync("systemInfo");
    this.height = value.windowHeight;
    this.width = value.windowWidth;
  },
  onShow(options) {
    if (this.$root.$mp.query.isShowGoBack == "false") {
      this.homeTo = false;
    } else {
      this.homeTo = true;
    }
    if (!this.loginCheck()) {
      wx.hideToast();
      return;
    }
    this.isHaveData = false;
    // 获取我的团队信息
    this.getMyGroup();
  },
  created() {},

  methods: {
    //从消息模板进入判断是否登录
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
    // 获取我的团队信息
    getMyGroup() {
      let url = path.queryMyTeam;
      let queryData = {
        userId: getLoginInfo().userid,
        formId: this.getFormId
      };
      let promises = this.$fly.get(url, queryData);
      showLoading(promises);
      promises
        .then(data => {
          if (data && data.length > 0) {
            data.map(item => {
              item.up = false;
              item.down = true;
            });
            this.goodList = data;
          } else if (data && data.length == 0) {
            this.isHaveData = true;
          } else {
            apiFail(e);
          }
        })
        .catch(e => {
          apiFail(e);
        });
    },

    toggle(good) {
      if (good.up == true) {
        good.up = false;
        good.down = true;
      } else {
        good.up = true;
        good.down = false;
      }
    },
    look(resValue) {
      console.log(resValue);
      if (resValue.isPrizeWinning == 4) {
        //查看组队详情
        wx.navigateTo({
          url: `/pages/active/group/giftItem/main?teamId=${
            resValue.teamId
          }&formId=${this.formId}`,
          fail: res => {
            wx.reLaunch({
              url: "/pages/active/group/main"
            });
          }
        });
      } else if (resValue.isPrizeWinning == 1) {
        //已中奖
        wx.navigateTo({
          url: `/pages/active/group/myGift/main?formId=${this.formId}`,
          fail: res => {
            wx.reLaunch({
              url: "/pages/active/group/main"
            });
          }
        });
      }
    },
    //获取FormID
    getFormID: function(e) {
      this.formId = e.mp.detail.formId;
      console.log(this.formId);
    },
    goBack() {
      console.log("出发");
      wx.switchTab({
        url: "/pages/home/main",
        fail: res => {
          console.log(res);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.bigbox {
  position: absolute;
  width: 100%;
  background: #f2f3f5;
}

.box {
  width: 92%;
  margin: 0.2rem auto;
  .nullImg {
    width: 3rem;
    height: 2rem;
    display: block;
    margin: 0 auto;
    margin-top: 3rem;
  }
  .nullTxt {
    width: 50%;
    margin: 0 auto;
    margin-top: 0.5rem;
    text-align: center;
    color: rgba(208, 208, 208, 1);
    font-size: 0.3rem;
  }
  li {
    width: 100%;
    position: relative;
    margin: 0.2rem auto;
    background: #ffffff;
    border-radius: 0.1rem;

    .teamIndex {
      display: flex;
      justify-content: space-between;
      font-size: 0.28rem;

      .goodImg {
        width: 20%;
        margin: 0.3rem 0.2rem;
        border: 0.01rem solid #000;

        .img {
          width: 100%;
          height: 100%;
          background-repeat: no-repeat;
          background-size: 100% 75%;
          position: relative;
          overflow: hidden;

          p {
            font-size: 0.2rem;
            width: 100%;
            height: 40rpx;
            line-height: 40rpx;
            text-align: center;
            position: absolute;
            left: 0;
            bottom: 0;
            background: #000;
            color: #fff;
          }
        }
      }

      .mid {
        width: 30%;
        margin: 0.3rem 0.1rem;
        font-weight: 600;

        .myOpen {
          background: #ffb643;
          border-radius: 0.5rem 0.1rem 0.5rem 0.1rem;
          text-align: center;
          color: #fff;
          width: 90%;
        }

        .myJoin {
          background: #66c968;
          border-radius: 0.5rem 0.1rem 0.5rem 0.1rem;
          text-align: center;
          color: #fff;
        }
        h1 {
          color: rgba(216, 182, 85, 1);
          font-size: 0.26rem;
          margin-top: 0.2rem;
        }
        .joinMen {
          margin-top: 0.22rem;

          span {
            color: red;
          }
        }
      }

      .title {
        width: 40%;
        margin: 0.3rem 0.2rem;
        height: 1rem;
        text-align: right;

        button {
          width: 70%;
          height: 50%;
          padding: 0;
          background: #000;
          color: #fff;
          font-size: 0.28rem;
          line-height: 0.48rem;
          text-align: center;
          margin-right: 0;
        }

        span {
          width: 100%;
          height: 50%;
          padding: 0;
          color: #999;
          font-size: 0.28rem;
          line-height: 0.48rem;
          img{
            width: 173rpx;
            height: 115rpx;
            position: absolute;
            right: 70rpx;
            top: 70rpx;
            z-index: 99;
          }
        }

        .title-detail {
          display: inline-block;
          padding-left: 1.28rem;
          font-size: 0.88rem;
          font-weight: 900;
          position: relative;
          width: 100%;
          box-sizing: border-box;

          .icon {
            width: 0.3rem;
            height: 0.16rem;
            position: relative;
            top: 20%;
            -webkit-transform: translateY(-50%);
          }
        }
      }
    }

    .users {
      width: 90%;
      margin: auto;

      .hr {
        width: 100%;
        border: 0.01rem solid #eee;
      }

      .usersItem {
        width: 16%;
        display: inline-block;
        margin: 0.2rem 0.1rem;
        text-align: center;
        font-size: 0.2rem;

        img {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
          display: block;
          border: 0.01rem solid black;
          margin: 0 auto;
        }

        p {
          margin-top: 10rpx;
          font-size: 22rpx;
          color: #000000;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .users-icon-up {
      display: block;
      width: 15%;
    }

    .users-icon-down {
      display: block;
      width: 15%;
    }
  }
}
.goBack {
  width: 100%;
  height: 98rpx;
  position: fixed;
  left: 0;
  bottom: 0;
  border-top: 2rpx solid #dddddd;
  box-shadow: 0 0 10px rgb(190, 189, 189);
  line-height: 98rpx;
  text-align: center;
  color: #333333;
  font-size: 36rpx;
  background-color: #fff;

  .img {
    width: 28rpx;
    height: 24rpx;
  }
}
</style>
