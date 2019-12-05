<template>
  <div :style="{'min-height':height+50+'px'}" class="bgc">
    <div class="bigbox" v-if="isHaveData">
      <img class="nullImg" src="/static/img/group/wu@2x.png">
      <p class="nullTxt">暂时没有信息~</p>
    </div>
    <div class="bigbox">
      <div class="box" v-for="(item,index) in goods" :key="index">
        <div class="goodImg">
          <img :src="item.ongImg">
        </div>
        <div class="message">
          <div class="top">
            <h1>{{item.awardName}}</h1>
            <span :class="{ready:item.state==1}" v-if="item.state==1">待填写地址</span>
            <span v-if="item.state==2">待发货</span>
            <span v-if="item.state==3">已发货</span>
            <span v-if="item.state==4">已收货</span>
            <p>数量：{{item.prizeTotal}}</p>
          </div>
          <div class="bottom">
            <div class="but" v-if="item.state==1">
              <button plain @click="toAddress(index)">填写收货地址</button>
            </div>
            <div class="address" v-else>
              <p>收件人姓名：{{item.name}}</p>
              <p>手机号码：{{item.phone}}</p>
              <p>收货地址：{{item.detailedAddress}}</p>
            </div>
          </div>
        </div>
        <!-- 蒙版弹窗 -->
        <div v-if="item.openClose==2" class="mark" :style="{height:height+'px',width:width+'px'}">
          <div class="boxs">
            <div class="title">
              <p>填写收货地址</p>
            </div>
            <div @submit="formSubmit" class="section">
              <view class="section-1">
                <view class="section-name">收货人姓名：</view>
                <input v-model="msg.name" class="nameInput" placeholder="请输入收货人姓名">
              </view>
              <view class="section-2">
                <view class="section-phone" type="number">手机号码：</view>
                <input v-model="msg.phone" class="phoneInput" placeholder="请输入手机号码">
              </view>
              <view class="section-3">
                <view class="tui-picker-name">收货省市:</view>
                <picker @change="changeRegin" mode="region" :value="msg.city" @cancel="cancel">
                  <view @click="changeIcon" class="tui-picker-detail">
                    {{msg.city[0]}} - {{msg.city[1]}} -
                    {{msg.city[2]}}
                    <span
                      :animation="animationData"
                    ></span>
                  </view>
                </picker>
              </view>
              <view class="section-4">
                <view class="section-address">详细地址：</view>
                <input v-model="msg.address" class="addressInput" placeholder="请输入详细地址">
              </view>
              <view class="btn-area">
                <button plain @click="formSubmit(msg,index)" hover-stop-propagation="true">确定</button>
              </view>
            </div>
          </div>
        </div>
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
import { fail } from "assert";
export default {
  components: {},
  data() {
    return {
      msg: {
        name: "",
        phone: "",
        city: ["广东省", "广州市", "珠海区"],
        address: ""
      },
      goods: [],
      height: "", //屏幕高度
      width: "", //屏幕宽度
      down: false, //选择城市提示图标样式
      animationData: {}, //动画
      isGoLoginPage: false, //判断登录开关
      getFormId: "",
      isHaveData: false
    };
  },
  onLoad(param) {
    // const value = wx.getStorageSync("systemInfo");
    // console.log(value);
    // this.height = value.windowHeight;
    // this.width = value.windowWidth;
    this.getFormId = param.formId;
  },
  onShow() {
    const animation = wx.createAnimation({
      duration: 100,
      timingFunction: "ease"
    });
    this.animation = animation;
    this.isHaveData = false;
    this.animationData = animation.export();
    if (!this.loginCheck()) {
      wx.hideToast();
      return;
    }
    //通过userId获得用户获奖信息
    this.queryMyPrize();
  },
  onReady() {
    const value = wx.getStorageSync("systemInfo");
    console.log(value);
    this.height = value.windowHeight;
    this.width = value.windowWidth;
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
    //获取后台数据
    queryMyPrize() {
      let url = path.queryMyPrize;
      let userId = getLoginInfo().userid;
      let queryData = {
        userId,
        formId: this.getFormId
      };
      let promises = this.$fly.post(url, queryData);
      showLoading(promises);
      promises
        .then(data => {
          console.log(data, 111);
          if (data && data.length > 0) {
            this.goods = data;
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
    //添加地址
    toAddress(index) {
      console.log("事件对象：", index);
      this.goods.forEach(item => {
        item.openClose == 1;
      });
      this.goods[index].openClose = 2;
      console.log(this.goods[index].openClose);
    },
    //获取用户输入信息
    formSubmit(msg, index) {
      // console.log('数据为：', msg)
      // console.log('事件对象：', index)
      if (msg.name == "") {
        wx.showToast({
          title: "您还未输入姓名",
          icon: "none"
        });
      } else if (msg.phone == "") {
        wx.showToast({
          title: "您还未输入电话",
          icon: "none"
        });
      } else if (/^1\d{10}$/.test(msg.phone)==false) {
        wx.showToast({
          title: "您输入电话号码有误",
          icon: "none"
        });
      } else if (msg.address == "") {
        wx.showToast({
          title: "您还未输入详细地址",
          icon: "none"
        });
      } else {
        let message = this.goods[index];
        // message.name = msg.name;
        // message.phone = msg.phone;
        // message.detailedAddress = msg.city.join("") + msg.address;
        let url = path.updateDetailedAddress;
        let queryData = {
          prizeWinningId: message.prizeWinningId,
          name: msg.name,
          phone: msg.phone,
          detailedAddress: msg.city.join("") + msg.address
        };
        let promises = this.$fly.post(url, queryData);
        promises
          .then(data => {
            console.log(data, 222);
            message.name = data.name;
            message.phone = data.phone;
            message.detailedAddress = data.detailedAddress;
            message.openClose = data.openClose;
            message.state = data.state;

            //this.msg.name = "";
            // this.msg.phone = "";
            // this.msg.city = ["广东省", "广州市", "珠海区"];
            // this.msg.address = "";
            //this.msg = {};
          })
          .catch(e => {
            apiFail(e);
          });
        //初始化

        // this.goods.forEach(item => {
        //   item.openClose = 1;
        // });
        // //显示信息变为‘待发货’
        // this.goods[index].state = 2;
        wx.showToast({
          title: "添加成功",
          icon: "success"
        });
      }
    },
    changeIcon() {
      //this.down = true;
      this.animation.rotate(90).step();
      this.animationData = this.animation.export();
    },
    //获取用户选择省市
    changeRegin(e) {
      //console.log(e,666)
      this.msg.city = e.mp.detail.value;
      this.down = false;
      this.animation.rotate(0).step();
      this.animationData = this.animation.export();
    },
    cancel(e) {
      //console.log(e,777)
      this.animation.rotate(0).step();
      this.animationData = this.animation.export();
    }
  }
};
</script>

<style lang="scss" scoped>
.bgc {
  background: #f2f3f5;
  width: 100%;
}

.bigbox {
  position: absolute;
  width: 100%;
  font-size: 0.28rem;
  background: #f2f3f5;
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
}

.box {
  position: relative;
  width: 92%;
  margin: 0.24rem auto;
  background: #ffffff;
  border-radius: 0.15rem;
  overflow: hidden;
  display: flex;

  .goodImg {
    display: inline-block;
    margin: 0.3rem 0 0 0.3rem;
    width: 22%;

    img {
      display: inline-block;
      border: 0.01rem solid black;
      width: 1.4rem;
      height: 1.4rem;
    }
  }

  .message {
    width: 66%;
    display: inline-block;
    margin: 0.3rem 0 0 0.2rem;

    .top {
      position: relative;
      width: 100%;
      font-weight: 600;

      h1 {
        display: inline-block;
        width: 65%;
      }

      span {
        width: 35%;
        display: inline-block;
        position: relative;
        color: #999;
        text-align: right;
      }

      .ready {
        width: 35%;
        display: inline-block;
        position: relative;
        color: #ff3535;
        text-align: right;
      }

      p {
        font-size: 0.26rem;
        color: #999;
        margin-top: 0.15rem;
      }
    }

    .bottom {
      width: 100%;
      margin: 0.1rem 0 0.25rem 0;

      .but {
        button {
          font-size: 0.28rem;
          width: 2rem;
          height: 0.5rem;
          padding: 0;
          line-height: 0.5rem;
          margin: 0;
          background: #000;
          color: #fff;
        }
      }

      .address {
        font-size: 0.26rem;
        margin-top: 0.2rem;

        p {
          line-height: 0.52rem;
        }
      }
    }
  }

  //弹窗
  .mark {
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;

    .boxs {
      width: 80%;
      position: relative;
      top: 20%;
      left: 10%;
      z-index: 999;
      border-radius: 0.1rem;
      background: #f2f3f5;
      font-size: 0.36rem;
      line-height: 0.5rem;

      .title {
        position: relative;
        z-index: 999;
        width: 90%;
        margin: 0.2rem auto;
        text-align: center;
        font-weight: 600;
        padding-top: 0.2rem;
      }

      .section {
        position: relative;
        z-index: 999;
        width: 90%;
        margin: 0.2rem auto;
        font-size: 0.32rem;
        font-weight: 500;

        .section-1,
        .section-2,
        .section-3,
        .section-4 {
          margin: 0.02rem;
          background: #fff;
          margin: 0.05rem;
          padding: 0.1rem;
        }

        .section-3 {
          view {
            display: flex;
            justify-content: space-between;

            span {
              width: 0.25rem;
              height: 0.3rem;
              display: inline-block;
              background-image: url("../../../../../static/img/right_arrow.png");
              background-repeat: no-repeat;
              background-size: 100% 100%;
              margin-top: 0.1rem;
            }

            // .icon{
            //   width: 0.25rem;
            //   height: 0.3rem;
            //   display: inline-block;
            //   background-image: url("../../../../../static/img/right_arrow.png");
            //   background-repeat: no-repeat;
            //   background-size:100% 100%;
            //   margin-top: 0.1rem;
            //   transform: rotate(90deg);
            // }
          }
        }

        .btn-area {
          margin: 0.2rem 0.5rem;
          padding-bottom: 0.2rem;

          button {
            color: #fff;
            background: #000;
          }
        }
      }
    }
  }
}
</style>
