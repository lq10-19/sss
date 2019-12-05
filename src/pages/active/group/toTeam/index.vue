<template>
  <div class="bigbox" :style="{'min-height':height+50+'px'}">
    <div class="box" v-if="isHaveData">
      <img class="nullImg" src="/static/img/group/wu@2x.png">
      <p class="nullTxt">暂时没有信息~</p>
    </div>
    <div class="box">
      <ul>
        <li v-for="(item,index) in goodList" :key="index">
          <div class="teamIndex">
            <div class="goodImg">
              <!-- <div class="img" :style="{backgroundImage: 'url(' + item.awardImage[0].httpUrl + ')'}"> -->
              <div class="img" :style="{backgroundImage: 'url(' + item.ongImg + ')'}">
                <p>{{item.openCondition}}人成团</p>
              </div>
            </div>
            <div class="mid">
              <p class="time">{{item.firstAwardTime}}&nbsp;{{item.openAwardTime}}开奖</p>
              <h1>{{item.awardName}}</h1>
              <p class="joinMen">已有
                <span>{{item.teamNumber}}</span>
                人参团</p>
            </div>
            <div class="title">
              <form report-submit @submit="getFormID">
                <button @click="join(item)" form-type="submit" plain>参团抽奖</button>
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
        formId: null,
        getFormId: '',
        height: 500, //屏幕高度
        isHaveData: false
      };
    },
    onLoad(param) {
      this.getFormId = param.formId;
      const value = wx.getStorageSync("systemInfo");
      this.height = value.windowHeight;
      this.width = value.windowWidth;
    },
    onShow() {
      this.isHaveData = false;
      // 获取团队信息
      this.getGroupList();
    },
    created() {},

    methods: {
      // 获取团队信息
      getGroupList() {
        let url = path.queryTeam;
        let queryData = {
          userId: getLoginInfo().userid,
          formId: this.getFormId
        };
        let promises = this.$fly.post(url, queryData);
        showLoading(promises);
        promises
          .then(data => {
            if (data && data.length > 0) {
              data.map(item => {
                item.up = false;
                item.down = true;
              })
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
        if (good.up === true) {
          good.up = false;
          good.down = true;
        } else {
          good.up = true;
          good.down = false;
        }
      },
      //获取FormID
      getFormID: function (e) {
        this.formId = e.mp.detail.formId;
        console.log(this.formId);
      },
      join(item) {
        console.log(item)
        let title = `你确定参团 ${item.awardName} 的抽奖`
        const _this = this;
        wx.showModal({
          title: '提示',
          content: title,
          success(res) {
            if (res.confirm) {
              const url = path.insertTeam;
              let queryData = {
                teamUserId: getLoginInfo().userid,
                teamId: item.teamId,
                fromId: _this.formId
              }
              let promises = _this.$fly.post(url, queryData);
              promises
                .then(data => {
                  console.log(data, 77)
                  if (data == 'yes'||data == 'ok') {
                    _this.showConfirm()
                  } else {
                    _this.showCancel()
                  }
                })
                .catch(e => {
                  apiFail(e);
                });
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
      showConfirm() {
        //组团抽奖活动参与人数埋点
        getApp().aldstat.sendEvent(event["group.active.join"]);
        //参团成功
        wx.showModal({
          title: '',
          content: '参加抽奖成功！',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              wx.redirectTo({
                url: "/pages/active/group/myTeam/main?isShowGoBack=false",
                fail: (res) => {
                  wx.reLaunch({
                    url: "/pages/active/group/main"
                  });
                }
              });
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
      showCancel() {
        wx.showModal({
          title: '',
          content: '该团已满，请选择其他团参团抽奖！',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.redirectTo({
                url: "/pages/active/group/toTeam/main",
                fail: (res) => {
                  wx.reLaunch({
                    url: "/pages/active/group/toTeam/main"
                  });
                }
              });
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    }
  }

</script>

<style lang="scss" scoped>
  .bigbox {
    position: absolute;
    width: 100%;
    background: #F2F3F5;
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
      color:rgba(208, 208, 208, 1);
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
              font-size: 0.20rem;
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
          width: 40%;
          margin: 0.3rem 0.1rem;
          font-weight: 600;
          h1{
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
          width: 25%;
          margin: 0.3rem 0.2rem;
          height: 1rem;

          button {
            width: 100%;
            height: 60%;
            padding: 0;
            background: #000;
            color: #fff;
            font-size: 0.28rem;
            line-height: 0.54rem;
            text-align: center;
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

</style>
