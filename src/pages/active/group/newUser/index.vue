<template>
  <div class="product-detail">
    <div class="rule" @click="goRule">&nbsp;&nbsp;活动规则</div>
    <div class="title-banner">
      <swiper
        class="swiper"
        :circular="true"
        :vertical="true"
        :autoplay="true"
        :interval="2000"
        :duration="500"
      >
        <swiper-item v-for="item in titleBanner" :key="item.name">
          <p>{{item}}</p>
        </swiper-item>
      </swiper>
    </div>

    <div class="car-imgs" :style="{height:carImgsHeight}">
      <swiper
        :indicator-dots="true"
        class="swiper"
        :autoplay="true"
        :interval="3000"
        :duration="500"
        :circular="true"
      >
        <swiper-item v-for="item in groupBuyingList.awardImage" :key="item.objectId">
          <img
            :src="item.httpUrl"
            v-bind:style="{ width: carPicStyle.width, height: carPicStyle.height}"
          >
        </swiper-item>
      </swiper>
    </div>
    <div class="notice">
      当前已有
      <span class="title">{{groupBuyingList.haveOpenTeam}}</span>个团获得了抽奖机会！
    </div>
    <div>
      <!-- <div class="rules">
        <p class="title">中奖规则</p>
        <ul class="ul">
          <li>1、截至开奖时间，本款产品满{{groupBuyingList.openCondition}}个团即可开奖；</li>
          <li v-if="groupBuyingList.awardMode=='a'">2、奖品分配方式：开奖后在满员团中随机抽取1人中奖；</li>
          <li v-if="groupBuyingList.awardMode=='b'">2、奖品分配方式：开奖后在满员团中随机抽取1个团全体中奖；</li>
          <li>3、奖品将在本次活动结束后7个工作日内发出；</li>
          <li>4、每款产品可以重复开团，开团数越多中奖概率越高。</li>
        </ul>
      </div> -->
      <!-- 隔开 -->
      <!-- <div class="crossBar"></div> -->

      <div class="Offered">
        <!-- 好友点击参团 -->
        <div v-if="!myTeam">
          <div v-if="groupBuyingList.isFull=='0'&&isSuccess=='yes'">
            <p class="title">参团成功！坐等开奖</p>
            <button
              class="btn"
              @click="goInvitation"
              :disabled="status"
              :class="{stopTxt:status}"
            >邀请好友一起抽大奖</button>
          </div>
          <div v-else-if="isSuccess=='ok'">
            <p class="title">参团成功！本团已满员！</p>
            <div class="btn">
              <form report-submit @submit="getFormID">
                <button
                  @click="goMyOpen"
                  form-type="submit"
                  plain
                  :disabled="status"
                  :class="{stopTxt:status}"
                >继续开团</button>
              </form>
            </div>
          </div>
          <div v-else-if="groupBuyingList.isFull=='0'&&isSuccess!='yes'">
            <p class="title">我正在参加佰仟易行免费抽大奖的活动 邀你参团一起抽大奖！</p>
            <div class="btn">
              <form report-submit @submit="getFormID">
                <button
                  @click="quickGoTeam"
                  form-type="submit"
                  plain
                  :disabled="status"
                  :class="{stopTxt:status}"
                >立即参团</button>
              </form>
            </div>
          </div>

          <div v-else-if="groupBuyingList.isFull=='1'||isSuccess=='no'">
            <p class="title">
              来迟一步！
              <br>
              已有{{groupBuyingList.teamNumber}}人参团 本团已满员！
            </p>
            <div class="btn">
              <form report-submit @submit="getFormID">
                <button
                  @click="goMyOpen"
                  form-type="submit"
                  plain
                  :disabled="status"
                  :class="{stopTxt:status}"
                >我来开团</button>
              </form>
            </div>
          </div>
        </div>
        <!-- 自己点开查看团队信息 -->
        <div v-if="myTeam">
          <div v-if="groupBuyingList.isFull=='0'">
            <p
              class="title"
            >已有{{groupBuyingList.teamNumber}}人参团 还差{{groupBuyingList.disparityNumber}}人成团！</p>
            <button
              class="btn"
              @click="goInvitation"
              :disabled="status"
              :class="{stopTxt:status}"
            >邀请好友参团</button>
          </div>
          <div v-if="groupBuyingList.isFull=='1'">
            <p class="title">已有{{groupBuyingList.teamNumber}}人参团 本团已满员！</p>
            <div class="btn">
              <form report-submit @submit="getFormID">
                <button
                  @click="goMyOpen"
                  form-type="submit"
                  plain
                  :disabled="status"
                  :class="{stopTxt:status}"
                >重新开团</button>
              </form>
            </div>
          </div>
        </div>
        <p
          v-show="!myTeam"
          class="title"
        >已有{{groupBuyingList.teamNumber}}人参团，还差{{groupBuyingList.disparityNumber}}人成团</p>
        <div class="head">
          <ul class="ul">
            <li class="imgLi" v-for="(item,index) in groupBuyingList.result" :key="index">
              <img :src="item.photo">
              <span>{{item.name}}</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 中奖规则开关 -->
      <div class="ruleFlag" @click="openRule">
        <img src="../../../../../static/icon/up@2x.png" :class="{rotate:rulesFlag}">
      </div>
      <!-- 隔开 -->
      <div class="crossBar" v-if="rulesFlag"></div>
      <div class="rules" v-if="rulesFlag">
        <p class="title">中奖规则</p>
        <ul class="ul">
          <li>1、截至开奖时间，本款产品满{{groupBuyingList.openCondition}}个团即可开奖；</li>
          <li v-if="groupBuyingList.awardMode=='a'">2、奖品分配方式：开奖后在满员团中随机抽取1人中奖；</li>
          <li v-if="groupBuyingList.awardMode=='b'">2、奖品分配方式：开奖后在满员团中随机抽取1个团全体中奖；</li>
          <li>3、奖品将在本次活动结束后7个工作日内发出；</li>
          <li>4、每款产品可以重复开团，开团数越多中奖概率越高。</li>
        </ul>
      </div>
    </div>
    <!-- 隔开 -->
    <div class="crossBar"></div>
    <!-- 隔开 -->
    <div class="prize">
      <p class="title" v-if="!myTeam">选择奖品自己开团</p>
      <p class="title" v-if="myTeam">更多奖品</p>
      <div class="prizeImg">
        <ul>
          <li v-for="(item,index) in goodsList" :key="index">
            <div class="box">
              <div class="top">
                <img :src="item.ongImg" alt>
              </div>
              <div class="middle">
                <p class="m_one">{{item.firstAwardTime}}&nbsp;{{item.openAwardTime}}开奖</p>
                <p class="m_two" v-if="item.awardFrequency === 'a'">(该奖品于{{item.firstAwardTime}}{{item.openAwardTime}}开奖)</p>
                <p class="m_two"  v-else-if="item.awardFrequency === 'b'">(每24小时开奖一次)</p>
                <p class="m_two" v-else-if="item.awardFrequency === 'c'">(每48小时开奖一次)</p>
              </div>
              <div class="bottom">
                <p>【{{item.teamLimit}}人团】{{item.awardName}}</p>
                <form report-submit @submit="getFormID" class="joinBtn">
                  <button
                    class="btn"
                    @click="giftItem(item)"
                    v-if="item.timeOut=='1'"
                    form-type="submit"
                    :disabled="status||item.timeOut=='1'"
                    :class="{stopBtn:status||item.timeOut=='1'}"
                  >已结束</button>
                  <button
                    class="btn"
                    @click="giftItem(item)"
                    v-if="!item.secondInfo&&item.timeOut=='2'"
                    :disabled="status"
                    :class="{stopBtn:status}"
                    form-type="submit"
                  >开团抽奖</button>
                  <button
                    class="btn"
                    @click="giftItem(item)"
                    v-if="item.secondInfo&&item.timeOut=='2'"
                    form-type="submit"
                    :disabled="status"
                    :class="{stopBtn:status}"
                  >组团中</button>
                </form>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div style="height:40px"></div>
    <div class="goBack" @click="goBack">
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
  data() {
    return {
      teamId: "",
      myTeam: true, //自己点开分享链接
      titleBanner: [], //气泡列表
      goodsList: [], //所有奖品列表
      groupBuyingList: [], //团信息列表
      carPicStyle: {
        width: "",
        height: ""
      },
      carImgsHeight: "250px",
      isSuccess: null, //参团是否成功
      formId: "",
      flag: false, //防止重复点击
      userId: "",
      aidUserId: "",
      status: true, //活动状态
      rulesFlag: false, //默认规则不显示
      awardId: "", //奖品id
    };
  },
  onLoad(query) {
    //组团抽奖活动埋点
    getApp().aldstat.sendEvent(event["group.active"]);
    this.awardId = query.awardId
  },
  onShow() {
    if (!getLoginInfo()) {
      const url = "/pages/login/main";
      wx.navigateTo({
        url
      });
      return;
    }
    this.userId = getLoginInfo().userid;
    this.flag = false;
    let systemInfo = getSystemInfo();
    // console.log(getSystemInfo(), 111);
    let width = systemInfo.windowWidth;
    let height = systemInfo.windowHeight;
    this.carPicStyle.width = "100%";
    this.carPicStyle.height = width / 4 * 3 + "px";
    this.carImgsHeight = width / 4 * 3 + "px";
    
    //获取团详情
    let p1 = this.getGroupInfo();
    //获取全部奖品
    let p2 = this.queryPzizeList();
    //获取活动状态
    let p3 = this.queryActivityStatus();
    // Promise.all([p1, p2, p3]).then(() => {
    //   this.$nextTick().then(() => {
    //     setTimeout(() => {
    //       wx.pageScrollTo({
    //         scrollTop: this.height*0.5
    //         // duration: 300
    //       });
    //     }, 500);
    //   });
    // });
    //判断userId
    if (getLoginInfo().userid == this.$root.$mp.query.userId) {
      console.log("自己打开");
      this.myTeam = true;
    } else {
      console.log("别人打开");
      this.myTeam = false;
      //保存新用户id
      this.aidUserId = this.$root.$mp.query.userId;
    }
  },
  onReady() {},
  onUnload() {
    this.myTeam = true; //自己点开分享链接
    this.titleBanner = []; //气泡列表
    this.goodsList = []; //所有奖品列表
    this.groupBuyingList = []; //团信息列表
    this.isSuccess = null; //参团是否成功
  },
  methods: {
    //获取活动状态
    queryActivityStatus() {
      let url = path.allActivity;
      let promises = this.$fly.get(url);
      promises
        .then(data => {
          console.log(data, 11);
          if (data && data.length > 0) {
            this.imgData = data;
            for (let elem of data) {
              if (elem.activityName == "组队抽奖活动") {
                //组团抽奖活动状态（A:未开始 B:进行中 C:已结束）
                if (elem.status == "B") {
                  this.status = false;
                }
              }
            }
          } else {
            wx.showModal({
              title: "",
              content: "不在活动参与时间内！",
              showCancel: false
            });
            return;
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
    },
    //获取商品信息
    queryPzizeList() {
      let url = path.queryPzizeList;
      let params = Object.assign({}, this.$root.$mp.query, {
        userId: getLoginInfo().userid
      });
      let promises = this.$fly.get(url, params);
      showLoading(promises);
      promises
        .then(data => {
          console.log(data, 22);
          this.goodsList = data;
          this.titleBanner = [...data[0].teamLimitTen, ...data[0].winLimitFive];
        })
        .catch(e => {
          apiFail(e);
        });
      return promises;
    },
    // 获取团详情
    getGroupInfo() {
      let url = path.queryOneTeamDetails;
      let params = Object.assign({}, this.$root.$mp.query, {
        userId: getLoginInfo().userid
      });
      let promises = this.$fly.get(url, params);
      showLoading(promises);
      promises
        .then(data => {
          wx.hideLoading();
          this.groupBuyingList = data;
          this.teamId = data.teamId;
          //模拟空缺组团人
          for(let i=0;i<this.groupBuyingList.disparityNumber*1;i++){
            let robot = {photo:'../../../../../static/img/mylogo.png',name:" "};
            this.groupBuyingList.result.push(robot);
          }
        })
        .catch(e => {
          wx.hideLoading();
          apiFail(e);
        });
      return promises;
    },
    //活动规则开关
    openRule() {
      this.rulesFlag = !this.rulesFlag;
    },
    //活动规则
    goRule() {
      wx.navigateTo({
        url: "/pages/active/group/rule/main",
        fail: res => {
          wx.redirectTo({
            url: "/pages/active/group/rule/main"
          });
        }
      });
    },

    // 邀请好友
    goInvitation() {
      wx.navigateTo({
        url: `/pages/active/group/giftItem/main?teamId=${this.teamId}`,
        fail: res => {
          wx.redirectTo({
            url: "/pages/active/group/main"
          });
        }
      });
    },
    // 开团抽奖
    giftItem(restem) {
      //console.log(restem)
      if (this.flag) return;
      if (restem.secondInfo) {
        this.flag = true;
        let url = "/pages/active/group/giftItem/main";
        url =
          url +
          `?teamId=${restem.secondInfo}` +
          `&formId=${this.formId}` +
          `&userId=${this.userId}` +
          `&teamCreateName=${getLoginInfo().nickname}` +
          `&teamCreatePhoto=${getLoginInfo().avatarurl}`;
        wx.navigateTo({
          url,
          fail: res => {
            wx.reLaunch({
              url: "/pages/active/group/main"
            });
          }
        });
      } else {
        //console.log(restem.awardId,909)
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
            url =
              url +
              `?teamId=${data}` +
              `&formId=${this.formId}` +
              `&userId=${this.userId}` +
              `&teamCreateName=${getLoginInfo().nickname}` +
              `&teamCreatePhoto=${getLoginInfo().avatarurl}`;
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
    //获得FormID
    getFormID: function(e) {
      this.formId = e.mp.detail.formId;
      console.log(this.formId);
    },
    //立即参团
    quickGoTeam() {
      //组团抽奖活动参与人数埋点
      getApp().aldstat.sendEvent(event["group.active.join"]);
      wx.showLoading({
        title: "加入中...",
        mask: true
      });
      if (this.flag) return;
      console.log(this.$root.$mp.query, 11);
      // wx.showToast({
      //   title: "teamId:" + this.$root.$mp.query.teamId,
      //   icon: "none"
      // });
      // return
      let url = path.insertTeam;
      let queryData = Object.assign(
        {},
        {
          teamUserId: getLoginInfo().userid,
          teamId: this.$root.$mp.query.teamId,
          formId: this.formId
        }
      );
      this.flag = true;
      let promises = this.$fly.post(url, queryData);
      promises
        .then(data => {
          // 点击参团  重新获取数据  (参团成功人员未满yes；参团成功刚好满员ok；参团未成功no)
          this.flag = false;
          if (data == "yes") {
            this.isSuccess = "yes";
            this.getGroupInfo();
            //统计拉新
            this.insertNewUser(this.userId, this.aidUserId, 1);
          } else if (data == "no") {
            this.isSuccess = "no";
            this.getGroupInfo();
            this.insertNewUser(this.userId, this.aidUserId, 0);
          } else if (data == "ok") {
            this.isSuccess = "ok";
            this.getGroupInfo();
            this.insertNewUser(this.userId, this.aidUserId, 1);
          } else if (data == "oldUser") {
            wx.showToast({
              title: "您是老用户,不可参与新团,已为您成功开团",
              icon: "none"
            });
            //跳转到自动开团页
            let url = path.isertCreateTeam;
            let queryData = {
              teamCreateId: this.userId,
              formId: this.formId,
              teamCreateName: getLoginInfo().nickname,
              teamCreatePhoto: getLoginInfo().avatarurl,
              awardId: this.awardId
            };
            this.flag = true;
            let promises = this.$fly.post(url, queryData);
            promises
              .then(data => {
                //获得teamId
                //console.log(data,987);
                this.flag = false;
                let url = "/pages/active/group/giftItem/main";
                url =
                  url +
                  `?teamId=${data}` +
                  `&formId=${this.formId}` +
                  `&userId=${this.userId}` +
                  `&teamCreateName=${getLoginInfo().nickname}` +
                  `&teamCreatePhoto=${getLoginInfo().avatarurl}`;
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
                //apiFail(e);
                console.log(e)
                let url = "/pages/active/group/giftItem/main";
                url =
                  url +
                  `?teamId=${e.data.data.teamId}` +
                  `&formId=${this.formId}` +
                  `&userId=${this.userId}` +
                  `&teamCreateName=${getLoginInfo().nickname}` +
                  `&teamCreatePhoto=${getLoginInfo().avatarurl}`;
                wx.navigateTo({
                  url,
                  fail: res => {
                    wx.reLaunch({
                      url: "/pages/active/group/main"
                    });
                  }
                });
              });
          }
        })
        .catch(e => {
          wx.hideLoading();
          this.flag = false;
          apiFail(e);
        });
    },
    // 我来开团、重新开团、继续开团
    goMyOpen() {
      wx.navigateTo({
        url: `/pages/active/group/openGroup/main?formId=${this.formId}`,
        fail: res => {
          wx.redirectTo({
            url: "/pages/active/group/main"
          });
        }
      });
    },
    //拉新用户保存记录(isInviteSuccess:1、拉取到新用户并参团成功;0、拉取到新用户因团满员未参团成功)
    insertNewUser(userId,aidUserId,isInviteSuccess) {
      let url = path.insertNewUser;
      let queryData = {
        userId,
        aidUserId,
        isInviteSuccess
      };
      let promises = this.$fly.post(url, queryData);
      promises
        .then(data => {
          console.log("12345:"+ data)
        })
        .catch(e => {
          apiFail(e);
        });
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
$jbColorTop: rgba(255, 224, 86, 1);
$jbColorBottom: #ffcc00;

.product-detail {
  background-color: #ffffff;
  width: 100%;
  font-size: 36rpx;
  overflow: hidden;
  position: relative;
}

.title-banner {
  position: absolute;
  width: 76%;
  top: 0.12rem;
  left: 12%;
  z-index: 3;

  .swiper {
    width: 100%;
    height: 50rpx;
    border-radius: 25rpx;
    background-color: rgba(200,200,200,0.7);

    p {
      height: 100%;
      width: 100%;
      text-align: center;
      line-height: 50rpx;
      font-size: 28rpx;
      color: #000;
    }
  }
}

.rule {
  width: 1.46rem;
  height: 0.48rem;
  position: absolute;
  right: -0.2rem;
  top: 1.2rem;
  font-size: 0.26rem;
  line-height: 0.48rem;
  background: #fff;
  border: 3rpx solid #6c5f3f;
  border-radius: 0.5rem;
  color: #000;
  z-index: 2;
}

.car-imgs {
  .swiper {
    height: 100%;

    img {
      display: block;
      margin: auto;
    }
  }
}

.notice {
  width: 100%;
  background-color: #000000;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  color: #ffffff;
  font-size: 28rpx;

  .title {
    color: red;
  }
}
.ruleFlag{
  width: 116rpx;
  height: 58rpx;
  background: rgba(0,0,0,1);
  opacity: 0.6;
  margin: 0 auto;
  border-radius: 58rpx 58rpx 0 0;
  img{
    height: 19rpx;
    width: 34rpx;
    margin-left: 41rpx;
    display: inline-block;
  }
  .rotate{
    transform:rotate(180deg);
  }
}
.rules {
  padding: 4% 0;
  width: 100%;

  .title {
    width: 100%;
    text-align: center;
    height: 60rpx;
    line-height: 60rpx;
    color: #000000;
    font-size: 36rpx;
    font-weight: 700;
  }

  .ul {
    padding: 0.2rem 0.4rem;

    li {
      list-style: none;
      display: inline-block;
      color: #000000;
      font-size: 28rpx;
    }
  }
}

.crossBar {
  width: 100%;
  height: 20rpx;
  background-color: #f2f3f5;
}

.Offered {
  .title {
    padding: 70rpx;
    padding-bottom: 30rpx;
    color: #000000;
    font-size: 36rpx;
    text-align: center;
    font-weight: 700;
  }

  .btn {
    width: 600rpx;
    height: 96rpx;
    margin: 0 auto;
    background: url("../../../../../static/img/group/btn_b@2x.png") no-repeat;
    background-size: cover;
    line-height: 96rpx;
    text-align: center;
    color: #000;
    font-size: 36rpx;
    button {
      border: transparent;
    }
  }
  .stopTxt {
    color: #b2b2b2;
  }
  .head {
    width: 100%;
    padding-top: 40rpx;

    .ul {
      //padding: 0 8%;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 28rpx;
      justify-content: space-around;
      .imgLi {
        list-style: none;
        color: #000000;
        text-align: center;
        margin: 10rpx 0;
        max-width: 150rpx;
        img {
          display: inline-block;
          width: 100rpx;
          height: 100rpx;
          border-radius: 50%;
          border: 1rpx solid RGBA(230, 230, 230, 1);
          // background: red;
        }

        span {
          display: inline-block;
          width: 150rpx;
          color: #000;
          font-size: 28rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}

.prize {
  > .title {
    width: 100%;
    text-align: center;
    color: #000;
    font-size: 36rpx;
    font-weight: 700;
    margin: 40rpx 0;
  }

  .prizeImg {
    width: 100%;

    ul {
      /* width: 100%; */
      padding: 0 4%;

      li {
        width: 50%;
        list-style: none;
        display: inline-block;
        margin-bottom: 32rpx;

        .box {
          margin: 0 auto;
          min-height: 80rpx;
          width: 320rpx;
          border: 2rpx solid #bc996f;

          .top {
            width: 100%;
            height: 320rpx;
            /* display: flex;
              align-items: center;
              justify-content: center; */

            img {
              width: 100%;
              height: 100%;
              // background: red;
            }
          }
          .middle {
            width: 100%;
            height: 64rpx;
            font-size: 22rpx;
            background: linear-gradient(#b39c73, #dcc7aa);
            text-indent: 18rpx;
            .m_two {
              color: #ff3c3c;
            }
          }
          .bottom {
            width: 100%;
            height: 128rpx;
            background: linear-gradient(#ceb28a, #ba996c);
            p {
              color: #000;
              font-size: 24rpx;
              line-height: 36rpx;
              height: 60rpx;
              word-break:break-all;
            }
            .btn {
              padding: 0;
              width: 160rpx;
              height: 42rpx;
              margin: 0 auto;
              margin-top: 20rpx;
              line-height: 42rpx;
              font-size: 26rpx;
              text-align: center;
              background-color: #000;
              color: #ffffff;
            }
            .stopBtn {
              background-color: #b2b2b2;
            }
          }
        }
      }
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
