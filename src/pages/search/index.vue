<template>
  <div>
    <div class="input-wrapper">
      <img class="img" src="/static/icon/searchChange.png">
      <input class="input" placeholder="搜索车型/品牌" 
          v-model="searchVal" @input="search()" 
          @compositionstart="compositionstart" 
          @compositionend="compositionend">
    </div>
    <ul class="product_name" v-if="searchDown">
        <li v-for="item in searchList"  :key="item.productId"  @click="goProduct(item)">
            <p>{{item.productName}}</p>
        </li> 
    </ul>
    <!-- <div class="section" v-if="!searchDown">
      <p class="title">历史搜索记录</p>
      <ul class="list">
        <li>无</li>
      </ul>
    </div> -->
    <div class="section" v-if="!searchDown">
      <p class="title">热门品牌</p>
      <ul class="list">
        <li v-for="item in hotBrand" :key="item.brandId" @click="toCarList(item.brandId)">
          {{item.brandName}}
        </li>
      </ul>
    </div>
    <div class="section" v-if="!searchDown">
      <p class="title">热门车型</p>
      <ul class="list">
        <li v-for="item in carRenderList" :key="item.productId" @click="gotoProductDetails(item.productId)">
          {{item.productName}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { path, dataConfig } from "@/utils/index";
export default {
  components: {},

  data() {
    return {
      hotBrand: [],
      carRenderList: [],
      searchList: [],
      searchVal: "",
      isInputZh: false,
      searchDown: false
    };
  },
  onShow() {
    this.getBrandData();
    this.getCarListData();
  },
  methods: {
    compositionstart() {
      this.isInputZh = true;
    },
    compositionend() {
      this.isInputZh = false;
      if (this.searchVal.trim().length === 0) {
        this.searchDown = true;
      } else {
        this.searchDown = false;
      }
    },
    search() {
      if (this.isInputZh) return;
      if (this.searchVal.trim().length === 0) {
        this.searchDown = false;
        return;
      }
      let queryData = {
        name: this.searchVal
      };
      this.searchDown = true;
      let url = path.getSearch;
      this.$fly
        .post(url, queryData)
        .then(data => {
          this.searchList = data || [];
        })
        .catch(err => {
          console.log(err);
        });
    },
    goProduct(item) {
      if (item.mark === "1") {
        let brandId = item.productId;
        wx.navigateTo({
          url: `/pages/car/main?brandId=${brandId}`
        });
      }
      if (item.mark === "2") {
        let productId = item.productId;
        wx.navigateTo({
          url: `/pages/productDetails/main?productId=${productId}`
        });
      }
    },
    gotoProductDetails(productId) {
      wx.navigateTo({
        url: `/pages/productDetails/main?productId=${productId}`
      });
    },
    getBrandData() {
      //获取热门品牌
      var url = path.hotBrand;
      var queryData = { brandStateId: dataConfig.hotCarId };
      this.$fly
        .post(url, queryData)
        .then(data => {
          this.hotBrand = data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //新车辆列表
    getCarListData(productStateId) {
      //获取新车辆列表
      var url = path.carHot;
      var queryData = { productStateId: "2" };
      this.$fly
        .post(url, queryData)
        .then(data => {
          this.carRenderList = data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    toCarList(brandId) {
      const url = `../car/main?brandId=${brandId}`;
      wx.navigateTo({ url });
      wx.showToast({
        title: "加载中...",
        image: "/static/icon/loading.gif",
        duration: 500
      });
    },
    gotoProductDetails(productId) {
      wx.navigateTo({
        url: `/pages/productDetails/main?productId=${productId}`
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.input-wrapper {
  width: 510rpx;
  height: 60rpx;
  line-height: 60rpx;
  background: rgba(237, 237, 237, 1);
  border-radius: 30rpx;
  position: relative;
  left: 60px;
  .img {
    display: inline-block;
    width: 16px;
    height: 16px;
    position: absolute;
    left: 40px;
    top: 9px;
  }
  .input {
    text-align: center;
    font-size: 14px;
    display: inline-block;
    padding-left: 127rpx;
    height: 60rpx;
    width: 510rpx;
    text-align: left;
  }
}
.product_name {
  width: 100%;
  margin-top: 14rpx;
  li {
    list-style: none;
    width: 100%;
    height: 100rpx;
    background: #ffffff;
    border: 2rpx solid #eeeeee;
    line-height: 100rpx;
    p {
      margin-left: 46rpx;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: 30rpx;
    }
  }
}
.section {
  padding-left: 30rpx;
  margin-top: 22px;
  .title {
    font-size: 32rpx;
    font-weight: 600;
    margin-bottom: 28rpx;
  }
  .list {
    li {
      display: inline-block;
      width: 144rpx;
      height: 64rpx;
      background: rgba(242, 242, 242, 1);
      border-radius: 32rpx;
      text-align: center;
      font-size: 13px;
      color: #666666;
      line-height: 64rpx;
      margin-right: 20rpx;
      margin-bottom: 28rpx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
