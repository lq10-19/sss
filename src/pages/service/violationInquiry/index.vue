<template>
  <div class="bigbox">
    <!-- <div class="header">
      <p>违章查询</p>
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
            <span class="list-set">{{licensePlate}}</span>
            <input class="list-value" @focus="onhere" v-model.trim="carNumber" placeholder="请输入车牌号">
            <p class="list-icon"></p>
          </div>
        </li>
        <li>
          <div class="set-list">
            <p class="list-title">发动机号</p>
            <input class="list-value" v-model.trim="engine" placeholder="请输入发动机号后6位">
            <p class="list-icon"></p>
          </div>
        </li>
        <li>
          <div class="set-list">
            <p class="list-title">车架号</p>
            <input class="list-value" v-model.trim="carShelfNumber" placeholder="请输入车架号后6位">
            <p class="list-icon"></p>
          </div>
        </li>
      </ul>
    </div>

    <div class="car-tips">
      <span class="title">注：违章查询每天可查询5次</span>
    </div>

    <div class="save-btn">
      <button @click="saveCar">查询</button>
    </div>
  </div>
</template>

<script>
import {
  path,
  dataConfig,
  apiFail,
  getLoginInfo,
  showLoading
} from "@/utils/index";
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
      licensePlate: ""
    };
  },
  created() {},
  onLoad() {
    // 城市
    //
    console.log("请求");
    this.getCityInfo();
  },
  onShareAppMessage(){
    return {
      title: '佰仟易行',
      path: '/pages/service/violationInquiry/main',
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
      let url = path.myCity;
      this.$fly
        .get(url, {})
        .then(data => {
          this.cityData = data;
          this.cityList[0] = [];
          data.forEach(item => this.cityList[0].push(item.name));
          this.cityList[1] = [];
          data[0].list.forEach(item => this.cityList[1].push(item.name));
        })
        .catch(e => apiFail(e));
    },

    bindMultiPickerChange(e) {
      this.cityIndex = e.target.value;
      this.cityIndex = e.target.value;
      let cityArr = [];
      this.cityList.splice(1, 1);
      this.cityData[this.cityIndex[0]].list.forEach(item =>
        cityArr.push(item.name)
      );
      this.cityList.push(cityArr);
      this.getCayCityChek();
    },
    onhere() {
      if (!this.licensePlate) {
        this.getCayCityChek();
      }
    },
    // 获取前缀
    getCayCityChek() {
      let provName = this.cityList[0][this.cityIndex[0]];
      let cityName = this.cityList[1][this.cityIndex[1]];
      console.log(provName, cityName);
      let prov = this.cityData.find(item => item.name === provName);
      if (prov) {
        let city = prov.list.find(item => item.name === cityName);
        if (city) {
          this.licensePlate = city.carnumberprefix;
        } else {
          wx.showToast({
            title: "系统异常",
            icon: "none"
          });
        }
      } else {
        wx.showToast({
          title: "系统异常",
          icon: "none"
        });
      }
    },
    bindMultiPickerColumnChange(e) {
      let target = e.target;
      if (target.column === 0) {
        //省变化
        this.cityIndex[target.column] = target.value;
        let index = e.target.value;
        let cityArr = [];
        this.cityList.splice(1, 1);
        this.cityData[index].list.forEach(item => cityArr.push(item.name));
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
          value => (value.name = this.cityList[0][this.cityIndex[0]])
        );
      let bb =
        aa.list.length > 0 &&
        aa.list.find(
          value => (value.name = this.cityList[1][this.cityIndex[1]])
        );
      let cc = `${this.cityList[0][this.cityIndex[0]]}-${
        this.cityList[1][this.cityIndex[1]]
      }`;
      let dd = `${this.cityList[0][this.cityIndex[0]]}${
        this.cityList[1][this.cityIndex[1]]
      }`;
      let loginInfo = getLoginInfo();
      var queryData = {
        userId: loginInfo.userid,
        city: cc, //城市名
        cityId: bb.cityid, //城市id
        cartype: "02", //车辆类型：默认为02小车
        carnumber: this.licensePlate + this.carNumber, //车牌号
        provinceid: "",
        cardrivenumber: this.engine, //发动机号
        carcode: this.carShelfNumber //车架号
      };
      let url = path.carViolation;
      let promise = this.$fly.post(url, queryData);
      promise.then(data => {
        wx.setStorageSync("carViolationInfo", data);
        var url = "../violationInfo/main";
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
  height: 100%;
  position: absolute;
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
    margin-top: 28rpx;
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
        display: flex;
        flex-direction: row;
        .list-title {
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
          margin-left: 60rpx;
          margin-top: 0.39rem;
          width: 0.12rem;
          height: 0.22rem;
          background: url("../../../../static/img/server/right_arrow.png")
            no-repeat center/100%;
        }
        .list-set {
          display: inline-block;
          height: 50px;
          line-height: 50px;
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
    background: linear-gradient(
      180deg,
      $jbColorTop,
      $jbColorBottom
    );
    border-radius: 0.45rem;

    font-size: 0.36rem;
    font-family: "PingFangSC-Regular";
    font-weight: 400;
    color: #000;
  }
  button:after{
    border: none;
  }
}
</style>
