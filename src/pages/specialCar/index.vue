<template>
  <div class="bigBox">
    <div class="banner" v-if="labelName == '万元家用车'">
      <img src="http://bqyx-qiniu.bqrzzl.com/banner1.png">
    </div>
    <div class="banner" v-if="labelName == '准新车'">
      <img src="http://bqyx-qiniu.bqrzzl.com/banner2.png">
    </div>
    <div class="banner" v-if="labelName == '入门首选'">
      <img src="http://bqyx-qiniu.bqrzzl.com/banner3.png">
    </div>
    <div class="banner" v-if="labelName == '限时特卖'">
      <img src="http://bqyx-qiniu.bqrzzl.com/banner4.png">
    </div>
    <div class="carinfo-list" @click="getCarList">
      <ul>
        <li class="carinfo-item" v-for="(item,index) in carList" :key="index">
          <div @click="gotoProductDetails(item.carId)">
            <div class="car-left">
              <img :src="item.carImage">
            </div>
            <div class="car-right">
              <p class="car-title">{{item.carName}}</p>
              <p class="guide-price">{{item.mileage}}万公里 | {{item.registerDate}}上牌</p>
              <p class="first-pay">
                售价
                <span>{{item.salePrice}}</span> 万
              </p>
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
  getLoginInfo,
  getSystemInfo,
  apiFail,
  getSceneCode,
  setSceneCode,
  showLoading,
  NumberAnimate
} from "@/utils/index";
export default {
  components: {},
  data() {
    return {
      brandId: "",
      carList: [],
      newsDataList: [],
      pageIndex: 1,
      labelId: "",
      labelName: ""
    };
  },
  onLoad(query) {
    //授权登陆
    if (!getLoginInfo()) {
      const url = "/pages/login/main";
      wx.navigateTo({
        url
      });
      return;
    }
    this.labelId = query.labelId;
    this.labelName = query.labelName;
    console.log(this.labelId, this.labelName);
  },
  onShow() {
    this.carList = [];
    this.newsDataList = [];
    this.pageIndex = 1;
    this.getByLabel();
  },
  methods: {
    // 查询汽车数据
    getByLabel() {
      let url = path.getByLabel;
      let queryData = {
        labelId: this.labelId,
        pageNo: this.pageIndex
      };
      this.$fly
        .post(url, queryData)
        .then(data => {
          if (data.totalCount > 0) {
            this.newsDataList = data.infoList;
            this.carList = this.carList.concat(this.newsDataList);
          }
        })
        .catch(err => apiFail(err));
    },
    //跳转H5
    gotoProductDetails(options) {
      let carId = encodeURIComponent(options);
      wx.navigateTo({
        url: `/pages/carItem/main?carId=${carId}`
      });
    }
  },
  //上拉触底
  onReachBottom() {
    this.pageIndex = this.pageIndex + 1;
    this.getByLabel();
  }
};
</script>

<style lang="scss" scoped>
.banner {
  img {
    width: 750rpx;
    height: 290rpx;
  }
}
.carinfo-list {
  width: 100%;
  .carinfo-item {
    display: block;
    border-bottom: 1rpx solid #f3f3f3;
    background: #fff;
    padding: 40rpx 0 40rpx 30rpx;
    position: relative;
    .car-left {
      display: inline-block;
      img {
        width: 258rpx;
        height: 190rpx;
        border-radius: 6rpx;
        border: 1rpx solid #f3f3f3;
      }
    }
    .car-right {
      position: absolute;
      margin-left: 21rpx;
      width: 385rpx;
      display: inline-block;
      .car-title {
        width: 385rpx;
        min-height: 96rpx;
        font-size: 30rpx;
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        color: rgba(51, 51, 51, 1);
        line-height: 48rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        line-clamp: 2;
      }
      .guide-price {
        font-size: 26rpx;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(141, 142, 153, 1);
        line-height: 50rpx;
      }
      .first-pay {
        font-size: 26rpx;
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        color: rgba(255, 92, 93, 1);
        line-height: 48rpx;
        span {
          font-size: 40rpx;
        }
      }
    }
  }
}
</style>
