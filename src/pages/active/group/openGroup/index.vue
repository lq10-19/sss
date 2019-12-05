<template>
  <div class="open-Group-detail">
    <div class="Offered">
      <p class="title">选择一款奖品开团，邀请新用户参团， 团队满员并达到指定团数即可参与抽奖免费获得该款奖品！</p>
    </div>
    <!-- 隔开 -->
    <div class="prize">
      <div class="prizeImg">
        <ul>
          <li v-for="(item,index) in groupBuyingList" :key="index">
            <div class="box">
              <div class="top">
                <img :src="item.ongImg" alt="">
              </div>
              <div class="middle">
                <p class="m_one">{{item.firstAwardTime}}&nbsp;{{item.openAwardTime}}开奖</p>
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
        groupBuyingList: [],
        formId: '',
        flag: false, //防止重复点击
        userId: '',
        status: true //活动状态
      };
    },
    onLoad(query) {
      // //动态修改标题栏
      // let nickName = getLoginInfo().nickname;
      // wx.setNavigationBarTitle({
      //   title: `${nickName}@你帮忙拼团抽大奖！`
      // })
    },
    onShow() {
      this.queryPzizeList();
      this.flag = false;
      this.userId = getLoginInfo().userid;
      //获取活动状态
      this.queryActivityStatus();
    },
    onShareAppMessage() {
      console.log(this.productId);
      return {
        title: '佰仟易行',
        path: '/pages/productDetails/main?productId=' + this.productId,
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        }
      }
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
      },
      // 开团
      giftItem(restem) {
      //console.log(restem)
      if(this.flag) return;
      if (restem.secondInfo) {
        this.flag = true;
        let url = "/pages/active/group/giftItem/main";
        url = url + `?teamId=${restem.secondInfo}` + `&formId=${this.formId}` + `&userId=${this.userId}` + `&teamCreateName=${getLoginInfo().nickname}` + `&teamCreatePhoto=${getLoginInfo().avatarurl}`;
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
      //获得FormID
      getFormID: function (e) {
        this.formId = e.mp.detail.formId;
        console.log(this.formId);
      },
      //获取商品信息
      queryPzizeList() {
        let url = path.queryPzizeList;
        let params = Object.assign({}, 
        this.$root.$mp.query, {
          userId: getLoginInfo().userid
        });
        let promises = this.$fly.get(url,params);
        showLoading(promises);
        promises
          .then(data => {
            console.log(data);
            this.groupBuyingList = data;
          })
          .catch(e => {
            apiFail(e);
          });
      },
    }
  }

</script>

<style lang="scss" scoped>
  .open-Group-detail {
    background-color: #FFFFFF;
    width: 100%;
    font-size: 36rpx;
    position: relative;
  }


  .Offered {
    .title {
      padding: 70rpx;
      color: #000000;
      font-size: 36rpx;
      text-align: center;
      font-weight: 700;
    }

    .btn {
      width: 580rpx;
      height: 96rpx;
      margin: 0 auto;
      background: url("../../../../../static/img/group/btn_b@2x.png") no-repeat;
      background-size: cover;
      line-height: 96rpx;
      text-align: center;
      color: #000;
      font-size: 36rpx;
    }

    .head {
      width: 100%;

      .ul {
        padding: 0 8%;

        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 28rpx;

        .imgLi {
          list-style: none;
          color: #000000;
          width: 16.5%;
          text-align: center;
          margin: 10rpx 0;

          img {
            display: inline-block;
            width: 80rpx;
            height: 80rpx;
            border-radius: 50%;
            // background: red;
            border: 1rpx solid RGBA(230, 230, 230, 1);
          }

          span {
            display: inline-block;
            width: 100%;
            color: #000;
            font-size: 22rpx;

          }
        }
      }
    }
  }

  .prize {
    >.title {
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
            border: 2rpx solid #BC996F;

            .top {
              width: 100%;
              height: 320rpx;
              display: flex;
              align-items: center;
              justify-content: center;

              img {
                width: 100%;
                height: 100%;
                // background: red;
              }

            }

            .middle {
              width: 100%;
              height: 64rpx;
              line-height: 64rpx;
              font-size: 22rpx;
              background: linear-gradient(#B39C73, #DCC7AA);
              text-indent: 18rpx;


            }

            .bottom {
              width: 100%;
              height: 128rpx;
              background: linear-gradient(#CEB28A, #BA996C);

              p {
                color: #000;
                font-size: 24rpx;
                line-height: 36rpx;
                height: 60rpx;
                word-break:break-all;
              }

              button {
                padding: 0;
                width: 160rpx;
                height: 42rpx;
                margin: 0 auto;
                margin-top: 20rpx;
                line-height: 42rpx;
                font-size: 26rpx;
                text-align: center;
                background-color: #000;
                color: #FFFFFF;
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

</style>
