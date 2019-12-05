<template>
  <div>
    <mpvue-cropper
      ref="cropper"
      :option="cropperOpt"
      @ready="cropperReady"
      @beforeDraw="cropperBeforeDraw"
      @beforeImageLoad="cropperBeforeImageLoad"
      @beforeLoad="cropperLoad"
    ></mpvue-cropper>
    <div class="cropper-buttons" :style="{ color:cropperOpt.boundStyle.color}">
      <div class="upload btn" @tap="uploadTap">上传头像</div>
      <button
        class="getCropperImage btn"
        :style="{backgroundColor:cropperOpt.boundStyle.color}"
        @tap="getCropperImage"
        :disabled="cropperOpt.switch"
        plain
        >确定</button>
    </div>
  </div>
</template>

<script>
import {
  path,
  dataConfig,
  getUserInfo,
  getLoginInfo,
  getSystemInfo,
  isBindPhone,
  showLoading,
  apiFail,
  isHuaWei,
  event,
  link
} from "@/utils/index";
import MpvueCropper from "mpvue-cropper";
import qiniuUploader from "@/utils/qiniu/qiniuUploader";
import { fail } from 'assert';
let wecropper;
const device = wx.getSystemInfoSync();
const width = device.windowWidth;
const height = device.windowHeight - 40;

export default {
  data() {
    return {
      cropperOpt: {
        id: "cropper",
        targetId: "targetCropper",
        pixelRatio: device.pixelRatio,
        width,
        height,
        scale: 2.5,
        zoom: 8,
        cut: {
          x: (width - 300) / 2,
          y: (height - 300) / 2,
          width: 300,
          height: 300
        },
        boundStyle: {
          color: "#04b00f",
          mask: "rgba(0,0,0,0.8)",
          lineWidth: 1
        },
        qiniuToken: "",
        newImgUrl: "", //新头像地址
        flag: false, //防止多次点击
        switch: true //确定键开关
      }
    };
  },

  components: {
    MpvueCropper
  },
  onLoad() {
    // let systemInfo = getSystemInfo();
    // this.height = systemInfo.windowHeight;
    // this.width = systemInfo.windowWidth;
    this.getAccessToken();
  },
  onShow() {
    this.cropperOpt.switch = true;
    const value = wx.getStorageSync('imgSrc')
    if (value) {
      this.cropperOpt.switch = false;
      wx.removeStorageSync('imgSrc')
    }
    this.cropperOpt.flag = false;
  },
  methods: {
    //获取七牛云Token
    getAccessToken() {
      let url = path.getAccessToken;
      let promise = this.$fly.get(url);
      promise
        .then(data => {
          console.log(data.token);
          this.qiniuToken = data.token;
        })
        .catch(e => {
          apiFail(e);
        });
    },
    cropperReady(...args) {
      console.log("cropper ready!");
    },
    cropperBeforeImageLoad(...args) {
      console.log("before image load");
    },
    cropperLoad(...args) {
      console.log("image loaded");
    },
    cropperBeforeDraw(...args) {
      // Todo: 绘制水印等等
    },
    //上传
    uploadTap() {
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          const src = res.tempFilePaths[0];
          //获取裁剪图片资源后，给data添加src属性及其值
          console.log(src)
          wx.setStorageSync('imgSrc', src)
          wecropper.pushOrigin(src);
        },
      });
    },
    //确定
    getCropperImage() {
      if(this.cropperOpt.flag){
        wx.showToast({
          title: "图片处理中，请稍后...",
          icon: "none",
          duration: 1000
        });
        return
      }
      this.cropperOpt.flag = true;
      wecropper
        .getCropperImage({ original: true })
        .then(src => {
          if(src && src.length>0){
            wx.showLoading({
              title: "头像上传中...",
              mask: true,
              icon: "loading"
            });
            //查看编辑好的图片（长按可保存、收藏、分享）
            wx.previewImage({
              current: '', // 当前显示图片的http链接
              urls: [src], // 需要预览的图片http链接列表
              success: res => {
                this.cropperOpt.flag = false;
                console.log("成功")
              },
            })
          }
          var filePath = src;
          qiniuUploader.upload(
            filePath,
            res => {
              //成功返回的图片地址
              this.newImgUrl = "http://bqyx-qiniu.bqrzzl.com/" + res.key;
              //console.log(this.newImgUrl)
              let url = path.updateBaseInfo;
              let queryData = {
                userId: getLoginInfo().userid,
                avatarUrl: this.newImgUrl
              };
              let promise = this.$fly.post(url, queryData);
              promise
                .then(data => {
                  wx.hideLoading();
                  //console.log(data,202)
                  wx.showToast({
                    title: "头像设置成功",
                    icon: "none",
                    duration: 1000
                  });
                  setTimeout(function() {
                    wx.navigateBack({
                      delta: 1,
                    });
                  }, 1000);
                })
                .catch(e => {
                  apiFail(e);
                });
            },
            error => {
              console.log("error: " + error);
            },
            {
              region: "ECN",
              domain: "bzkdlkaf.bkt.clouddn.com", // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
              uptoken: this.qiniuToken
            },
            res => {
              console.log("上传进度", res.progress);
              console.log("已经上传的数据长度", res.totalBytesSent);
              console.log(
                "预期需要上传的数据总长度",
                res.totalBytesExpectedToSend
              );
            },
            () => {
              // 取消上传
            },
            () => {
              // `before` 上传前执行的操作
            },
            err => {
              // `complete` 上传接受后执行的操作(无论成功还是失败都执行)
            }
          );
        })
        .catch(e => {
          console.error("获取图片失败");
        });
    }
  },
  mounted() {
    wecropper = this.$refs.cropper;
    var options = {
      region: "ECN", // 是你注册bucket的时候选择的区域的代码
      // ECN, SCN, NCN, NA, ASG，分别对应七牛的：华东，华南，华北，北美，新加坡 5 个区域
      // 详情可以参见「说明」部分的第一条
      domain: "bzkdlkaf.bkt.clouddn.com", // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
      // 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
      uptoken: this.qiniuToken, // 由其他程序生成七牛 uptoken
      // uptokenURL: 'UpTokenURL.com/uptoken', // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "0MLvWPnyy..."}
      // uptokenFunc: function() {
      // do something to make a uptoken
      // return 'zxxxzaqdfUpToken';
      // },
      shouldUseQiniuFileName: true // 如果是 true，则文件 key 由 qiniu 服务器分配 (全局去重)。默认是 false: 即使用微信产生的 filename
    };
    qiniuUploader.init(options);
  }
};
</script>

<style>
.cropper-wrapper {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #e5e5e5;
}
.cropper-buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 300rpx;
  padding: 0 20rpx;
  box-sizing: border-box;
  line-height: 50rpx;
}
button {
  margin-right: 0;
}
.cropper-buttons .upload,
.cropper-buttons .getCropperImage {
  text-align: center;
}
.upload {
  background-color: rgb(245, 197, 92);
}
.cropper {
  position: absolute;
  top: 0;
  left: 0;
}

.cropper-buttons {
  background-color: rgba(0, 0, 0, 0.95);
}

.btn {
  position: relative;
  height: 50rpx;
  line-height: 50rpx;
  padding: 0 24rpx;
  border-radius: 4rpx;
  color: #ffffff;
  font-size: 36rpx;
  bottom: 30rpx;
}
</style>