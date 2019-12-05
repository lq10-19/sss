<template>
  <div class="main" :customStyle="customStyle">
    <!-- <img :src="shareImg" class="bg"> -->
    <canvas :style="{'width': PageWidth, 'height': PageHeight}" canvas-id="bqCanvas" @click="saveCanvasPosterImg"></canvas>
  </div>
</template>

<script>
import { path, getLoginInfo, getSystemInfo } from "@/utils/index";
export default {
  data() {
    return {
      popUp: false,
      shareImg: "",
      template: "",
      customStyle: "",
      src: "",
      PageHeight: '',
      PageWidth: '',
      systemInfoHeight: '',
      systemInfoWidth: '',
      nickname: '',
      userid: '',
      imgW: '750',
      imgH: '1206',
      codeW: '178',
      codeH: '178',
      codeL: '280',
      codeT: '440',
      bl: ''
    };
  },
  onLoad(options) {
    let loginInfo = getLoginInfo();
    this.nickname = loginInfo.nickname;
    this.shareImg = path.shareImg + "?scene=" + loginInfo.userid +"&page=pages/home/main";
    this.userid = loginInfo.userid;
    let systemInfo = getSystemInfo();
    this.bl = this.imgH / this.imgW;
    this.PageHeight = systemInfo.screenWidth * this.bl+'px';
    this.PageWidth = systemInfo.screenWidth+'px';
    this.systemInfoWidth = systemInfo.screenWidth;
    this.systemInfoHeight = systemInfo.screenWidth * this.bl;
    console.log(this.PageWidth);
  },
  onReady() {
    const ctx = wx.createCanvasContext("bqCanvas");
    ctx.clearRect(0,0,this.PageWidth,this.PageHeight);
    let posterUrl = path.shareBg;
    this.downImg(posterUrl).then(postFilePath => {
      this.downImg(this.shareImg).then(tempFilePath => {
        ctx.drawImage(postFilePath, 0, 0, this.systemInfoWidth, this.systemInfoHeight);
        var codeW = this.codeW / this.imgW * this.systemInfoWidth;
        var codeL = this.codeL / this.imgW * this.systemInfoWidth;
        var codeT = this.codeT / this.imgH * this.systemInfoHeight;
        ctx.drawImage(tempFilePath, codeL, codeT, codeW, codeW);
        var textT = 312 / this.imgH * this.systemInfoHeight;
        ctx.setTextAlign('center') // 文字居中
        ctx.setFillStyle('#fff') // 文字颜色：黑色
        ctx.setFontSize(13) // 文字字号：22px
        ctx.fillText(this.nickname+"邀请你来抢红包", this.systemInfoWidth / 2, textT);
        ctx.stroke()
        ctx.draw();
      });
    });
  },
  methods: {
    downPoster() {
      this.canSaveFile()
        .then(() => {
          return this.downImg(this.shareImg);
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
      wx.showLoading({
        title: "下载图片中...",
        mask: true
      });
      return new Promise((resolve, reject) => {
        let data = {
          url: imgUrl,
          success: res => {
            wx.hideLoading();
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res.statusCode === 200) {
              resolve(res.tempFilePath);
            } else {
              reject(res);
            }
          },
          fail: e => {
            wx.hideLoading();
            reject(e);
          }
        };
        wx.downloadFile(data);
      });
    },
    saveCanvasPosterImg() {
      this.canSaveFile()
        .then(() => {
          return this.canvasToImg();
        })
        .then(tempFilePath => {
          return this.saveFile(tempFilePath);
        })
        .then(() => {
          if(this.userid == '' || this.userid == undefined){
            wx.showToast({
              title: "保存失败，userid不能为空",
              icon: "none"
            });
            return false; 
          }else{
            wx.showToast({
              title: "保存成功",
              icon: "none"
            });
          }
        })
        .catch(e => {
          console.log(e);
          wx.showToast({
            title: "保存失败",
            icon: "none"
          });
        });
    },

    canvasToImg() {
      return new Promise((resolve, reject) => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: this.systemInfoWidth,
          height: this.systemInfoHeight,
          destWidth: this.systemInfoWidth * 2,
          destHeight: this.systemInfoHeight * 2,
          canvasId: "bqCanvas",
          success(res) {
            resolve(res.tempFilePath);
          },
          fail(e) {
            reject(e);
          }
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  height: 100vh;
  .bg {
    width: 430rpx;
    height: 430rpx;
    position: fixed;
    left: 50%;
    top: 10%;
    margin-left: -215rpx;
  }
  .btn {
    width: 255px;
    height: 44px;
    position: absolute;
    margin-left: 60px;
    bottom: 17%;
  }
}
</style>
