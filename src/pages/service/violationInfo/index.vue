<template>
  <div class="appointment">
    <span class="title_v"> 车牌号</span>
    <div class="carNumber">{{dataInfo.carNumber}}</div>
    <span class="title_v">违章、罚款、扣分部分</span>
    <div class="mistake">
      <div>
        <p class="number">{{dataInfo.foulCount}}</p>
        <p class="txt">违章</p>
      </div>
      <div>
        <p class="number" id="moneycount">&yen;{{dataInfo.count}}</p>
        <p class="txt">罚款</p>
      </div>
      <div>
        <p class="number" id="degree">{{dataInfo.foulDeduction}}</p>
        <p class="txt">扣分</p>
      </div>
    </div>
    <div class="mistakeDetail" v-for="(item,index) of dataInfo.info" :key="index">
      <p class="time"><span>违章时间:</span>&nbsp;&nbsp;{{item.time}}</p>
      <p class="txt" style="height:1.3rem"><span>违章地点:</span>&nbsp;&nbsp;{{item.location}}</p>
      <p class="txt"><span>违章内容:</span>&nbsp;&nbsp;{{item.reason}}</p>
      <div class="pay">
        <div>罚款金额<span> &yen;{{item.count}}</span></div>
        <div>扣分<span> {{item.degree}}</span></div>
        <div>服务费<span> &yen;{{item.Poundage}}</span></div>
      </div>
    </div>
  </div>
</template>

<script>
import { path, dataConfig } from "@/utils/index";
export default {
  components: {},
  data() {
    return {
      areaName: "", //城市名
      carShelfNumber: "", //车架
      carNumber: "",
      engine: "", //
      country: "",
      province: "",
      city: "",
      district: "",
      cityIndex: [0, 0],
      cityList: [[], []],
      cityData: [],
      dataInfo: ""
    };
  },
  created() {},
  onShow() {
    this.dataInfo = wx.getStorageSync("carViolationInfo");
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.appointment .carNumber {
  width: 100%;
  height: 1.4rem;
  line-height: 1.4rem;
  text-align: center;
  font-size: 0.36rem;
  font-weight: 700;
  background-color: #fff;
  color: #000;
  margin-bottom: 0.01rem;
}
/*违章、罚款、扣分部分*/
.appointment .mistake {
  width: 100%;
  height: 1.6rem;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.3rem;
}
.appointment .mistake div {
  width: 33.3%;
  text-align: center;
}
.appointment .title_v {
  margin-left: 12px;
}
.appointment .mistake div .number {
  font-size: 0.36rem;
  color: #ffa900;
  font-weight: 700;
}
.appointment .mistake div .txt {
  font-size: 0.26rem;
  margin-top: 0.25rem;
}

/*违章详情*/
.appointment .mistakeDetail {
  background: #fff;
  margin-bottom: 0.2rem;
}
.appointment .mistakeDetail p {
  height: 1rem;
  font-size: 0.3rem;
  color: #000;
  border-bottom: 1px solid #f3f3f3;
  padding: 0 0.32rem 0 0.28rem;
}
.appointment .mistakeDetail .time {
  line-height: 1rem;
}
.appointment .mistakeDetail p span {
  color: #a8a8a8;
}
.appointment .mistakeDetail .txt {
  height: 1.8rem;
  margin-top: 0.3rem;
}
.appointment .mistakeDetail .pay {
  width: 100%;
  height: 1rem;
  line-height: 1rem;
  display: flex;
  background: #fff;
}
.appointment .mistakeDetail .pay div {
  width: 33.3%;
  text-align: center;
  font-size: 0.3rem;
}
.appointment .mistakeDetail .pay span {
  color: #ffa900;
}
</style>
