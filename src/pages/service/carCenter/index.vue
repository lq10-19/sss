<template>
  <div class="bigbox">
    <!-- <div class="header">
      <p>车辆中心</p>
    </div> -->

    <div class="question-box">
      <ul>
        <li v-for="(item,index) in carListData" :key="index">
          <div class="question-title" @click="showMe(item,index)">
            <img class="car-icon" src="/static/img/icon_car.png" alt="">
            <p class="title-detail">{{item.carNumber}}</p>
            <img class="answer-icon-down" :src="isActive?'/static/img/la_up.png':'/static/img/la_down.png'" alt="">
          </div>
          <div v-show="!item.isActive" class="question-answer">
            <div class="car-list">
              <div class="car-info">
                <p>{{item.foulCount}}</p>
                <p>违章次数</p>
              </div>
              <div class="car-info">
                <p>{{item.foulDeduction}}</p>
                <p>违章扣分</p>
              </div>
              <div class="car-info">
                <p>--</p>
                <p>上次估计</p>
              </div>
            </div>
            <div class="car-detail-box">
              <p><label>所在城市:</label>
                <font>{{item.city}}</font>
                <!-- <router-link :to="{path:'/editCar',query:{idKey:item.idKey}}">
                </router-link> -->
                <img @click="goViewDetails(item)" class="img" src="/static/img/icon_bianji.png" alt="">
              </p>
              <p><label>车架号:</label>
                <font>{{item.carShelfNumber}}</font>
              </p>
              <p><label>发动机号:</label>
                <font>{{item.engine}}</font>
              </p>
              <p><label>品牌车型:</label>
                <font>{{item.brandName}}</font>
              </p>
              <p><label>注册日期:</label>
                <font>{{item.registerDate}}</font>
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div class="add_car" @click="goAddCar">
      <img class="img" src="/static/img/icon_tianjia.png" alt="">
      <p>添加车辆</p>
    </div>
  </div>
</template>

<script>
import { path, dataConfig, getLoginInfo, showLoading } from "@/utils/index";
export default {
  components: {},

  data() {
    return {
      answer1: false,
      carListData: []
    };
  },

  onShow() {
    this.getCarList();
  },
  methods: {
    getCarList() {
      let loginInfo = getLoginInfo();
      let queryData = { userId: loginInfo.userid };
      let url = path.artcList;
      let promise = this.$fly.post(url, queryData);
      promise.then(data => {
        data.forEach((v, i) => {
          v.isActive = true;
        });
        this.carListData = data;
      });
      showLoading(promise);
    },
    // 展开详情
    showMe(item, index) {
      item.isActive = !item.isActive;
      this.carListData = Object.assign([], this.carListData);
    },
    // 跳转编辑详情
    goViewDetails(resData) {
      wx.setStorageSync("ViewDetails", resData);
      var url = "../editCarlnfo/main";
      wx.navigateTo({ url });
    },
    // 新增
    goAddCar() {
      var url = "../addCarlnfo/main";
      wx.navigateTo({ url });
    }
  }
};
</script>

<style lang="scss" scoped>
.bigbox {
  width: 100%;
  background: #f6f6f6;
  .header {
    width: 100%;
    height: 0.8rem;
    line-height: 0.8rem;
    text-align: center;
    background: #fff;
    font-size: 0.36rem;
    font-weight: 700;
    font-family: "PingFangSC-Medium";
    color: rgba(0, 0, 0, 1);
  }
  .question-box {
    width: 100%;
    background: #fff;

    .question-title {
      height: 1.2rem;
      padding-top: 0.3rem;
      .car-icon {
        display: block;
        float: left;
        width: 0.68rem;
        height: 0.45rem;
        margin-top: 0.37rem;
        margin-left: 0.3rem;
      }
      .title-detail {
        display: inline-block;
        float: left;
        margin-left: 0.3rem;
        height: 1.2rem;
        line-height: 1.2rem;
        font-size: 0.32rem;
        font-weight: 400;
        font-family: PingFangSC-Regular;
        color: rgba(0, 0, 0, 1);
      }
      .answer-icon-down {
        display: inline-block;
        float: right;
        margin-right: 0.3rem;
        margin-top: 0.6rem;
        width: 0.22rem;
        height: 0.12rem;
      }
    }
    .question-answer {
      padding: 0 0.55rem;
      p {
        font-size: 0.28rem;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
      }
      .car-list {
        width: 6.3rem;
        height: 1.5rem;
        margin: 0 auto;
        background: linear-gradient(
          -90deg,
          rgba(255, 92, 93, 1),
          rgba(255, 130, 92, 1)
        );
        border-radius: 12px;
        .car-info {
          width: 1.2rem;
          height: 1.2rem;
          float: left;
          margin-top: 0.2rem;
          margin-left: 0.62rem;
          p {
            width: 100%;
            font-size: 0.28rem;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            line-height: 0.6rem;
            text-align: center;
            color: rgba(249, 249, 249, 1);
          }
        }
      }
      .car-detail-box {
        margin-top: 6px;
        p {
          display: block;
          width: 100%;
          height: 0.6rem;
          label {
            display: inline-block;
            float: left;
            width: 1.5rem;
            height: 0.6rem;
            line-height: 0.6rem;
            font-size: 0.3rem;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
          }
          font {
            display: inline-block;
            float: left;
            width: 3rem;
            height: 0.6rem;
            line-height: 0.6rem;
            color: rgba(51, 51, 51, 1);
            font-family: PingFangSC-Regular;
            font-size: 0.3rem;
          }
          .img {
            float: right;
            width: 0.4rem;
            height: 0.4rem;
            padding: 0.16rem;
            margin-top: 0.14rem;
            margin-right: 0.3rem;
          }
        }
      }
    }
  }
  .add_car {
    // width: 100%;
    height: 1.2rem;
    background: #fff;
    margin-top: 0.2rem;
    .img {
      display: block;
      float: left;
      margin-top: 0.32rem;
      margin-left: 0.3rem;
      width: 0.56rem;
      height: 0.56rem;
    }
    p {
      display: inline-block;
      width: 2rem;
      height: 1.2rem;
      line-height: 1.2rem;
      font-size: 0.32rem;
      font-family: "PingFangSC-Regular";
      font-weight: 400;
      color: rgba(0, 0, 0, 1);
      margin-left: 0.3rem;
    }
  }
}
</style>
