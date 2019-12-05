<template>
   <div class="body_box">
    <div class='apply_box' v-if="isShow">
      <div>
        <p class="title">车辆选择</p>
        <input class="productName" type="text" readonly v-model="productData.productName">
      </div>
      <div>
        <p class="title">车辆分期选择</p>
        <div class="scheme">
          <radio-group class="radio-group" @change="radioChange">
            <label class="radio">
              <radio :value="0" :checked="true" color="#FFCC00" /> 方案1（1+3）
            </label>
            <label class="radio">
              <radio :value="1"  color="#FFCC00" /> 传统方案（36期）
            </label>
          </radio-group>
        </div>
      </div>
      <div>
        <p class="title">申请信息填写</p>
        <form class="apply-info">
          <div class="form-item">
            <label>所在城市</label>
            <picker
              @change="bindMultiPickerChanges" 
              :value="cityIndexs"
              :range="cityDatas">
              <view class="picker">
                {{cityDatas[cityIndexs]}}
              </view>
            </picker>
          </div>
          <div class="form-item">
            <label>姓名</label>
            <input placeholder="请输入姓名" v-model="username"/>
          </div>
          <div class="form-item">
            <label>手机号</label>
            <input placeholder="请输入手机号" v-model="phoneNum"/>
          </div>
        </form>
      </div>
      <div class="btn_box">
        <button class="btn" @click="applySubmit">提交</button>
      </div>
      <p class="tips">本业务当前仅支持部分城市办理，其他城市陆续开放中，敬请期待。</p>
    </div>
    <div class="success_box" v-if="!isShow">
      <div class='tips_box'>
        <div><img src="../../../static/img/add_success.png"></div>
        <p class="info">申请提交成功,请耐心等候...</p>
        <button class="btn" @click="goHome">返回首页</button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  path,
  dataConfig,
  apiFail,
  showLoading,
  getLoginInfo,
  isBindPhone
} from "@/utils/index";
export default {
  components: {},

  data() {
    return {
      productId: "",
      productData: {},
      username: "",
      phoneNum: "",
      isShow: true,
      isSubmit: false,
      selectScheme: "0",
      showLinkage: false,
      popupVisible: false,
      cityIndex: [0, 0],
      cityIndexs: 0,
      cityList: [[], []],
      cityData: [],
      cityDatas: [
        // '惠州',
        // '昆明',
        // '大连',
        // '成都'
        //  '福州' 
        ],
      options: [
        {
          label: "方案1（1+3）",
          value: "235668517916672"
        },
        {
          label: "方案2（3年期）",
          value: "235668561989632"
        }
      ]
    };
  },
  onLoad(query) {
    this.productId = query.productId;
    console.log(this.cityDatas)
  },
  onShow() {
    this.isShow = true;
    showLoading(this.getProductData(), this.getCityInfo());
    if (wx.getStorageSync("phone")) {
      this.phoneNum = wx.getStorageSync("phone");
    }else if(isBindPhone()){
      let loginInfo = getLoginInfo();
      this.phoneNum = loginInfo.account;
    }
  },
  methods: {
    getProductData() {
      let queryData = { productId: this.productId };
      let url = path.carModelInfo;
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          this.productData = data;
        })
        .catch(error => {
          console.log('异常1')
          apiFail(error);
        });
      return promise;
    },
    radioChange(e) {
      this.selectScheme = parseInt(e.target.value);
    },
    // 获取城市列表
    getCityInfo() {
      let url = path.queryLeaseCity;
      let promise = this.$fly.post(url, {});
      promise
        .then(data => {
          // data = data.sort((a, b) => {
          //   return parseInt(a.prov_id) - parseInt(b.prov_id);
          // });
          this.cityData = data;
          console.log(this.cityData,789)
          this.cityData.forEach(element => {
            this.cityDatas.push(element.city)
          });
          // this.cityList[0] = [];
          // data.forEach(item => this.cityList[0].push(item.prov_name));
          // this.cityList[1] = [];
          // data[0].item.forEach(item => this.cityList[1].push(item.cityname));
          
        })
        .catch(error => {
          console.log('异常2')
          apiFail(error);
        });
      return promise;
    },
    bindMultiPickerChanges(e){
      this.cityIndexs = e.target.value;
    },
    applySubmit() {
      if (false === this.applySubmitCheck()) {
        return;
      }
      let loginInfo = getLoginInfo();
      let url = path.saveCarApplication;
      let queryData = {
        userId: loginInfo.userid,
        productId: this.productId,
        productName: this.productData.productName,
        schemeId: this.productData.carProductRelationSchemeResultList[
          this.selectScheme
        ].schemeId,
        schemeName: this.productData.carProductRelationSchemeResultList[
          this.selectScheme
        ].schemeTypeName,
        cityId: "",
        cityName: this.cityDatas[this.cityIndexs],
        appName: this.username,
        appMobile: this.phoneNum,
        reservationType: 1, //新车1，二手车2
      };
      
      let city = this.findSelectedCity();
      // if (false === city) {
      //   wx.showToast({
      //     title: "异常数据",
      //     icon: "none"
      //   });
      //   return;
      // }
      queryData.cityId = city;
      this.isSubmit = true;
      let promose = this.$fly.post(url, queryData);
      promose
        .then(res => {
          this.isShow = false;
          this.isSubmit = false;
        })
        .catch(e => {
          this.isSubmit = false;
          console.log('异常3')
          apiFail(e);
        });
    },
    applySubmitCheck() {
      // 方案
      if (this.isSubmit) {
        return false; //防止重复提交
      }
      this.username = this.username.trim();
      this.phoneNum = this.phoneNum.trim();
      if (this.username.length === 0) {
        wx.showToast({
          title: "请填写姓名",
          icon: "none"
        });
        return false;
      }
      if (this.phoneNum.length !== 11) {
        wx.showToast({
          title: "请正确填写手机号",
          icon: "none"
        });
        return false;
      }
      return true;
    },
    findSelectedCity() {
      var id = this.cityData[this.cityIndexs].id;
      // var n = this.cityData[this.cityIndexs].id;
      // if(n == '惠州'){
      //   id = '287';
      // }else if(n == '昆明'){
      //   id = '25';
      // }else if(n == '大连'){
      //   id = '38';
      // }else if(n == '成都'){
      //   id = '22';
      // }
      // else if(n == '福州'){
      //   id = '14';
      // }
      return id;
      // return false;
    },
    goHome() {
      //返回首页
      wx.switchTab({
        url: "/pages/home/main"
      });
    }
  }
};
</script>
<style>
page {
  height: 100%;
}
</style>
<style lang="scss" scoped>
$jbColorTop: rgba(255,224,86,1);
$jbColorBottom: #FFCC00;
.body_box {
  width: 100%;
  height: 100%;
  background-color: #888;
}
.success_box {
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: white;
  .tips_box {
    margin: auto;
    width: 60%;
    text-align: center;
    .btn {
      width: 100%;
      height: 0.9rem;
      background: linear-gradient(
        180deg,
        $jbColorTop,
        $jbColorBottom
      );
      border-radius: 45px;
      color: #000;
    }
    .btn:after{
      border: none;
    }
    img {
      display: inline-block;
      width: 180rpx;
      height: 180rpx;
    }
    .info {
      margin: 0.4rem 0;
      color: #000000;
      font-size: 16px;
    }
  }
}

.apply_box {
  background-color: #f3f3f3;
  height: 100%;
  .title {
    padding:0.37rem 0 0.21rem 0;
    font-size: 14px;
    padding-left: 0.3rem;
    color: #888;
  }
  .productName {
    height: 50px;
    line-height: 0.8rem;
    padding: 0 0.3rem;
    background-color: white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .scheme {
    display: flex;
    background-color: #fff;
    padding: 0 2%;
    height: 50px;
    font-size: 16px;
    .radio-group {
      display: block;
      width: 80%;
      margin: auto auto;
    }
    div {
      height: 0.8rem;
      line-height: 0.8rem;
      width: 50%;
      text-align: center;
      vertical-align: middle;
    }
    label {
      font-size: 13px;
    }
    label:nth-child(2){
      margin-left: 0.4rem;
    }
  }
  .searchInfo {
    li {
      list-style: none;
      display: block;
      width: 100%;
      height: 1rem;
      font-size: 0.3rem;
      span {
        display: inline-block;
        width: 30%;
        height: 100%;
        text-align: center;
        background-color: #fff;
        line-height: 1rem;
      }
      input {
        background-color: #fff;
        display: inline-block;
        width: 70%;
        height: 70%;
        line-height: 1rem;
      }
      input::placeholder {
        font-size: 0.3rem;
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
        float: left;
      }
    }
    input {
      display: inline-block;
      font-size: 16px;
      height: 100rpx;
      float: left;
    }
    picker {
      display: inline-block;
      font-size: 16px;
      height: 100rpx;
      float: left;
      line-height: 100rpx;
      width: 400rpx;
    }
  }
  .btn_box {
    width: 100%;
    display: flex;
    height: 2rem;
    justify-content: center;
    align-items: center;
    .btn {
      color: #000;
      width: 80%;
      height: 0.9rem;
      background: linear-gradient(
        180deg,
        $jbColorTop,
        $jbColorBottom
      );
      border-radius: 45px;
    }
    .btn:after{
      border: none;
    }
  }
  .tips{
    color: #999;
    width: 100%;
    padding: 0 0.5rem;
    font-size: 0.26rem;
    box-sizing: border-box;
    line-height: 0.4rem;
  }
}
</style>
