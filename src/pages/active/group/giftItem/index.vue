<template>
  <div class="product-detail">
    <div class="teamNum">
      <p>
        本次开奖已有
        <span>{{goodsData.haveOpenTeam}}</span>
        个团获得了抽奖机会！
      </p>
    </div>
    <div class="gift-imgs">
      <swiper
        :indicator-dots="true"
        class="swiper"
        :autoplay="true"
        :interval="3000"
        :duration="500"
        :circular="true"
      >
        <swiper-item v-for="item in goodsData.awardImage" :key="item.objectId">
          <img :src="item.httpUrl">
        </swiper-item>
      </swiper>
    </div>
    <div class="time">
      <p v-if="goodsData.isDelete=='2'">{{goodsData.firstAwardTime}}&nbsp;{{goodsData.openAwardTime}}开奖</p>
      <p v-if="goodsData.isDelete=='1'" style="color:#666">已开奖</p>
    </div>
    <div class="gift-info">
      <p class="name">{{goodsData.awardName}}</p>
      <div class="price">
        <span class="span1">价值 ￥{{goodsData.awardPrice}}</span>
        <span class="span2">|</span>
        <span class="span3">奖品数量：{{goodsData.awardNumber}}件</span>
      </div>
    </div>
    <!-- 中奖规则开关 -->
    <div class="ruleFlag" @click="openRule">
      <img src="../../../../../static/icon/up@2x.png" :class="{rotate:rulesFlag}">
    </div>
    <!-- 隔开 -->
    <div class="crossBar" v-if="rulesFlag"></div>
    <!--中奖规则-->
    <div class="rule" v-if="rulesFlag">
      <div class="title">
        <div class="con">
          <span class="left"></span>
          <span class="middle">中奖规则</span>
          <span class="right"></span>
        </div>
      </div>
      <div class="proBox">
        <p>1、截至开奖时间，本款产品满{{goodsData.openCondition}}个团即可开奖；</p>
        <p v-if="goodsData.awardMode=='a'">2、奖品分配方式：开奖后在满员团中随机抽取1人中奖；</p>
        <p v-if="goodsData.awardMode=='b'">2、奖品分配方式：开奖后在满员团中随机抽取1个团全体中奖；</p>
        <p>3、奖品将在本次活动结束后7个工作日内发出；</p>
        <p>4、每款产品可以重复开团，开团数越多中奖概率越高。</p>
      </div>
    </div>
    <!-- 隔开 -->
    <div class="crossBar"></div>
    <div class="Participant">
      <p v-if="!full">已有{{goodsData.teamNumber}}人参团，还差{{goodsData.disparityNumber}}人成团</p>
      <p v-if="full">已有{{goodsData.teamNumber}}人参团，本团已满员！</p>
      <div class="users">
        <div class="usersItem" v-for="(item,index) in goodsData.result" :key="index">
          <img :src="item.photo">
          <p>{{item.name}}</p>
        </div>
      </div>
    </div>

    <div class="bottom">
      <button plain
        :disabled="full"
        :class="{full:full||goodsData.isDelete=='1'}"
        open-type="share"
      >邀请好友组团抽奖</button>
    </div>
    <!-- <div class="share" v-if="choose">
      <div class="box">
        <div class='maskLayer'>
          请选择分享平台
        </div>
        <view class='choose'>
          <button plain open-type='share' class="friend">
            <img src="../../../../../static/homeImg/icon_pay@2x.png">
            <p>微信</p>
          </button>
          <button plain class="friends" @click="showImg()" >
            <img src="../../../../../static/homeImg/icon_pay@2x.png">
            <p>微信朋友圈</p>
          </button>
        </view>
        <button @click='share' class="cancel">取消分享</button>
      </div>  
    </div>-->
    <!-- 分享保存图片 -->
    <!-- <div class="canvas-wrapper" :class="{ show: isShowImg }">
      <canvas
        class="bargain-canvas"
        canvas-id="bargainCanvas"
        :style="{width:canvasWidth+'px',height:canvasHeight+'px'}"
      ></canvas>
      <button class="save-img-btn" @click="savePoster">点击保存后发朋友圈</button>
      <button class="cancel-save-btn" @click="cancelSavePoster">取消</button>
    </div>-->
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
      goodsData: {
        awardImage: []
      },
      full: false, //组团人数满员
      //choose: false, //分享弹窗开关
      //isShowImg: false, //画布分享开关
      gift: '', //奖品名称
      rulesFlag: false, //默认规则不显示
      awardId: "", //奖品id
    };
  },
  onLoad(query) {
    //组团抽奖活动参与人数埋点
    getApp().aldstat.sendEvent(event["group.active.join"]);
    // wx.setStorageSync('key', 'value')
  },
  onShow() {
    //传teamId获得组团信息
    this.teamData();
    this.isSelected = true;
    this.isShowPlansTab = false;
    //this.getProductData(this.productId);
  },
  //分享链接
  // onShareAppMessage(options) {
  //   let buyerUserId = loginInfo.userid;
  //   let goodsId = wx.getStorageSync("bargainOptions").goodsId;
  //   let bargainId = wx.getStorageSync("bargainOptions").bargainId;
  //   let path = `/pages/active/bargain/main?buyerUserId=${buyerUserId}&goodsId=${goodsId}&bargainId=${bargainId}`;
  //   console.log("path", path);
  //   return {
  //     title: "一起来组团抽大奖！",
  //     path: path,
  //     success: function(res) {
  //       // 转发成功
  //     },
  //     fail: function(res) {
  //       // 转发失败
  //     }
  //   };
  // },
  onShareAppMessage(options) {
    // let buyerUserId = loginInfo.userid;
    // let goodsId = wx.getStorageSync("bargainOptions").goodsId;
    // let bargainId = wx.getStorageSync("bargainOptions").bargainId;
    // let path = `/pages/active/bargain/main?buyerUserId=${buyerUserId}&goodsId=${goodsId}&bargainId=${bargainId}`;
    // console.log("path", path);
    return {
      title: `就差你了快上车，一起抽${this.gift}！`,
      // path: path,
      path: `pages/active/group/newUser/main?teamId=${this.$root.$mp.query.teamId}&userId=${
        getLoginInfo().userid
      }&awardId=${this.awardId}`,
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    };
  },
  methods: {
    //获得组团信息
    teamData() {
      let url = path.queryOneTeamDetails;
      let params = Object.assign({}, this.$root.$mp.query, {
        userId: getLoginInfo().userid
      });
      console.log(params, 11);
      let promises = this.$fly.get(url, params);
      showLoading(promises);
      promises
        .then(data => {
          console.log(data,818);
          this.goodsData = data;
          this.gift = data.awardName;
          this.awardId = data.awardId;
          //模拟空缺组团人
          for(let i=0;i<this.goodsData.disparityNumber*1;i++){
            let robot = {photo:'../../../../../static/img/mylogo.png',name:" "};
            this.goodsData.result.push(robot);
          }
          if (data.isFull == '1') {
            this.full = true;
          } else if(data.isFull == '0'){
            this.full = false;
          }
        })
        .catch(e => {
          apiFail(e);
        });
    },
    //弹窗data
    // getProductData(id) {
    //   let queryData = { productId: id };
    //   let url = path.carModelInfo;
    //   this.$fly
    //     .post(url, queryData)
    //     .then(data => {
    //       this.getProductDataSuccess(data);
    //     })
    //     .catch(error => {
    //       apiFail(error);
    //     });
    // }
    //分享弹窗
    // share() {
    //   this.choose = !this.choose
    // },

    //活动规则开关
    openRule() {
      this.rulesFlag = !this.rulesFlag;
    },
  }
};
</script>

<style lang="scss" scoped>
.product-detail {
  //background-color: #f1f2f4;
  font-size: 0.24rem;
}
.teamNum {
  width: 100%;
  height: 0.6rem;
  font-size: 0.28rem;
  color: #fff;
  background: #000;
  line-height: 0.6rem;
  font-weight: 600;
  text-align: center;
  span {
    color: red;
  }
}
.gift-imgs {
  width: 100%;
  height: 5.4rem;
  .swiper {
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
      display: block;
      margin: auto;
    }
  }
}
.time {
  width: 100%;
  height: 0.8rem;
  line-height: 0.8rem;
  font-size: 0.28rem;
  padding-left: 0.28rem;
  background: #fff;
}
.gift-info {
  padding-left: 0.28rem;
  padding-bottom: 0.28rem;
  background: #fff;
  //margin-bottom: 0.2rem;
  .name {
    font-size: 0.36rem;
    font-weight: 600;
    color: rgba(0, 0, 0, 1);
    line-height: 0.44rem;
  }
  .price {
    color: #666;
    font-size: 0.26rem;
    line-height: 0.44rem;
    margin-top: 0.2rem;
    .span1 {
      color: #ff4747;
    }
    .span2 {
      display: inline-block;
      margin: 0 0.5rem;
      font-size: 0.22rem;
    }
    .span3 {
      font-size: 0.26rem;
    }
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
    margin-top: 20rpx;
  }
  .rotate{
    transform:rotate(180deg);
  }
}
.crossBar {
  width: 100%;
  height: 20rpx;
  background-color: #f2f3f5;
}
/*中奖规则*/
.rule {
  width: 100%;
  background: #fff;
  margin-bottom: 0.2rem;
  font-size: 0.36rem;
  .title {
    height: 0.9rem;
    line-height: 0.9rem;
    width: 100%;
    position: relative;
    .con {
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      -webkit-box-align: center;
      -webkit-align-items: center;
      align-items: center;
      position: absolute;
      left: 50%;
      margin-top: 0.2rem;
      -webkit-transform: translateX(-50%);
    }
    .left {
      height: 1px;
      width: 0.38rem;
      background: #000;
      margin: 0.42rem 0;
    }
    .middle {
      height: 0.86rem;
      line-height: 0.86rem;
      color: #000;
      text-align: center;
      margin: 0 0.19rem;
      font-weight: bold;
    }
    .right {
      height: 1px;
      width: 0.38rem;
      background: #000;
      margin: 0.42rem 0;
    }
  }
  .proBox {
    font-size: 0.28rem;
    line-height: 0.56rem;
    width: 90%;
    position: relative;
    margin: 0.2rem auto;
    padding-bottom: 0.3rem;
  }
}
.Participant {
  width: 100%;
  background: #fff;
  margin-top: 0.2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 0.36rem;
  padding-top: 0.2rem;
  padding-bottom: 0.3rem;
  p {
    font-weight: 600;
    margin: 0.2rem auto;
    white-space:nowrap; 
    overflow:hidden; 
    text-overflow:ellipsis;
  }
  .users {
    width: 90%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 0 auto;
    justify-content: space-around;
    .usersItem {
      display: inline-block;
      margin-top: 0.3rem;
      text-align: center;
      max-width: 150rpx;
      img {
        display: inline-block;
        width: 1rem;
        height: 1rem;
        border: 0.01rem solid RGBA(230, 230, 230, 1);
        border-radius: 50%;
      }
      p {
        width: 1.5rem;
        height: 0.4rem;
        font-size: 28rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
.bottom {
  position: fixed;
  bottom: 50rpx;
  left: 10%;
  width: 80%;
  border-radius: 50rpx;
  button {
    // background: #000;
    color: #000;
    border-radius: 50rpx;
    border: none;
    font-weight: 400;
  }
  .full {
    background: #b2b2b2;
    color: #fff;
    border-radius: 0rem;
  }
}
.bottom{
  background-image:-webkit-gradient(linear,left top,left bottom,from(#efd0b6),to(#e0b782));
	-webkit-animation-timing-function:ease-in-out;
	-webkit-animation-name:breathe;
	-webkit-animation-duration:500ms;
	-webkit-animation-iteration-count:infinite;
	-webkit-animation-direction:alternate;
}
@-webkit-keyframes breathe {
	0% {
    opacity:1;
    background:linear-gradient(183deg,rgba(239,208,182,1),rgba(224,183,130,1));
    box-shadow:0 1px 2px rgba(255,255,255,0.1);
  }
  100% {
    opacity:1;
    background:linear-gradient(183deg,rgba(239,208,182,1),rgba(224,183,130,1));  
    box-shadow:0 1px 30px #efd0b6;
    transform:scale(.95)
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
    position: fixed;
    bottom: 0;
    .maskLayer {
      font-size: 0.44rem;
      width: 100%;
      line-height: 0.6rem;
      font-weight: 900;
      text-align: center;
    }
    .choose {
      height: 1.5rem;
      width: 100%;
      display: flex;
      .friend {
        width: 20%;
        display: inline-block;
        padding: 0;
        border: transparent;
        img {
          width: 100%;
          height: 60%;
        }
        p {
          height: 40%;
          width: 100%;
          margin-top: -30%;
          font-size: 0.28rem;
        }
      }
      .friends {
        width: 20%;
        display: inline-block;
        padding: 0;
        border: transparent;
        img {
          width: 100%;
          height: 60%;
        }
        p {
          height: 40%;
          width: 100%;
          margin-top: -30%;
          font-size: 0.28rem;
        }
      }
    }
  }
}
</style>
