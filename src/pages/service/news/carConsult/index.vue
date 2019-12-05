<template>
  <div class="bigBox">
    <div class="header">
      <h1 class="header-title">{{title}}</h1>
      <h2>
        <span class="header-log">{{logo}}</span>
        <span class="header-time">{{time}}</span>
        <span class="header-share" @click="share"><img src="/static/icon/share.png">&nbsp;分享</span>
      </h2>
    </div>
    <div class="noNews" v-if="noNews">内容已删除，请点击下放获取更多汽车资讯~</div>
    <div class="body" id="allComment" v-if="!noNews">
      <div class="main" v-for="(item,index) in arr" :key="item">
        <div v-if="index === 0">
          <image :src="item.localHttpUrl" alt class="main-carImg" v-if="item.localHttpUrl" mode='widthFix'></image>
        </div>
        <div v-else>
          <image :src="item.localHttpUrl" alt class="main-carImg" v-if="item.localHttpUrl" mode='widthFix'></image>
          <p class="main-content" v-if="item.text">{{item.text}}</p>
        </div>
      </div>
    </div>
    <div class="foot">
      <p>（声明：文章内容来源于网络，版权归原作者所有，如有侵权请与我们联系，我们将及时删除。email：marketing@bqrzzl.com）</p>
    </div> 
    <!-- 获取评论 -->
    <div class="comment">
      <div class="all">全部评论&nbsp;(<span>{{commentNum}}</span>)</div>
      <div class="more" @click="goHome">更多汽车资讯...</div>
      <div v-if="noComment" class="noCom">
        <img src="/static/img/group/wu@2x.png" alt="">
        <p>智慧如你，不想发表一点想法咩~</p>
      </div>  
      <div v-if="!noComment">  
        <div class="users" v-for="(item,i) in uesrsList" :key="i">
          <img :src="item.avatarUrl">
          <div>
            <p class="p1">
              <span>{{item.nickName}}</span>
              <span class="time">{{item.timeFormat}}</span>
            </p>
            <p class="p2">{{item.commentContent}}</p>
          </div>
        </div>
        <div class="showBottom" v-if="isShowBottom">暂时没有更多评论~</div>
      </div>
    </div>
    <!-- 写评论 -->
    <div class="write">
      <img src="/static/icon/pen.png" alt="">
      <input placeholder="写评论..." confirm-type="send" v-model="inputVal" @confirm="send"> 
    </div>
    <!-- 选择微信好友、朋友圈 -->
    <div class="share" v-if="choose" catchtouchmove="ture">
      <div class="box">
        <div class='maskLayer'>
          请选择分享平台
        </div>
        <view class='choose'>
          <button plain class="friend" open-type="share">
            <img src="/static/redBag/weixin@2x.png">
            <p>微信好友</p>
          </button>
          <button plain class="friends" @click="showImg()">
            <img src="/static/redBag/pengyouquan@2x.png">
            <p>朋友圈</p>
          </button>
        </view>
        <button @click="cancelShare" class="cancel">取消分享</button>
      </div>  
    </div>
    <!-- 分享保存图片 -->
    <div v-if="isShowImg" class="canvas-wrapper" :class="{ show: isShowImg }" catchtouchmove="ture">
      <canvas
        class="bargain-canvas"
        canvas-id="bargainCanvas"
        :style="{width:canvasWidth+'px',height:canvasHeight+'px'}"
      ></canvas>
      <button class="save-img-btn" @click="savePoster">点击保存后发朋友圈</button>
      <img class="cancel-save-btn" @click="cancelSavePoster" src="/static/icon/clear.png">
    </div>
  </div>
</template>

<script>
import {
  path,
  dataConfig,
  link,
  getUserInfo,
  getLoginInfo,
  isBindPhone,
  showLoading,
  getSystemInfo,
  apiFail,
  isHuaWei,
  event
} from "@/utils/index";
import { patch } from 'semver';
import { debug } from 'util';
let context = null;
let loginInfo = null;
let systemInfo = null;
export default {
  components: {},
  data() {
    return {
      canvasWidth: 200,
      canvasHeight: 0,
      isShowImg: false, //画布开关
      choose: false, //分享开关
      inputVal: "", //评论
      title: "",
      titleTop: "",
      titleBot: "", 
      time: "",
      link: "",
      logo: "", //来源
      isShowBottom: false, //上拉触底
      arr:[], //数据列表
      newList:[],
      uesrsList:[], //评论列表
      commentNum: 0, //全部评论数量
      noComment: false, //没有评论
      pageIndex: 1, 
      upperLevelId: "",
      shareImg: "", //二维码
      goodsName: "", //标题
      goodsImg: "", //图片
      // scene: 1223344
      toLogin: false, //默认为已登录用户
      optionsData: {},
      addNum: 0, //新增评论数
      noNews: true, //资讯下架提示开关
    };
  },
  onLoad(options) {
    this.optionsData = options;
    systemInfo = getSystemInfo();
    this.canvasWidth = systemInfo.screenWidth * 0.8;
    this.canvasHeight = this.canvasWidth * 1.41;  
  },
  onShow() {
    this.isShowImg = false; //重置画布开关
    this.choose = false; //重置分享开关
    this.noComment = false; 
    this.isShowBottom = false;
    this.newList = [];
    this.uesrsList = [];
    this.commentNum = 0;
    this.addNum = 0;
    if(this.toLogin){
      if(getLoginInfo()){
        this.queryShareLink(this.optionsData.id);
        this.send();
        this.toLogin = false;
      }else{
        const url = "pages/home/main";
        wx.navigateTo({
          url
        });
      } 
    }else{
      if(this.optionsData.scene){
        console.log("二维码进入："+this.optionsData.scene)
        //获取分享图片和link
        this.queryShareLink(this.optionsData.scene);
        this.scene = this.optionsData.scene;
        //获取二维码
        this.shareImg = path.shareImg + `?scene=${this.optionsData.scene}&page=pages/service/news/carConsult/main`;
      }else{
        //console.log("正常进入："+this.optionsData.id)
        //获取分享图片和link
        this.queryShareLink(this.optionsData.id);
        this.scene = this.optionsData.id
        //获取二维码
        this.shareImg = path.shareImg + `?scene=${this.optionsData.id}&page=pages/service/news/carConsult/main`;
      }
    }
  },
  onHide() {
    this.newList = [];
    this.uesrsList = [];
  },
  onReady() {
    
  },
  onShareAppMessage() {
    this.choose = false;
    let url = '';
    this.arr.forEach(item => {
      if(item.localHttpUrl){
        url = item.localHttpUrl;
      }
    });
    return {
      title: this.title,
      path: `/pages/service/news/carConsult/main?id=${this.scene}`,
      imageUrl: url,
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    };
  },
  //上拉触底
  onReachBottom(){
    if(!this.isShowBottom){
      this.pageIndex = this.pageIndex + 1;
      this.queryCrawlCommentMp(this.scene,this.pageIndex);
    }
  },
  methods: {
    //从二维码进入获取link和分享图片
    queryShareLink(id){
      let url = path.queryShareLink;
      let  queryData = {
        "id": id,
      };
      let promise = this.$fly.get(url, queryData);
        promise
          .then(data => {
            //console.log("分享图和link：",data)
            this.goodsImg = data.localHttpUrl;
            //console.log('正常获取新闻')
            this.getProductDataSuccess(data.link);
            if(!this.toLogin){
              //console.log('正常获取评论')
              this.queryCrawlCommentMp(id,1); 
            }
          })
          .catch(e => {
            apiFail(e);
          });
        return promise;
    },
    //获取新闻详细
    getProductDataSuccess(link) {
      let tolink = decodeURIComponent(link);
      let url = path.queryLinkContent;
      let queryData = {
        "link": tolink,
      };
      let promise = this.$fly.post(url, queryData);
      showLoading(promise);
      promise
        .then(data => {
          this.noNews = false;
          //console.log("新闻：",data)
          this.arr = data;
          this.title = this.arr[0].newsTitle;
          this.time = this.arr[0].crawlTime;
          this.logo = this.arr[0].dataSourceName; 
          let str = this.arr[0].newsTitle;
          //console.log("标题长度："+ str.length)
          if(str.length>28){
            this.titleTop = str.substring(0, 15);
            this.titleBot = str.substring(15, 28) + "...";
          }else{
            this.titleTop = str.substring(0, 15);
            this.titleBot = str.substring(15, 28);
          } 
        })
        .catch(e => {
          this.noNews = true;
          // apiFail(e);
        });
      return promise;
    },
    //获取评论
    queryCrawlCommentMp(upperLevelId, pageIndex = 1){
      let url = path.queryCrawlCommentMp;
      let queryData = {
        upperLevelId: upperLevelId,
        pageSize: 10, //条数
        pageIndex: pageIndex //页数
      };
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          //console.log("评论：",data)
          if(data.results.length > 0){
            this.newList = data.results;
            this.uesrsList = this.uesrsList.concat(this.newList);
            this.commentNum = data.total;
          }else{
            if(this.pageIndex == 1){
              this.noComment = true;
            }else{
              this.isShowBottom = true;
              this.pageIndex = 1
            };
          } 
        })
        .catch(e => {
          this.noComment = true;
          // apiFail(e);
        });
      return promise;
    },
    //发送评论
    send() {
      //授权登陆
      if (!getLoginInfo()) {
        //判断是经过登陆跳转回新闻
        this.toLogin = true;
        const url = "/pages/login/main";
        wx.navigateTo({
          url
        });
        return;
      }
      this.noComment = false;
      this.isShowBottom = false;
      //console.log('发送：'+ this.inputVal)
      let url = path.insertCrawlCommentMp;
      let queryData = {
        upperLevelId: this.scene,
        userId: getLoginInfo().userid,
        commentContent: this.inputVal
      };
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          wx.showToast({
            title: '评论成功',
            icon: 'success',
            duration: 2000
          })
          this.newList = [];
          this.uesrsList = [];
          this.inputVal = '';
          //手动更新评论条数显示（小程序的缓存机制不够完善）
          wx.setStorageSync("newsId",data.upperLevelId);
          this.addNum = this.addNum + 1;
          wx.setStorageSync("addNum",this.addNum);
          this.queryCrawlCommentMp(this.scene, 1).then(()=>{
            //console.log('评论后获取评论')
            setTimeout(()=>{
              //获取评论位置
              const query = wx.createSelectorQuery()
              query.select('#allComment').boundingClientRect();
              query.selectViewport().scrollOffset()
              query.exec(function (res) {
                wx.pageScrollTo({
                  scrollTop: res[0].height,
                  duration: 300
                })
              })
            },200);
          });
        })
        .catch(e => {
          wx.showToast({
            title: '评论失败,请检查网络',
            icon: 'none',
            duration: 2000
          })
        });
      return promise;
    },
    //返回首页
    goHome() {
      wx.switchTab({
        url: "/pages/home/main"
      });
    },
    //点击分享
    share() {
      this.choose = true;
    },
    //取消分享
    cancelShare() {
      this.choose = false;
    },
    //展示画布分享
    showImg() {
      this.choose = false;
      this.isShowImg = true;
      this.initCanvas();
    },
    initCanvas() {
      wx.showLoading({
        title: "加载中"
      });
      context = wx.createCanvasContext("bargainCanvas");
      let codeImgPath = "";
      let goodsImgPath = ""
      //console.log("二维码:"+this.shareImg)
      this.downImg(this.shareImg)
        .then(tempFilePath => {
          codeImgPath = tempFilePath;
          //console.log("新闻图片:"+this.goodsImg)
          return this.downImg(this.goodsImg);
          // return this.downImg('http://bqyx-qiniu.bqrzzl.com/1-20190315180057.jpg');
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
        imgOffset * 0.35,
        imgOffset * 0.35,
        imgWidth * 1.56,
        imgWidth * 1.15
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
      context.setFontSize(17);
      context.fillStyle = "#000000";
      context.fillText(
        `${this.titleTop}`,
        offset * 1.5,
        lineEndY + this.canvasWidth * 0.067
      );
      context.setFontSize(17);
      context.fillStyle = "#000000";
      context.fillText(
        `${this.titleBot}`,
        offset * 1.5,
        lineEndY + this.canvasWidth * 0.138
      );
      context.setFontSize(14);
      context.fillStyle = "#999999";
      context.fillText(
        `佰仟车资讯`,
        offset * 1.5,
        lineEndY + this.canvasWidth * 0.226
      );
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
        "获取资讯详情",
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
.header{
  width: 90%;
  margin: 0.2rem auto;
  margin-bottom: 0.1rem;
  .header-title{
    font-size: 0.38rem;
    line-height: 0.6rem;
    letter-spacing: 0.01rem;
    font-weight: 700;
    color: rgba(0,0,0,1);
    text-align:center;
  }
  h2{
    display: flex;
    justify-content: space-between;
    margin-top: 0.6rem;
  }
  .header-log{
    min-width: 1rem;
    height: 0.28rem;
    font-size: 0.28rem;
    font-weight: 400;
    color: rgba(137,148,167,1);
  }
  .header-time{
    display: inline-block;
    height: 0.28rem;
    font-size: 0.28rem;
    font-weight: 400;
    color: rgba(137,148,167,1);
    margin-left: -1.1rem;
  }
  .header-share{
    height: 0.28rem;
    font-size: 0.28rem;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    img{
      width: 0.28rem;
      height: 0.28rem;
    }
  }
}
.noNews{
  width: 90%;
  font-size: 0.3rem;
  text-indent: 0.6rem;
  margin: 0.3rem auto;
  color: #999;
  padding-top: 1.8rem;
  padding-bottom: 1.5rem;
  margin-top: 0.2rem;
  border-top: 0.01rem rgba(221,221,221,1) solid;
}
.body{
  width: 90%;
  margin: 0.3rem auto;
  margin-top: 0.2rem;
  border-top: 0.01rem rgba(221,221,221,1) solid;
  .main{
    width: 100%;
    margin-top: 0.3rem;
    .main-carImg{
      width: 100%;
      //min-height: 2.4rem;  
    }
    .main-content{
      width: 100%;
      margin-top: 0.3rem;
      font-size: 0.30rem;
      font-weight: 400;
      line-height: 0.6rem;
      letter-spacing: 0.01rem;
      text-indent: 0.6rem;
      color: rgba(0,0,0,1);
    }
  }
}
.foot{
  width: 90%;
  font-size: 0.22rem;
  margin: 0.6rem auto;
  margin-bottom: 0.2rem;
  color: #555
}
.comment{
  width: 90%;
  margin: 0.4rem auto;
  border-top: 0.01rem solid rgba(221, 221, 221, 1);
  padding-top: 0.4rem;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  margin-bottom: 1.2rem;
  .all{
    font-size: 0.34rem;
    font-weight: 500;
  }
  .noCom{
    width: 80%;
    margin: 0.3rem auto;
    img{
      display: block;
      width: 2.5rem;
      height: 1.7rem;
      margin: 0.2rem auto;
    }
    p{
      font-size: 0.28rem;
      color: #ccc;
      text-align: center;
    }
  }
  .users{
    display: flex;
    margin: 0.6rem auto;
    img{
      border:0.01rem solid #000;
      width: 0.72rem;
      height: 0.72rem;
      border-radius: 50%;
    }
    div{
      width: 5.6rem;
      margin-left: 0.2rem;
      .p1{
        font-size: 0.28rem;
        color: rgba(64, 101, 153, 1);
        display: flex;
        justify-content: space-between;
        .time{
          font-size: 0.24rem;
          color: rgba(51, 51, 51, 1);
        }
      }
      .p2{
        margin-top: 0.13rem;
        font-size: 0.34rem;
        line-height: 0.68rem;
        word-break: break-all;
      }
    }
  }
  .showBottom{
    font-size: 0.34rem;
    text-align: center;
    line-height: 1.05rem;
    //border-top: 0.01rem solid rgb(230, 222, 222); 
    color: #ccc; 
  }
  .more{
    position: relative;
    font-size: 0.3rem;
    font-weight: 400;
    top: -0.38rem;
    text-align: right;
    text-decoration:underline;
    color: #00c;
  }
}
.write{
  position: fixed;
  height: 0.98rem;
  width: 100%;
  display: flex;
  padding: 0.19rem 0.28rem;
  box-sizing: border-box;
  background:#fff;
  border-top: 1prx solid RGBA(247, 247, 247, 1);
  bottom: 0;
  left: 0;
  z-index: 9;
  img{
    width: 0.3rem;
    height: 0.3rem;
    position: absolute;
    top: 0.4rem;
    left: 0.6rem;
  }
  input{
    width: 6.9rem;
    height: 0.7rem;
    background: #f2f3f5;
    border-radius: 0.35rem;
    font-size: 0.28rem;
    padding-left: 0.75rem;
    box-sizing: border-box;
  }
}
.share {
  width: 100%;
  height: 100%;
  position: fixed;
  bottom: 0;
  z-index: 99;
  background: rgba(0, 0, 0, 0.5);
  .box {
    width: 100%;
    height: 4.6rem;
    position: fixed;
    bottom: 0;
    z-index: 999;
    background: #fff;
    .maskLayer {
      font-size: 0.4rem;
      width: 100%;
      line-height: 1.68rem;
      font-weight: 900;
      text-align: center;
    }
    .choose {
      height: 2rem;
      width: 100%;
      display: flex;
      .friend {
        width: 20%;
        display: inline-block;
        padding: 0;
        border: transparent;
        img {
          width: 1rem;
          height: 1rem;
        }
        p {
          font-weight: 400;
          height: 40%;
          width: 100%;
          margin-top: -30%;
          font-size: 0.32rem;
        }
      }
      .friends {
        width: 20%;
        display: inline-block;
        padding: 0;
        border: transparent;
        img {
          width: 1rem;
          height: 1rem;
        }
        p {
          font-weight: 400;
          height: 40%;
          width: 100%;
          margin-top: -30%;
          font-size: 0.32rem;
        }
      }
    }
  }
}
.canvas-wrapper {
  display: none;
  position: fixed;
  &.show {
    display: block;
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 9999;
  }
  .bargain-canvas {
    display: block;
    margin: 48rpx auto;
    position: relative;
    z-index: 99999;
  }
  .save-img-btn {
    width: 60%;
    background: linear-gradient(
      180deg,
      rgba(254, 235, 167, 1),
      rgba(255, 204, 0, 1)
    );
    border-radius: 40px;
    margin-bottom: 12rpx;
  }
  .cancel-save-btn {
    display: block;
    width: 0.6rem;
    height: 0.6rem;
    margin: 0.3rem auto;
  }
}
</style>
