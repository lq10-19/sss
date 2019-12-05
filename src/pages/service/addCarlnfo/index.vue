<template>
  <div class="bigbox">
    <!-- <div class="header">
      <p>添加车辆信息</p>
    </div>-->
    <div class="userset-box">
      <ul>
        <li class="apply-info">
          <div class="form-item set-list">
            <label>所在城市</label>
            <picker
              mode="multiSelector"
              @change="bindMultiPickerChange"
              @columnchange="bindMultiPickerColumnChange"
              :value="cityIndex"
              :range="cityList"
            >
              <view class="picker">{{cityList[0][cityIndex[0]]}}-{{cityList[1][cityIndex[1]]}}</view>
            </picker>
          </div>
        </li>
      </ul>
    </div>

    <div class="userset-box">
      <ul>
        <li>
          <div class="set-list">
            <p class="list-title">车牌号</p>
            <p class="list-icon"></p>
            <input class="list-value" v-model="carNumber" placeholder="请输入车牌号">
          </div>
        </li>
        <li>
          <div class="set-list">
            <p class="list-title">发动机号</p>
            <p class="list-icon"></p>
            <input class="list-value" v-model="engine" placeholder="请输入发动机号后6位">
          </div>
        </li>
        <li>
          <div class="set-list">
            <p class="list-title">车架号</p>
            <p class="list-icon"></p>
            <input class="list-value" v-model="carShelfNumber" placeholder="请输入车架号后6位">
          </div>
        </li>
        <!-- <li>
          <div class="set-list" @click="goCar">
            <p class="list-title">品牌车型</p>
            <p class="list-icon"></p>
            <input class="list-value"  placeholder="请选择品牌车型" disabled>
          </div>
        </li> -->
        <li>
          <div class="set-list set-list-data">
            <view class="section">
              <!-- <view class="list-title">注册日期</view> -->
              <p class="list-title">注册日期</p>
              <p class="list-icon"></p>
              <picker
                mode="date"
                :value="date"
                start="2000-09-01"
                end="2200-09-01"
                @change="bindDateChange"
              >
                <view class="list-value">{{date}}</view>
                <!-- <input v-model="date"  class="list-value" readonly placeholder="请选择注册日期"> -->
              </picker>
            </view>
          </div>
        </li>
      </ul>
    </div>

    <div class="car-tips">
      <span class="title">注：违章查询每天可查询5次</span>
    </div>

    <div class="save-btn">
      <button @click="saveCar">保存</button>
    </div>
  </div>
</template>

<script>
import {
  path,
  dataConfig,
  getLoginInfo,
  apiFail,
  showLoading
} from "@/utils/index";
export default {
  components: {},
  data() {
    return {
      date: "2010-01-01",
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
      cityData: []
    };
  },
  onLoad() {
    // 城市
    this.getCityInfo();
  },
  onShareAppMessage(){
    return {
      title: '佰仟易行',
      path: '/pages/service/addCarlnfo/main',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  methods: {
    // 获取城市列表
    getCityInfo() {
      let url = path.carCityList;
      this.$fly
        .post(url, {})
        .then(data => {
          data.sort((a, b) => parseInt(a.prov_id) - parseInt(b.prov_id));
          this.cityData = data;
          this.cityList[0] = [];
          data.forEach(item => this.cityList[0].push(item.prov_name));
          this.cityList[1] = [];
          data[0].item.forEach(item => this.cityList[1].push(item.cityname));
        })
        .catch(error => {
          console.log("error", error);
        });
    },

    bindDateChange: function(e) {
      this.date = e.target.value;
    },
    bindMultiPickerChange(e) {
      this.cityIndex = e.target.value;
      let cityArr = [];
      this.cityList.splice(1, 1);
      this.cityData[this.cityIndex[0]].item.forEach(item =>
        cityArr.push(item.cityname)
      );
      this.cityList.push(cityArr);
    },

    bindMultiPickerColumnChange(e) {
      let target = e.target;
      if (target.column === 0) {
        //省变化
        this.cityIndex[target.column] = target.value;
        let index = e.target.value;
        let cityArr = [];
        this.cityList.splice(1, 1);
        this.cityData[index].item.forEach(item => cityArr.push(item.cityname));
        this.cityList.push(cityArr);
      }
      if (target.column === 1) {
        this.cityIndex[target.column] = target.value;
      }
    },
    saveCar() {
      let aa =
        this.cityData.length > 0 &&
        this.cityData.find(
          value => (value.prov_name = this.cityList[0][this.cityIndex[0]])
        );
      let bb =
        aa.item.length > 0 &&
        aa.item.find(
          value => (value.cityname = this.cityList[1][this.cityIndex[1]])
        );
      let cc = `${this.cityList[0][this.cityIndex[0]]}-${
        this.cityList[1][this.cityIndex[1]]
      }`;
      let loginInfo = getLoginInfo();
      var queryData = {
        userId: loginInfo.userid,
        city: cc, //城市名
        cityId: bb.cityid, //城市id
        carNumber: this.carNumber, //车牌号
        engine: this.engine, //发动机号
        carShelfNumber: this.carShelfNumber, //车架号
        registerDate: this.date //日期
      };

      let url = path.addCarServiceInfo;
      let promise = this.$fly.post(url, queryData);
      promise.then(data => {
        let title = "添加成功";
        let url = `/pages/service/addSuccess/main?title=${title}`;
        wx.navigateTo({ url });
      });
      showLoading(promise);
    }
  }
};
</script>

<style lang="scss" scoped>
$jbColorTop: rgba(255,224,86,1);
$jbColorBottom: #FFCC00;
.bigbox {
  width: 100%;
  background: #f6f6f6;
}
.header {
  width: 100%;
  height: 0.8rem;
  line-height: 0.8rem;
  text-align: center;
  background: #fff;
  text-align: center;
  font-size: 0.36rem;
  font-weight: 700;
  font-family: "PingFangSC-Medium";
  color: rgba(0, 0, 0, 1);
}
.apply-info {
  background-color: white;
  width: 100%;
  display: block;
  .form-item {
    display: block;
    height: 50px;
    padding-left: 15px;
    label {
      display: inline-block;
      width: 80px;
      height: 50px;
      padding-right: 15px;
      font-size: 16px;
      line-height: 50px;
    }
  }
  input {
    display: inline-block;
    font-size: 16px;
  }
  picker {
    display: inline-block;
    font-size: 16px;
  }
}
.userset-box {
  width: 100%;
  background: #fff;
  margin-top: 0.3rem;
  ul {
    li {
      .set-list {
        height: 1rem;
        border-bottom: 0.01rem solid rgba(153, 153, 153, 0.1);
        .list-title {
          display: inline-block;
          float: left;
          height: 1rem;
          margin-left: 0.3rem;
          line-height: 1rem;
          font-size: 0.32rem;
          font-weight: 400;
          font-family: PingFangSC-Regular;
          color: rgba(0, 0, 0, 1);
          width: 1.8rem;
        }
        .list-icon {
          display: inline-block;
          float: right;
          margin-right: 0.3rem;
          margin-top: 0.39rem;
          width: 0.12rem;
          height: 0.22rem;
          background: url("../../../../static/img/server/right_arrow.png")
            no-repeat center/100%;
        }
        .list-value {
          display: inline-block;
          float: left;
          height: 50px;
          line-height: 50px;
        }
        .list-input {
          width: 3rem;
        }
        .list-verify {
          display: inline-block;
          float: right;
          width: 1.45rem;
          height: 0.8rem;
          background: red;
          margin-top: 0.1rem;
          margin-right: 0.3rem;
        }
      }
    }
  }
}
.car-tips {
  width: 100%;
  height: 0.5rem;
  margin-top: 0.3rem;
  padding-left: 0.3rem;
  .title {
    height: 0.5rem;
    line-height: 0.5rem;
    font-size: 0.26rem;
    font-family: "PingFangSC-Regular";
    font-weight: 400;
    color: #888;
  }
}
.save-btn {
  width: 100%;
  height: 0.9rem;
  margin-top: 0.75rem;
  button {
    display: block;
    width: 5.8rem;
    height: 0.9rem;
    margin: 0 auto;
    background: linear-gradient(180deg,$jbColorTop, $jbColorBottom);
    border-radius: 0.45rem;

    font-size: 0.36rem;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: #000;
  }
  button:after{
    border: none;
  }
}
</style>
