<template>
  <div class="bigBox">
    <!-- <div class="select-box">
        <ul>
            <li @click="defaultSort">
                <p>综合排序</p>
                <i :class="{'arrows_up':isSelect1,'arrows_down':!isSelect1}"></i>
            </li>
            <li>
                <p>月供</p>
                <i class="arrows_down"></i>
            </li>
            <li @click="isSelect2=!isSelect2;isSelect1=false;isSelect3=false;">
                <p>价格</p>
                <i :class="{'arrows_up':isSelect2,'arrows_down':!isSelect2}"></i>
            </li>
            <router-link to="/brand">
                <li @click="isSelect3=!isSelect3;isSelect1=false;isSelect2=false;">
                    <p :class="{'select_p':isSelect3}">品牌</p>
                    <i :class="{'arrows_up':isSelect3,'arrows_down':!isSelect3}"></i>
                </li>
            </router-link>
            <li style="display:none;">
                <p>筛选</p>
                <i class="select_icon"></i>
            </li>
        </ul>
    </div>-->
    <div class="carinfo-list" @click="getCarList">
      <ul>
        <li class="carinfo-item" v-for="(item,index) in carList" :key="index">
          <div @click="gotoProductDetails(item.productId)">
            <div class="car-left">
              <img :src="item.imgAddress" :style="{width:'216rpx',height:'186rpx'}">
            </div>
            <div class="car-right">
              <p class="car-title">{{item.productName}}</p>
              <p class="guide-price">市场指导价{{item.guidancePrice/10000}}万</p>
              <p class="first-pay">
                <label class="first">首付{{item.downPayment}}元</label>
                <label class="month">月供{{item.monthlySupply}}元</label>
              </p>
              <p class="car-other">含购置税，送1年保险，最高保额100万，加送两次保养</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { path, dataConfig, apiFail, getSystemInfo } from "@/utils/index";
export default {
  components: {},

  data() {
    return {
      brandId: "",
      carList: [],
      productStateId: ""
    };
  },
  onLoad(query) {
    let systemInfo = getSystemInfo();
    this.carList = [];
    this.brandId = query.brandId;
    this.productStateId = query.productStateId;
    if (this.brandId) {
      this.queryCarListByBrandId();
    }
    if (this.productStateId) {
      this.queryCarStatusList();
    }
  },
  methods: {
    // 查询汽车数据
    queryCarListByBrandId() {
      let url = path.carHot;
      let queryData = {
        brandId: this.brandId
      };
      this.$fly
        .post(url, queryData)
        .then(data => {
          this.carList = data;
        })
        .catch(err => apiFail(err));
    },
    queryCarStatusList() {
      let url = path.carHot;
      let queryData = {
        productStateId: this.productStateId
      };
      this.$fly
        .post(url, queryData)
        .then(data => {
          this.carList = data;
        })
        .catch(err => apiFail(err));
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
.select-box {
  width: 100%;
  height: 1rem;
  background: #fff;
  // margin-top:0.88rem;
  ul {
    padding: 0 0.3rem;
    display: flex;
    justify-content: space-between;
  }
  li {
    height: 1rem;
    display: flex;
    justify-content: space-between;
    position: relative;
    list-style: none;
    text-align: center;
    p {
      display: inline-block;
      height: 1rem;
      line-height: 1rem;
      font-size: 0.28rem;
      color: #333;
      font-weight: 700;
    }
    .select_p {
      color: #ff5c5d;
    }
    i {
      display: block;
      width: 0.14rem;
      height: 1rem;
      line-height: 1rem;
      margin-left: 0.16rem;
    }
    // .arrows_up {
    //   background: url("../../../static/images/arrows-select.png") no-repeat center/100%;
    // }
    // .arrows_down {
    //   background: url("../../../static/images/arrows.png") no-repeat center/100%;
    // }
    // .select_icon {
    //   width: 0.22rem;
    //   background: url("../../../static/images/select_icon.png") no-repeat center/100%;
    // }
  }
}
.carinfo-list {
  width: 100%;
  .carinfo-item {
    display: block;
    border-bottom: 1px solid #f3f3f3;
    background: #fff;
    padding: 0.36rem 0.1rem 0.36rem 0.36rem;
    p {
      font-size: 0.24rem;
    }
    .car-left {
      // width: 2.1rem;
      // height: 1.8rem;
      display: inline-block;
      img {
        // width: 100%;
        // height: 100%;
      }
    }
    .car-right {
      margin-left: 0.25rem;
      width: 4.6rem;
      display: inline-block;
      .car-title {
        font-size: 0.32rem;
        color: #333;
        height: 0.36rem;
        line-height: 0.36rem;
        font-weight: 700;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .first-pay {
        display: block;
        font-weight: 700;
        height: 0.5rem;
        line-height: 0.5rem;
        width: 100%;
        color: #fff;

        .first {
          display: inline-block;
          height: 0.5rem;
          width: 1.5rem;
          line-height: 0.5rem;
          background: rgb(255, 102, 0);
          font-size: 0.22rem;
          text-align: center;
        }
        .month {
          display: inline-block;
          height: 0.5rem;
          width: 1.5rem;
          line-height: 0.5rem;
          background: rgba(102, 204, 255, 1);
          font-size: 0.22rem;
          margin-left: 0.4rem;
          text-align: center;
        }
      }
      .guide-price {
        display: inline-block;
        height: 0.43rem;
        line-height: 0.43rem;
        color: #666;
      }
      .car-other {
        display: block;
        height: 0.43rem;
        line-height: 0.43rem;
        color: #999;
      }
      .hotlabel {
        display: block;
        margin-top: 0.12rem;
        span {
          display: inline-block;
          height: 0.43rem;
          line-height: 0.43rem;
          background-image: linear-gradient(0deg, #ff655d, #ff775c);
          color: #fff;
          border-radius: 0.06rem;
          padding: 0 0.07rem;
          font-size: 0.22rem;
          margin-right: 0.1rem;
        }
      }
    }
  }
}
</style>
