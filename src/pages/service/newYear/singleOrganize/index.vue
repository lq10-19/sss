<template>
  <div class="main">
    <img class="flower" src="http://bqyx-qiniu.bqrzzl.com/newyear/flower.png">
    <div class="zs-left zs"></div>
    <div class="zs-right zs"></div>
    <div class="content" :style="{'min-height': windowHeight+'rpx'}">
      <div class="title-box">
        <p>{{nickname}}给您拜年啦！</p>
        <p>祝您猪年行大运，财运亨通！</p>
      </div>
      <div class="form">
        <p class="label">打赏一下！</p>
        <ul class="select-moneny">
          <li :class="moneyIndex == 1?'selected':''" @click="selectedMoneny(1,1)">￥1</li>
          <li :class="moneyIndex == 2?'selected':''" @click="selectedMoneny(8.88,2)">￥8.88</li>
          <li :class="moneyIndex == 3?'selected':''" @click="selectedMoneny(58.88,3)">￥58.88</li>
          <li :class="moneyIndex == 4?'selected':''" @click="selectedMoneny(88.88,4)">￥88.88</li>
        </ul>
        <input class="money" placeholder="输入发放红包总额" v-model="money">
        <div class="btn-wrap">
          <div class="money-btn" @click="regBag">塞钱进红包</div>
        </div>
        <div class="btn-wrap">
          <div class="no-btn" @click="findOrganize">送上祝福</div>
        </div>
      </div>
      <div class="pb-1-box">
        <p class="title">新春闹事</p>
        <div class="ulbox">
          <ul>
            <li v-for="(item,index) in allListInfo" :key="index"><span>{{item.fromNickname}}</span>组团给<span>{{item.toNickname}}</span>拜年啦，祝{{item.greetingsValue}}</li>
            <li v-for="(item,index) in allListInfo" :key="index"><span>{{item.fromNickname}}</span>组团给<span>{{item.toNickname}}</span>拜年啦，祝{{item.greetingsValue}}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer">
      <img class="img" mode="widthFix" src="http://bqyx-qiniu.bqrzzl.com/newyear/footer-bg.png">
    </div>
  </div>
</template>
<script>
import { path, getLoginInfo, getSystemInfo, apiFail } from "@/utils/index";
import { setTimeout } from "timers";
export default {
  components: {},
  data() {
    return {
      isGoLoginPage: false,
      windowHeight: "",
      nickname: "",
      money: "",
      allListInfo: "",
      moneyIndex: 1
    };
  },
  onLoad(options) {
    wx.setStorageSync("organizeShareData", options);
    let shareData = wx.getStorageSync("organizeShareData");
    console.log(shareData);
    this.nickname = shareData.nickname;
    console.log("-----");
  },
  onShow() {
    if (!getLoginInfo() && !this.isGoLoginPage) {
      this.isGoLoginPage = true;
      const url = "/pages/login/main";
      wx.navigateTo({ url });
      return;
    } else {
      let shareData = wx.getStorageSync("organizeShareData");
      let loginInfo = getLoginInfo();
      let userid = loginInfo.userid;
      if(shareData.userId == userid){
        console.log('不能自己给自己拜年')
        wx.redirectTo({
          url: "/pages/service/newYear/main"
        });
        return false;
      }else{
        this.money = 1;
        this.getAllListInfo();
      }
    }
  },
  onReady() {
    let that = this;
    wx.getSystemInfo({
      success({ windowHeight }) {
        that.windowHeight = windowHeight * 2 - 60;
      }
    });
  },
  onShareAppMessage(params) {
    var newYearShareTitle = [
      '来组团拜年吧，新年一起旺旺旺！',
      '不是好友也能给他拜年？不信戳我',
      '创意拜年新方式，一起组队忒好玩！',
      '金猪贺岁，组队拜年领红包！',
      '新年红包大派送，猪年好运连连来',
      '迎新春、贺新年，组个团队来拜年',
      '2019好彩头 拜年就能领红包',
      '新春开门红 贺岁红包一起领',
      '咚咚锵 咚咚锵 红包来了 开！',
      '猪年行大运  红包拿不停',
      '你有一个新年红包  快拆开',
      '一大波组队拜年消息袭来，赶紧去试试吧'
    ];
    console.log(newYearShareTitle);
    var num=Math.floor(Math.random()*12);
    console.log(num)
    return {
      title: newYearShareTitle[num],
      imageUrl: 'http://bqyx-qiniu.bqrzzl.com/newyear/newYearBanner2.jpg',
      path: `/pages/service/newYear/main`
    };
  },
  methods: {
    findOrganize() {
      let url = path.saveGroupUserInfo;
      let loginInfo = getLoginInfo();
      let shareData = wx.getStorageSync("organizeShareData");
      if (!shareData.groupMainId) {
        console.error(shareData);
        wx.showToast({
          title: "shareData.groupMainId is " + shareData.groupMainId,
          icon: "none"
        });
        return;
      }
      let queryData = [
        {
          groupMainId: shareData.groupMainId,
          userId: loginInfo.userid,
          userType: "0",
          userStatus: "1"
        }
      ];
      let promises = this.$fly.post(url, queryData);
      promises 
        .then(data => {
          console.log(data);
          console.log('/*/*/*/*')
          console.log(shareData);
          wx.redirectTo({
            url: "/pages/service/newYear/singleOrganizeSuccess/main"
          });
          let url = path.sendNewYearInfo;
          let loginInfo = getLoginInfo();
          let queryData = {
            "fromUserId": shareData.userId,
            "toUserId": loginInfo.userid,
            "sendType": 1,
            "yearInfoType": 0,
            "greetingsValue": '谢谢祝福',
            "yearType": 1
          };
          let promises = this.$fly.post(url, queryData);
          promises
            .then(data => {
              console.log(data);
              wx.redirectTo({
                url: "/pages/service/newYear/singleOrganizeSuccess/main"
              })
            })
            .catch(e => {
              console.log('报错A')
              apiFail(e);
            });
          return promises;
        })
        .catch(e => {
          console.log('报错B')
          apiFail(e);
          console.log(e);
        });
      return promises;
    },
    regBag() {
      console.log(this.money);
      var checkMoney = this.checkMoney();
      if (checkMoney != false) {
        let url = path.redPacketPay;
        let loginInfo = getLoginInfo();
        let shareData = wx.getStorageSync("organizeShareData");
        let queryData = {
          fromUserId: loginInfo.userid,
          toUserId: shareData.userId,
          redPackage: this.money,
          yearType: 2
        };
        console.log('/****/');
        console.log(queryData);
        let promises = this.$fly.post(url, queryData);
        promises
          .then(data => {
            console.log(data);
            wx.requestPayment({
              timeStamp: data.timeStamp,
              nonceStr: data.nonceStr,
              package: data.package,
              signType: "MD5",
              paySign: data.sign,
              success: res => {
                console.log(res);
                console.log("支付成功");
                let url = path.saveGroupUserInfo;
                let loginInfo = getLoginInfo();
                let shareData = wx.getStorageSync("organizeShareData");
                let queryData = [
                  {
                    groupMainId: shareData.groupMainId,
                    userId: loginInfo.userid,
                    userType: "0",
                    userStatus: "1"
                  }
                ];
                let promises = this.$fly.post(url, queryData);
                promises
                  .then(data => {
                    console.log(data);
                    console.log('保存组织关系');
                    wx.redirectTo({
                      url: "/pages/service/newYear/singleOrganizeSuccess/main"
                    });
                    /*let url = path.sendNewYearInfo;
                    let loginInfo = getLoginInfo();
                    console.log(shareData);
                    let queryData = {
                      fromUserId: loginInfo.userid,
                      toUserId: shareData.userId,
                      sendType: 2,
                      yearInfoType: 1,
                      redPackage: this.money,
                      yearType: "1" //一对一拜年标识
                    };
                    let promises = this.$fly.post(url, queryData);
                    promises
                      .then(data => {
                        console.log(data);
                        wx.redirectTo({
                          url:
                            "/pages/service/newYear/singleOrganizeSuccess/main"
                        });
                      })
                      .catch(e => {
                        apiFail(e);
                      });
                    return promises;*/
                  })
                  .catch(e => {
                    apiFail(e);
                  });
                return promises;
              },
              fail(res) {
                console.log("支付失败1");
                console.log(res);
              }
            });
          })
          .catch(e => {
            console.log("456456");
            apiFail(e);
          });
        return promises;
      }
    },
    checkMoney() {
      //正则表达式
      var reg = new RegExp(/^\d+(?=\.{0,1}\d+$|$)/);
      //判断输入框中有内容
      if (!reg.test(this.money)) {
        wx.showToast({
          title: "红包金额不规范",
          icon: "none"
        });
        return false;
      }else{
        if (this.money < 0 || this.money > 5000) {
          wx.showToast({
            title: "请输入1-5000元红包金额",
            mask: true,
            icon: "none"
          });
          return false;
        }
      }
    },
    getAllListInfo() {
      let loginInfo = getLoginInfo();
      let url = path.getAllListInfo;
      let queryData = {};
      let promises = this.$fly.get(url, queryData);
      promises
        .then(data => {
          console.log(data);
          this.allListInfo = data;
        })
        .catch(e => {
          apiFail(e);
        });
      return promises;
    },
    selectedMoneny(e,ind){
      console.log(e,ind);
      this.money = e;
      this.moneyIndex = ind;
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
    box-sizing: border-box;
    background: url("http://bqyx-qiniu.bqrzzl.com/newyear/bg.png") repeat-y top;
    background-size: 100% 7.5rem;
    border-radius: 0.06rem;
    padding-bottom: 2rem;
    .title-box {
      width: 100%;
      text-align: center;
      overflow: hidden;
      padding-top: 0.88rem;
      p {
        font-size: 0.36rem;
        color: #d22a2a;
        margin-bottom: 0.3rem;
        font-weight: bold;
      }
    }
    .form {
      width: 100%;
      overflow: hidden;
      .label {
        width: 100%;
        text-align: center;
        font-size: 0.36rem;
        color: #000;
        font-weight: bold;
      }
      .money {
        margin: 0.33rem 0.55rem 0.69rem 0.55rem;
        height: 0.9rem;
        text-align: left;
        line-height: 0.9rem;
        font-size: 0.3rem;
        color: #000;
        border-radius: 0.06rem;
        background: #fff;
        padding: 0 0.2rem;
        box-sizing: border-box;
      }
      .btn-wrap {
        padding: 0 0.55rem;
        margin-bottom: 0.3rem;
        .money-btn {
          width: 5.8rem;
          height: 0.86rem;
          line-height: 0.86rem;
          text-align: center;
          font-weight: bold;
          font-size: 0.3rem;
          background: url("http://bqyx-qiniu.bqrzzl.com/newyear/btn3@2x.png")
            no-repeat;
          background-size: 5.8rem 0.86rem;
          color: #d22a2a;
        }
        .no-btn {
          width: 5.8rem;
          height: 0.86rem;
          line-height: 0.86rem;
          text-align: center;
          font-weight: bold;
          font-size: 0.3rem;
          background: url("http://bqyx-qiniu.bqrzzl.com/newyear/btn5.png")
            no-repeat;
          background-size: 5.8rem 0.86rem;
          color: #d2d2d2;
        }
      }
    }
    .select-moneny{
      padding: 0 0.55rem;
      overflow: hidden;
      margin-top: 0.4rem;
      position: relative;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      li{
        flex: 1;
        font-size: 0.3rem;
        color: #D22A2A;
        text-align: center;
        line-height: 0.6rem;
        height: 0.6rem;
        border-radius: 0.1rem;
        border: 1px solid #FFC444;
        background: #FFC444;
        box-sizing: border-box;
      }
    }
    .select-moneny li:nth-child(2){
      margin: 0 0.2rem;
    }
    .select-moneny li:nth-child(3){
      margin-right:0.2rem;
    }
    .select-moneny li.selected{
      background: #D22A2A;
      color: #FFB644;
    }
    .pb-1-box {
      width: 7.11rem;
      height: 5.08rem;
      background: url("http://bqyx-qiniu.bqrzzl.com/newyear/pb2.png") repeat-y
        top;
      background-size: 7.11rem 5.08rem;
      margin: 0 auto;
      position: relative;
      overflow: hidden;
      margin-top: 0.56rem;
      .title {
        padding-top: 0.78rem;
        font-size: 0.32rem;
        color: #fbd175;
        width: 100%;
        text-align: center;
        font-weight: bold;
        overflow: hidden;
      }
      .ulbox{
        width: 100%;
        height: 2.85rem;
        overflow: hidden;
        margin-top: 0.44rem;
        position: relative;
      }
      ul{
        width: 100%;
        padding: 0 1.2rem;
        box-sizing: border-box;
        position: absolute;
        left: 0;
        -webkit-transform: translateY(0);
        -webkit-animation: myfirst 5s 1s ease-in infinite;
      }
      @-webkit-keyframes myfirst {
        0% {-webkit-transform: translateY(0);}
        100% {-webkit-transform: translateY(-50%);}
      } 
      ul li {
        width: 100%;
        font-weight: bold;
        font-size: 0.22rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-bottom: 0.3rem;
        color: #fbd175;
        span {
          color: #f6ff00;
        }
      }
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
</style>
