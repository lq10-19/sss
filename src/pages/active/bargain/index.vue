<template>
  <div>
    <div class="goods-wrapper">
      <div class="goods">
        <div class="avatar">
          <img class="head-portrait" :src="headImg">
          <div class="time" v-text="time"></div>
          <div class="detail">
            <img class="pic" :src="goodsImg">
            <div>
              <div class="goodsName">{{goodsName}}</div>
              <div class="price">
                <span class="curr-price">￥{{currPrice}}</span>
                <span class="text">包邮</span>
              </div>
              <div class="origin-price">原价￥{{goodsSum}}</div>
            </div>
          </div>
          <progress border-radius="50px" :percent="schedule" activeColor="#FFCC00"/>
          <span class="bargain">已砍{{bargainMoney}}元</span>
          <span class="explain">帮砍好友越多,购买金额越低</span>
        </div>
      </div>
    </div>
    <button open-type="share" class="share-btn-top" :disabled="timeOver">邀请好友帮忙砍价</button>
    <button @click="showImg()" class="share-btn-bottom" :disabled="timeOver">分享朋友圈帮忙砍价</button>
    <button class="return-btn" @click="returnPage()" v-text="t"></button>
    <div class="canvas-wrapper" :class="{ show: isShowImg }">
      <canvas
        class="bargain-canvas"
        canvas-id="bargainCanvas"
        :style="{width:canvasWidth+'px',height:canvasHeight+'px'}"
      ></canvas>
      <button class="save-img-btn" @click="savePoster">点击保存后发朋友圈</button>
      <button class="cancel-save-btn" @click="cancelSavePoster">取消</button>
    </div>
  </div>
</template>
<script>
import queryString from "@/utils/query-string";
import {
  getLoginInfo,
  isBindPhone,
  link,
  showLoading,
  getSystemInfo,
  path
} from "@/utils/index";
let context = null;
let loginInfo = null;
let systemInfo = null;
export default {
  computed: {
    //砍价进度
    schedule: function() {
      return this.bargainMoney / (this.goodsSum - this.miniSum) * 100;
    },
    time: function() {
      let time = this.remainSecond;
      this.hour = Math.floor(time / 3600);
      if (this.hour < 10) {
        this.hour = "0" + this.hour;
      }
      this.minute = Math.floor((time - this.hour * 3600) / 60);
      if (this.minute < 10) {
        this.minute = "0" + this.minute;
      }
      this.second = time - this.hour * 3600 - this.minute * 60;
      if (this.second < 10) {
        this.second = "0" + this.second;
      }
      return `剩余时间 ${this.hour}:${this.minute}:${this.second}`;
    }
  },

  data() {
    return {
      t: "<<返回",
      isShowImg: false,
      isGoLoginPage: false,
      isGoBindPhonePage: false,
      canvasWidth: 200,
      canvasHeight: 0,
      shareImg: "",
      goodsName: "",
      goodsImg: "",
      goodsSum: 0, //原价
      currPrice: 0, //砍价
      miniSum: 0, //最小金额
      bargainMoney: 0, //已砍金额
      remainSecond: 0, //倒计时
      timeID: 0, //清除定时器
      timeOver: false,
      hour: 0,
      minute: 0,
      second: 0,
      headImg: ""
    };
  },
  onLoad(options) {
    wx.setStorageSync("bargainOptions", options);
    systemInfo = getSystemInfo();
    this.canvasWidth = systemInfo.screenWidth * 0.8;
    this.canvasHeight = this.canvasWidth * 1.41;
  },
  onShow() {
    wx.showToast({
      title: "加载中...",
      image: "/static/icon/loading.gif",
      mask: true
    });
    if (!this.loginCheck()) {
      wx.hideToast();
      return;
    }
    loginInfo = getLoginInfo();
    this.headImg = loginInfo.avatarurl;
    let bargainOptions = wx.getStorageSync("bargainOptions");
    if (bargainOptions.buyerUserId) {
      //从微信分享链接进入,跳转到砍价页面去,附带参数
      let buyerUserId = bargainOptions.buyerUserId;
      let goodsId = bargainOptions.goodsId;
      let helperUserId = loginInfo.userid;
      let bargainId = bargainOptions.bargainId;
      this.gotoBargainPage(buyerUserId, goodsId, helperUserId, bargainId);
      wx.hideToast();
      return;
    }
    if (bargainOptions.scene) {
      //从小程序二维码扫描进入
      console.log(bargainOptions.scene)
      let helperUserId = loginInfo.userid;
      this.gotoBargainPage("", "", helperUserId, bargainOptions.scene);
      wx.hideToast();
      return;
    }
    //从h5跳转到小程序
    let scene = bargainOptions.bargainId;
    this.shareImg = path.shareImg + `?scene=${scene}&page=pages/active/bargain/main`;
    //正式版
    //pages/active/bargain/main
    //测试版
    //pages/home/main
    this.getGoodsInfo();
    wx.hideToast();
    //this.initCanvas();
  },
  onHide() {
    //清除倒计时
    clearInterval(this.timerId);
  },
  onShareAppMessage(options) {
    let buyerUserId = loginInfo.userid;
    let goodsId = wx.getStorageSync("bargainOptions").goodsId;
    let bargainId = wx.getStorageSync("bargainOptions").bargainId;
    let path = `/pages/active/bargain/main?buyerUserId=${buyerUserId}&goodsId=${goodsId}&bargainId=${bargainId}`;
    console.log("path", path);
    return {
      title: "爆款汽车用品，我们一起免费领！",
      path: path,
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    };
  },
  methods: {
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
      // if (!isBindPhone() && !this.isGoBindPhonePage) {
      //   console.log('11111111');
      //   this.isGoBindPhonePage = true;
      //   const url = "/pages/login/bindPhone/main";
      //   wx.navigateTo({ url });
      //   return;
      // }
      // if (!isBindPhone() && this.isGoBindPhonePage) {
      //   const url = "/pages/home/main";
      //   wx.reLaunch({ url });
      //   return false;
      // }
      return true;
    },
    getGoodsInfo() {
      let goodsId = wx.getStorageSync("bargainOptions").goodsId;
      //请求商品信息
      let promise = this.$fly.post(path.getGoodsInfo, {
        goodsId: goodsId
      });
      promise.then(res => {
        console.log(res);
        this.goodsName = res.goodsName;
        this.goodsSum = res.goodsSum;
        this.goodsImg = res.goodsImg;
        this.miniSum = res.miniSum;
      });
      //获取用户砍价信息
      let buyerUserId = loginInfo.userid;
      let promise1 = this.$fly.post(path.getBargainInfo, {
        goodsId: goodsId,
        buyerUserId: buyerUserId
      });
      promise1.then(res => {
        console.log(res);
        this.currPrice = res.currPrice;
        this.bargainMoney = res.bargainMoney;
        this.remainSecond = res.remainSecond;
        this.timerId = setInterval(() => {
          --this.remainSecond;
          if( this.remainSecond <= 0 ){
            this.timeOver = true;
            clearInterval(this.timerId);
          }
        }, 1000);
      });
    },
    //通过分享链接进去砍价页面
    gotoBargainPage(buyerUserId, goodsId, helperUserId, bargainId) {
      let toLink =
        link.helpBargain +
        `?helperUserId=${helperUserId}&bargainId=${bargainId}`;
      toLink = encodeURIComponent(toLink);
      let url = `/pages/bargainPage/main?toLink=${toLink}`;
      console.log(url);
      wx.reLaunch({
        url: url
      });
    },
    //返回
    returnPage() {
      //获取返回页面参数
      let returnLink = wx.getStorageSync("bargainOptions").returnLink;
      console.log(returnLink);
      // let userId = getLoginInfo().userid;
      // console.log(userId)
      // let retrunLink = link.bargainActive + `?userId=${userId}`;
      //returnLink = encodeURIComponent(returnLink);
      let url = `/pages/bargainPage/main?toLink=${returnLink}`;
      console.log(url);
      wx.navigateTo({
        url: url
      });
    },
    //展示画布分享
    showImg() {
      this.isShowImg = true;
      this.initCanvas();
    },
    initCanvas() {
      wx.showLoading({
        title: "加载中"
      });
      context = wx.createCanvasContext("bargainCanvas");
      let codeImgPath = "";
      console.log("111:"+this.shareImg)
      this.downImg(this.shareImg)
        .then(tempFilePath => {
          codeImgPath = tempFilePath;
          let goodsId = wx.getStorageSync("bargainOptions").goodsId;
          return this.downImg(path.queryGoodsInfo + "?goodsId=" + goodsId);
        })
        .then(goodsImgPath => {
          this.drawPoster(codeImgPath, goodsImgPath);
          console.log("1.二维码地址:" + codeImgPath);
          console.log("2.商品图片地址:" + goodsImgPath);
          wx.hideLoading();
        })
        .then(() => {})
        .catch(e => {
          console.error(e);
          wx.hideLoading();
          wx.showToast({
            title: "生成海报失败",
            icon: "none",
            duration: 2000
          });
        });
      },
    drawPoster(codeImgPath, goodsImgPath) {
      //0.填充背景
      context.setFillStyle("#F2F3F5");
      context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      let tempWidth = this.canvasWidth * 0.9;
      let offset = (this.canvasWidth - tempWidth) / 2;
      context.setFillStyle("#FFFFFF");
      context.fillRect(offset, offset, tempWidth, tempWidth * 1.1);
      //1.商品图片
      let imgWidth = tempWidth * 0.6;
      let imgOffset = (this.canvasWidth - imgWidth) / 2;
      context.drawImage(
        goodsImgPath,
        imgOffset,
        imgOffset * 0.7,
        imgWidth,
        imgWidth
      );
      //分割线
      let lineX = offset;
      let lineY = imgOffset + imgWidth;
      let lineEndX = this.canvasWidth - offset;
      let lineEndY = lineY;
      context.beginPath();
      context.strokeStyle = "#F2F3F5";
      context.moveTo(lineX, lineY * 0.95);
      context.lineTo(lineEndX, lineEndY * 0.95);
      context.stroke();
      //2.文字
      context.setFontSize(this.canvasWidth * 0.067);
      context.fillStyle = "#000000";
      context.fillText(
        "最低砍至",
        offset * 1.5,
        lineEndY + this.canvasWidth * 0.067
      );
      context.fillStyle = "#FFCC00";
      let text = context.measureText("最低砍至");
      context.fillText(
        `￥${this.miniSum}包邮`,
        offset * 2 + text.width,
        lineEndY + this.canvasWidth * 0.067
      );
      context.setFontSize(16);
      context.fillStyle = "#000000";
      context.fillText(
        "帮我砍一下",
        offset * 1.5,
        lineEndY + this.canvasWidth * 0.146
      );
      context.setFontSize(14);
      context.fillStyle = "#999999";
      context.fillText(
        `原价￥${this.goodsSum}`,
        offset * 1.5,
        lineEndY + this.canvasWidth * 0.226
      );
      //原价删除线
      text = context.measureText(`原价￥${this.goodsSum}`);
      context.beginPath();
      context.strokeStyle = "#999999";
      context.moveTo(offset * 1.5, lineEndY + this.canvasWidth * 0.21);
      context.lineTo(
        offset * 1.5 + text.width,
        lineEndY + this.canvasWidth * 0.21
      );
      context.stroke();
      //二维码图片
      context.drawImage(
        codeImgPath,
        this.canvasWidth * 0.06,
        this.canvasHeight * 0.77,
        this.canvasWidth * 0.3,
        this.canvasHeight * 0.2
      );
      //文字
      context.fillStyle = "#000000";
      context.fillText(
        "长按图片扫码",
        offset + this.canvasWidth * 0.4,
        lineEndY + this.canvasWidth * 0.4
      );
      context.fillText(
        "帮砍赢商品",
        offset + this.canvasWidth * 0.4,
        lineEndY + this.canvasWidth * 0.5
      );
      context.draw();
    },
    cancelSavePoster() {
      this.isShowImg = false;
    },
    savePoster() {
      this.canSaveFile()
        .then(() => {
          return this.canvasToImg();
        })
        .then(tempFilePath => {
          return this.saveFile(tempFilePath);
        })
        .then(() => {
          wx.showToast({
            title: "保存成功",
            icon: "none"
          });
        })
        .catch(e => {
          console.log(e);
          wx.showToast({
            title: "保存失败",
            icon: "none"
          });
        });
    },
    canSaveFile() {
      return new Promise((resolve, reject) => {
        wx.getSetting({
          success: res => {
            if (!res.authSetting["scope.writePhotosAlbum"]) {
              wx.authorize({
                scope: "scope.writePhotosAlbum",
                success() {
                  resolve();
                },
                fail: e => reject(e)
              });
            } else {
              resolve();
            }
          }
        });
      });
    },
    canvasToImg() {
      return new Promise((resolve, reject) => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: this.canvasWidth,
          height: this.canvasHeight,
          destWidth: this.canvasWidth * 2.8,
          destHeight: this.canvasHeight * 2.8,
          canvasId: "bargainCanvas",
          success(res) {
            resolve(res.tempFilePath);
          },
          fail(e) {
            reject(e);
          }
        });
      });
    },
    saveFile(tempFilePath) {
      return new Promise((resolve, reject) => {
        wx.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          success: res => {
            resolve();
          },
          fail: res => {
            reject();
          }
        });
      });
    },
    downImg(imgUrl) {
      return new Promise((resolve, reject) => {
        let data = {
          url: imgUrl,
          success: res => {
            console.log(res);
            if (res.statusCode === 200) {
              resolve(res.tempFilePath);
            } else {
              reject(res);
            }
          },
          fail: e => {
            console.error(e);
            reject(e);
          }
        };
        wx.downloadFile(data);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.goods-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 50rpx;
  .goods {
    width: 690rpx;
    height: 700rpx;
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    margin-top: 100rpx;
    .avatar {
      .head-portrait {
        display: block;
        margin: 0 auto;
        width: 140rpx;
        height: 140rpx;
        border-radius: 50%;
        position: relative;
        top: -80rpx;
      }
    }
    .time {
      width: 50%;
      display: block;
      margin: 0px auto;
      padding-top: 24rpx;
      position: relative;
      text-align: center;
      top: -40rpx;
    }
    .detail {
      display: flex;
      border-top: 2px #eee solid;
      padding-top: 40rpx;
      .pic {
        margin: 0px 30rpx;
        width: 200rpx;
        height: 200rpx;
      }
      .goodsName{
        height: 100rpx;
        width: 450rpx;
        overflow: hidden;
      }
      .price {
        margin-top: 18rpx;
        color: #ffcc00;
        .text {
          font-size: 26rpx;
          padding-left: 12rpx;
        }
        .curr-price {
          font-size: 40rpx;
        }
      }
      .origin-price {
        margin-top: 18rpx;
        color: #999999;
        font-size: 26rpx;
        text-decoration: line-through;
      }
    }
    progress {
      margin: 30px 15px 0px 15px;
    }
    .bargain {
      display: inline-block;
      margin: 10px 0px 0px 15px;
      font-size: 28rpx;
      font-family: YouYuan;
      font-weight: 600;
    }
    .explain {
      display: inline-block;
      color: #ffcc00;
      font-size: 27rpx;
      margin-left: 140rpx;
      text-align: right;
    }
  }
}
.canvas-wrapper {
  display: none;
  &.show {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    background: rgba(0, 0, 0, 0.7);
  }
  .bargain-canvas {
    display: block;
    margin: 48rpx auto;
  }
  .save-img-btn {
    width: 80%;
    background: linear-gradient(
      180deg,
      rgba(254, 235, 167, 1),
      rgba(255, 204, 0, 1)
    );
    border-radius: 40px;
    margin-bottom: 12rpx;
  }
  .cancel-save-btn {
    width: 80%;
    border-radius: 40px;
  }
}
.share-btn-top {
  width: 80%;
  background: linear-gradient(
    180deg,
    rgba(254, 235, 167, 1),
    rgba(255, 204, 0, 1)
  );
  border-radius: 40px;
  margin-bottom: 50rpx;
  margin-top: 50rpx;
  font-size: 32rpx;
}
.share-btn-bottom {
  width: 80%;
  background: linear-gradient(
    180deg,
    rgba(254, 235, 167, 1),
    rgba(255, 204, 0, 1)
  );
  border-radius: 40px;
  margin-bottom: 150rpx;
  font-size: 32rpx;
}
.return-btn {
  width: 750rpx;
  height: 100rpx;
  line-height: 100rpx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px -2px 10px 0px rgba(0, 0, 0, 0.05);
  font-size: 30rpx;
  text-align: center;
  position: fixed;
  bottom: 0;
}
</style>
