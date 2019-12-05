<template>
    <div class="main">
        <ul class="end"  v-for="(item,index) in carData" :key="index">
            <li class="top">
                <div>品牌名称：{{item.brand_name}}</div><div>车系名称：{{item.series_name}} </div>
            </li>
            <li class="center">
                <span>车型名称：{{item.model_name}}</span>
            </li>
            <li class="bottom">
                <img src="http://bqyx-qiniu.bqrzzl.com/bg1@3x.png" alt="">
                <img src="http://bqyx-qiniu.bqrzzl.com/bg2@3x.png" alt="">
                <div>
                  <span class="span1">新车指导价</span>
                  <span class="span3">{{item.model_price}}万</span>
                  <span class="span2">二手车评估价格</span>
                  <span class="span4">{{item.dealer_price}}万</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import { path, showLoading, apiFail } from "@/utils/index";
export default {
  data() {
    return {
      carData: []
    };
  },
  onShow() {
    this.carData = [];
  },
  onLoad(query) {
    let queryData = { vin: query.vin };
    let url = path.cayChek;
    let promise = this.$fly.post(url, queryData);
    promise
      .then(data => {
        this.vin = data.vin;
        this.carData = data;
      })
      .catch(e => apiFail(e));
    showLoading(promise);
  },

  methods: {}
};
</script>



<style lang="scss" scoped>
.main {
  height: 100%;
  // height: 100vh;
  padding: 15px 15px 0 15px;
  background-color: #f3f3f3;
  .end {
    height: 240px;
    background-color: #ffffff;
    border-radius: 13px;
    margin-bottom: 10px;
    .top {
      display: flex;
      flex-direction: row;
      align-content: space-between;
      div {
        margin-top: 30px;
        // align-content: space-between;
        margin-left: 16px;
        flex: 0 0 50%;
        font-size: 13px;
      }
    }
    .center {
      display: flex;
      flex-direction: row;
      align-content: space-between;
      font-size: 13px;
      margin-top: 19px;
      margin-left: 16px;
    }
    .bottom {
      img {
        width: 164px;
        height: 144px;
        margin-left: 8px;
        margin-top: 9px;
      }
      .span1 {
        position: absolute;
        margin-top: -130px;
        margin-left: 18px;
        color: #ffffff;
      }
      .span2 {
        position: absolute;
        margin-top: -130px;
        margin-left: 195px;
        color: #ffffff;
      }
      .span3 {
        display: flex;
        position: absolute;
        // float: left;
        margin-top: -90px;
        margin-left: 18px;
        color: #ffffff;
        font-size: 37px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .span4 {
        display: flex;
        position: absolute;
        //   float: left;
        margin-top: -90px;
        margin-left: 195px;
        color: #ffffff;
        font-size: 37px;
      }
    }
  }
}
</style>
