<template>
  <div class="bigbox">
    <div class="header">
      <div @click="goBack" class='header_left'>
        <p></p>
      </div>
      <div class='header_center'>
        <p></p>
      </div>
      <div class='header_right' @click='deleteData'>
        <p>删除车辆</p>
      </div>
    </div>

    <div class="userset-box">
      <ul>
        <li class="apply-info">
          <div class="form-item set-list">
            <label>所在城市</label>
            <picker mode="multiSelector" @change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange" :value="cityIndex" :range="cityList">
              <view class="picker">
                {{cityList[0][cityIndex[0]]}}-{{cityList[1][cityIndex[1]]}}
              </view>
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
            <input class="list-value" v-model="editData.carNumber" placeholder="请输入车牌号">
          </div>
        </li>
        <li>
          <div class="set-list">
            <p class="list-title">发动机号</p>
            <p class="list-icon"></p>
            <input class="list-value" v-model="editData.engine" placeholder="请输入发动机号后6位">
          </div>
        </li>
        <li>
          <div class="set-list">
            <p class="list-title">车架号</p>
            <p class="list-icon"></p>
            <input class="list-value" v-model="editData.carShelfNumber" placeholder="请输入车架号后6位" >
          </div>
        </li>
        <li>
          <div class="set-list" @click="goCarBrand">
            <p class="list-title">品牌车型</p>
            <p class="list-icon"></p>
            <input class="list-value"  placeholder="请选择品牌车型" disabled  v-model="brandName">
          </div>
        </li>
        <li>
          <div class="set-list set-list-data">
            <view class="section">
              <!-- <view class="list-title">注册日期</view> -->
              <p class="list-title">注册日期</p>
              <p class="list-icon"></p>
              <picker mode="date" :value="editData.registerDate" start="2000-09-01" end="2200-09-01" @change="bindDateChange">
                <view class="list-value"> {{editData.registerDate}} </view>
                <!-- <input v-model="date"  class="list-value" readonly placeholder="请选择注册日期"> -->
              </picker>
            </view>
          </div>
        </li>
      </ul>
    </div>

    <div class="car-tips"><span class="title">注：违章查询每天可查询5次</span></div>

    <div class="save-btn"><button @click="saveCar">保存</button></div>
  </div>
</template>

<script>
import {
  path,
  dataConfig,
  getLoginInfo,
  showLoading,
  apiFail
} from "@/utils/index";
export default {
  components: {},
  data() {
    return {
      date: "2010-01-01",
      areaName: "", //城市名
      country: "",
      province: "",
      city: "",
      district: "",
      cityIndex: [0, 0],
      cityList: [[], []],
      cityData: [],
      editData: "",
      brandName: ""
    };
  },
  onLoad(options) {
    this.getCityInfo();
    this.brandName = options.brandName;
    const _this = this;
    wx.getStorage({
      key: "ViewDetails",
      success: res => {
        _this.editData = res.data;
        let newA = res.data.city && res.data.city.split("-");
        let bb = newA.length > 1 ? newA[1] : newA[0];
        this.cityData.forEach((prov, provIndex) => {
          let cityIndex = prov.item.findIndex(city => city.cityname === bb);
          if (cityIndex >= 0) {
            this.cityIndex = [provIndex, cityIndex];
            this.bindMultiPickerColumnChange({
              target: { column: 0, value: provIndex }
            });
          }
        });
      }
    });
  },
  methods: {
    // 获取城市列表
    getCityInfo() {
      let url = path.carCityList;
      this.$fly
        .post(url, {})
        .then(data => {
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
      console.log("picker发送选择改变，携带值为", e);
      console.log("picker发送选择改变，携带值为", e.target.value);
      this.editData.registerDate = e.target.value;
    },
    bindMultiPickerChange(e) {
      //console.log(e.target.value);
      this.cityIndex = e.target.value;
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
    goCarBrand () {
            wx.navigateTo({
                url: "/pages/service/brandModels/main" 
            });
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
      this.editData.cityId = cc.cityId;
      let loginInfo = getLoginInfo();
      let queryDate = {
        brandName : this.brandName,
        // city: this.editData,
        carNumber: this.editData.carNumber,
        userId : loginInfo.userid,
        idKey: this.editData.idKey,
      }
      let url = path.updateCarServiceInfo;
      this.$fly
        .post(url, queryDate)
        .then(data => {
          var url = "../addSuccess/main";
          wx.navigateTo({ url });
        })
        .catch(error => {
          wx.showToast({
            title: error.data.message,
            icon: "none"
          });
        });
    },
    // 删除
    deleteData() {
      wx.showActionSheet({
        itemList: ["确定删除？"],
        success: res => {
          let urls = path.delCarServiceInfo;
          let loginInfo = getLoginInfo();
          let postData = {
            idKey: this.editData.idKey,
            userId: loginInfo.userid
          };
          let promise = this.$fly.post(urls, postData);
          promise.then(data => {
            let title = "删除成功";
            let url = `/pages/service/addSuccess/main?title=${title}`;
            wx.navigateTo({ url });
          });
          showLoading(promise);
        },
        fail(res) {
          console.log(res.errMsg);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.bigbox {
  width: 100%;
  background: #f6f6f6;
}
.header {
  width: 100%;
  height: 0.8rem;
  background: #fff;
  .header_left {
    width: 0.21rem;
    height: 100%;
    float: left;
    margin-left: 0.3rem;
    p {
      width: 0.21rem;
      height: 0.39rem;
      margin-top: 0.2rem;
    }
  }
  .header_center {
    height: 100%;
    width: 3rem;
    float: left;
    margin-left: 25%;
    p {
      height: 0.8rem;
      font-size: 0.36rem;
      font-weight: 700;
      text-align: center;
      line-height: 0.8rem;
      font-family: "PingFangSC-Medium";
      color: rgba(0, 0, 0, 1);
    }
  }
  .header_right {
    width: 1.5rem;
    height: 100%;
    float: right;
    margin-right: 0.3rem;
    font-size: 0.3rem;
    p {
      height: 0.8rem;
      font-size: 0.3rem;
      text-align: center;
      line-height: 0.8rem;
    }
  }
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
    background: linear-gradient(
      -90deg,
      rgba(255, 92, 93, 1),
      rgba(255, 130, 92, 1)
    );
    border-radius: 0.45rem;

    font-size: 0.36rem;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
  }
}
</style>
