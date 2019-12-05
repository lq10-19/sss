<template>
  <div class="bigbox" :class="{'is-huawei':isHuaWei}">
    <!--搜索框-->
    <!-- <div class="searchBox " :class="{changeSearchCss:isChange}">
      <div class="city fl">
        <p>定位中...</p><i></i>
      </div>
      <div class="search fl"><i></i>
        <form action="#">
          <input @focus="searchFun" type="search" placeholder="搜索服务">
        </form>
      </div>
    </div>-->
    <!--轮播图-->
    <div class="advert_pic">
      <swiper
        :indicator-dots="false"
        class="swiper"
        :autoplay="true"
        :interval="3000"
        :duration="500"
        :circular="true"
      >
        <swiper-item v-for="(item,index) in imgData" :key="index">
          <img class="swipeImg" :src="item.activityImg" alt @click="jumpTo(item.activityName)">
        </swiper-item>
      </swiper>
    </div>

    <!--小提示-->
    <div class="service-tips">
      <p>
        <!-- 今日油价:
        <font>92#&nbsp;7.56&nbsp;&nbsp;95#&nbsp;8.19</font>
        &nbsp;&nbsp;&nbsp;-->
        {{city}}天气:&nbsp;
        <font>{{WeatherInfo.cond_txt_d}} &nbsp;{{WeatherInfo.tmp_min}}-{{WeatherInfo.tmp_max}}°C&nbsp; 宜洗车</font>
      </p>
    </div>
    <!--车辆信息轮播图-->
    <div class="car-info-box">
      <swiper
        :indicator-dots="false"
        class="swiper"
        :autoplay="true"
        :interval="3000"
        :duration="500"
      >
        <swiper-item v-for="(item,index) in carDatalist" :key="index">
          <div class="box-shadows"></div>
          <div class="car-list" @click="goCarCenter(item) ">
            <div v-if="item.isCar" class="car-icon"></div>
            <div v-else class="car-num">
              <i class="car_img"></i>
              <p>{{item.carNumber}}</p>
            </div>
            <div class="car-info">
              <router-link to="/carCenter">
                <p>{{item.foulCount}}</p>
                <p>违章次数</p>
              </router-link>
            </div>
            <div class="car-info">
              <router-link to="/carCenter">
                <p>{{item.foulDeduction}}</p>
                <p>违章扣分</p>
              </router-link>
            </div>
            <!-- <div class="car-info">
              <router-link to='/carCenter'>
                <p>{{item.gu}}</p>
                <p>上次估值</p>
              </router-link>
            </div>-->
          </div>
        </swiper-item>
      </swiper>
    </div>
    <div class="service-title">
      <span>优选服务</span>
    </div>

    <div class="func-box">
      <!-- <scroll-view  scroll-x class="scroll-view" style="width: 100% ;white-space:nowrap;"> -->
      <!-- <div class="list" @click="goOil">
        <div class="icon">
          <img src="/static/img/server/jiayou.png" alt>
        </div>
        <p>加油充值</p>
      </div> -->
      <!-- <div class="list" @click="goWei">
        <div class="icon">
          <img src="/static/img/server/weizhang.png" alt>
        </div>
        <p>违章查询</p>
      </div> -->
      <div class="list" @click="goLukuang">
        <div class="icon">
          <img src="/static/img/server/lukuang.png" alt>
        </div>
        <p>路况查询</p>
      </div>
      <div class="list" @click="goPrice">
        <div class="icon">
          <img src="/static/img/server/gujia.png" alt>
        </div>
        <p>汽车估价</p>
      </div>
      <div class="list">
        <div class="icon">
          <img src="/static/img/server/more.png" alt>
        </div>
        <p>敬请期待</p>
      </div>
      <!-- <div class="more_box">
          <label class="modal">
            <p>敬请期待</p>
          </label>
          <span class="s_more"></span>
          <p>更多功能</p>
      </div>-->
      <!-- </scroll-view> -->
    </div>
  </div>
</template>

<script>
import {
  path,
  dataConfig,
  getUserInfo,
  getLoginInfo,
  isBindPhone,
  showLoading,
  apiFail,
  isHuaWei,
  event
} from "@/utils/index";
export default {
  components: {},
  data() {
    return {
      indicatorDots: false,
      autoplay: false,
      interval: 5000,
      duration: 1000,
      // 获取定位信息
      country: "",
      province: "",
      city: "",
      district: "",
      //天气
      WeatherInfo: {},
      // 1942a25c658462215195eabc8fe5603a
      isChange: true,
      imgData: [], //banner图列表
      carDatalist: [],
      defaultCar: {
        isCar: true,
        num: "",
        foulCount: 0,
        foulDeduction: 0,
        gu: 0
      },
      //是否去过绑定手机号页面
      goBindPhonePage: false,
      goLoginPage: false,
      isHuaWei: false
    };
  },
  onShow() {
    if (!getLoginInfo()) {
      if (this.goLoginPage) {
        this.goLoginPage = false;
        wx.switchTab({
          url: "/pages/home/main"
        });
        return;
      } else {
        this.goLoginPage = true;
        const url = "/pages/login/main";
        wx.navigateTo({ url });
        return;
      }
    }
    if (!isBindPhone() && this.goBindPhonePage) {
      if (this.goBindPhonePage) {
        this.goBindPhonePage = false;
        wx.switchTab({
          url: "/pages/home/main"
        });
        return;
      } else {
        this.goBindPhonePage = true;
        url = "/pages/login/bindPhone/main";
        wx.navigateTo({ url });
        return;
      }
    }
    // 定位城市
    this.getHotCityData();
    showLoading(this.getPeccancyInfo());
    //请求活动列表
    this.getGroupActivity();
  },
  onLoad() {
    this.isHuaWei = isHuaWei();
  },
  onHide() {
    //清空轮播图
    this.imgData = [];
  },
  onShareAppMessage(){
    return {
      title: '佰仟易行',
      path: '/pages/service/service/main',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  methods: {
    //请求活动列表
    getGroupActivity() {
      let url = path.queryActivity;
      let queryData = {
        upperChannel: 2,
        advertPosition: 4
      };
      let promises = this.$fly.get(url, queryData); 
      promises.then(data => {
        if (data && data.length > 0) {
          this.imgData = data;
          //console.log('轮播图:')
          //console.log(this.imgData)
        } else {
          let logo = {activityImg:'http://bqyx-qiniu.bqrzzl.com/%E4%BD%B0%E4%BB%9F%E6%98%93%E8%A1%8Clogo.png'};
          this.imgData.push(logo);
          return
        }
      })
      .catch(e => {
        apiFail(e);
      });
    },
    // 定位城市
    getHotCityData() {
      let _this = this;
      wx.getLocation({
        type: "wgs84",
        success: function(res) {
          let latitude, longitude;
          latitude = res.latitude.toString();
          longitude = res.longitude.toString();
          wx.request({
            header: {
              "Content-Type": "application/text"
            },
            url:
              "https://apis.map.qq.com/ws/geocoder/v1/?location=" +
              latitude +
              "," +
              longitude +
              "&key=MVGBZ-R2U3U-W5CVY-2PQID-AT4VZ-PDF35",
            success: function(res) {
              try {
                _this.country = res.data.result.address_component.nation;
                _this.province = res.data.result.address_component.province;
                _this.city = res.data.result.address_component.city;
                _this.district = res.data.result.address_component.district;
                wx.setStorageSync("mapInfo", res.data.result.ad_info.location);
                // 获取天气信息
                _this.getWeatherInfo(_this.city);
              } catch (error) {
                console.log(error)
              }
            }
          });
        }
      });
    },
    jumpTo (resName) {
      if (resName == "充值卡红包返现") {
        wx.navigateTo({
          url: "/pages/service/oil/main"
        });
      }  
    },
    // 车辆列表
    getPeccancyInfo() {
      let url = path.myCarINfo;
      let loginInfo = getLoginInfo();
      let queryData = { userId: loginInfo.userid };
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          this.carDatalist = data;
          this.carDatalist.push(this.defaultCar);
        })
        .catch(error => {
          apiFail(error);
        });
      return promise;
    },
    // 天气
    getWeatherInfo(resCity) {
      const _this = this;
      let url =
        "https://free-api.heweather.com/s6/weather/forecast?location=" +
        resCity +
        "&key=f496b2e0c2454d77a3ef68925391bb67";
      this.$fly
        .get(url)
        .then(res => {
          _this.WeatherInfo = res.data.HeWeather6[0].daily_forecast[0];
        })
        .catch(error => {
          _this.WeatherInfo = error.data.HeWeather6[0].daily_forecast[0];
        });
    },
    // 车辆中心
    goCarCenter(res) {
      if (res.isCar) {
        var url = "../addCarlnfo/main";
        wx.navigateTo({ url });
      } else {
        var url = "../carCenter/main";
        wx.navigateTo({ url });
      }
    },
    goWei() {
      getApp().aldstat.sendEvent(event["violation.enquiry"]);
      let url = "";
      if (!isBindPhone()) {
        url = "/pages/login/bindPhone/main";
      } else {
        url = "../violationInquiry/main";
      }
      wx.navigateTo({ url });
    },
    goOil() {
      getApp().aldstat.sendEvent(event["oil"]);
      wx.navigateTo({ url: "/pages/service/oil/main" });
    },
    goLukuang() {
      getApp().aldstat.sendEvent(event["road.condition.query"]);
      var url = "../map/main";
      wx.navigateTo({ url });
      wx.showToast({
        title: "加载中...",
        image: "/static/icon/loading.gif",
        duration: 1000
      });
    },
    goPrice() {
      getApp().aldstat.sendEvent(event["car.evaluation"]);
      if (!isBindPhone()) {
        wx.navigateTo({ url: "/pages/login/bindPhone/main" });
      } else {
        wx.navigateTo({ url: "/pages/service/evaluate/main" });
        // wx.showToast({
        //   title: "加载中...",
        //   image: "/static/icon/loading.gif",
        //   duration: 1000
        // });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.bigbox {
  background: #ffffff;
  width: 100%;
  // height: 100%;
  padding-bottom: 1rem;
  overflow-x: hidden;
}
.searchBox {
  width: 100%;
  position: fixed;
  height: 1.28rem;
  left: 0;
  // top: 0.4rem;
  z-index: 1000;
  padding: 0.43rem 0.3rem 0.1rem 0.3rem;
  .city {
    display: inline-block;
    p {
      color: #fff;
      font-size: 0.3rem;
      height: 0.64rem;
      line-height: 0.64rem;
    }
    i {
      display: inline-block;
      margin-left: 0.14rem;
      width: 0.14rem;
      height: 0.64rem;
      line-height: 0.64rem;
      background: url("../../../../static/img/server/triangle.png") no-repeat
        center/100%;
    }
  }
  .search {
    display: inline-block;
    width: 4.5rem;
    height: 0.64rem;
    position: relative;
    // float: left;
    margin-left: 0.2rem;
    i {
      position: absolute;
      left: 0.19rem;
      width: 0.25rem;
      height: 0.64rem;
      line-height: 0.64rem;
      background: url("../../../../static/img/server/search.png") no-repeat
        center/100%;
    }
    input {
      background: rgba(255, 255, 255, 0.5);
      border-radius: 0.32rem;
      color: #fff;
      font-size: 0.3rem;
      padding-left: 0.57rem;
      height: 0.64rem;
      line-height: 0.64rem;
      text-align: left;
    }
    ::-webkit-input-placeholder {
      /* WebKit browsers */
      color: #fff;
    }
    :-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      color: #fff;
    }
    ::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      color: #fff;
    }
    :-ms-input-placeholder {
      /* Internet Explorer 10+ */
      color: #fff;
    }
  }
}
.changeSearchCss {
  // padding:0.15rem 0.3rem 0.06rem 0.3rem;
  padding-top: 0.11rem;
  height: 0.88rem;
  box-sizing: border-box;
  background: #fff;
  top: 0;
  left: 0;
  // padding-top: 0.5rem !important;
  border-bottom: 1px solid #eee;
  .city {
    p {
      color: #333;
    }
    i {
      background: url("../../../../static/img/server/triangleChange.png")
        no-repeat center/100%;
    }
  }
  .search {
    i {
      background: url("../../../../static/img/server/searchChange.png")
        no-repeat center/100%;
    }
    input {
      background: #ededed;
      color: #333;
    }
    ::-webkit-input-placeholder {
      /* WebKit browsers */
      color: #878894;
    }
    :-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      color: #878894;
    }
    ::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      color: #878894;
    }
    :-ms-input-placeholder {
      /* Internet Explorer 10+ */
      color: #878894;
    }
  }
}
.advert_pic {
  width: 100%;
  height: 2.7rem;
  // margin-top: 0.88rem;
  img {
    display: inline-block;
    width: 100%;
    height: 2.7rem;
  }
}
.service-tips {
  width: 100%;
  height: 0.6rem;
  background: #fff;
  border-bottom: 2rpx solid #f3f3f3;
  p {
    font-size: 0.22rem;
    height: 0.6rem;
    line-height: 0.6rem;
    text-align: center;
    color: rgba(0, 0, 0, 1);
    font-family: PingFangSC-Regular;
    font {
      color: #ff5c5d;
    }
  }
}
.car-info-box {
  width: 100%;
  height: 2.7rem;
}
.box-shadows{
  width:6.57rem;
  height:2.24rem;
  background:rgba(255,243,195,1);
  opacity:0.84;
  border-radius:0.1rem;
  position: absolute;
  left: 50%;
  top: 0.4rem;
  -webkit-transform: translateX(-50%);
}
.car-list {
  width: 6.8rem;
  height: 2.1rem;
  margin: 0 auto;
  margin-top: 0.4rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background:linear-gradient(151deg,rgba(254,225,21,1),rgba(254,194,10,1));
  border-radius: 12px;
  position: relative;
  
  .car-info {
    width: 1.2rem;
    height: 1.2rem;
    margin-top: 0.55rem;
    p {
      width: 100%;
      font-size: 0.28rem;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      line-height: 0.5rem;
      text-align: center;
      color: #4E1900;
    }
  }
  .car-icon {
    width: 1.1rem;
    height: 1.1rem;
    background: url("../../../../static/img/server/car_tianjia.png") no-repeat
      center/100%;
  }
  .car-num {
    width: 1.5rem;
    height: 1.4rem;
    margin-top: 0.45rem;
    .car_img {
      display: block;
      width: 0.82rem;
      height: 0.7rem;
      margin: 0 auto;
      background: url("../../../../static/img/server/car_1.png") no-repeat
        center/100%;
    }
    p {
      width: 100%;
      height: 0.7rem;
      line-height: 0.7rem;
      text-align: center;
      font-size: 0.26rem;
      color: rgba(249, 249, 249, 1);
    }
  }
}
.service-title {
  margin-top: 0.5rem;
  width: 100%;
  height: 0.5rem;
  padding-left: 0.4rem;
  background: #fff;
  span {
    font-size: 0.44rem;
    font-weight: 700;
    color: rgba(1, 1, 1, 1);
    height: 0.5rem;
    line-height: 0.5rem;
    font-family: PingFangSC-Medium;
  }
}
.func-box {
  margin-top: 0.85rem;
  margin-bottom: 1rem;
  width: 100%;
  height: 2.2rem;
  justify-content: space-around;
  .list {
    width: 33.333333%;
    float: left;
    min-height: 2.2rem;
    border-radius: 0.12rem;
    text-align: center;
    display: inline-block;
    flex-direction: row;
    .icon{
      width: 100%;
      height: 0.77rem;
      margin-bottom: 0.29rem;
    }
    span {
      display: block;
      width: 1.1rem;
      height: 1.1rem;
      margin-top: 0.27rem;
      margin-left: 0.26rem;
    }
    p {
      margin-top: 8rpx;
      height: 0.33rem;
      line-height: 0.33rem;
      text-align: center;
      width: 100%;
      color: rgba(0, 0, 0, 1);
      font-size: 24rpx;
    }
    span{
      width: 100%;
      height: auto;
      margin: 0;
      font-size: 0.24rem;
      color: #999;
      margin-top: 0.05rem;
    }
    img {
      margin: 0 auto;
    }
  }
  .list:nth-child(1){
    img{
      width: 0.70rem;
      height: 0.77rem;
    }
  }
  .list:nth-child(2){
    img{
      width: 0.85rem;
      height: 0.71rem;
    }
  }
  .list:nth-child(3){
    img{
      width: 0.7rem;
      height: 0.35rem;
      margin: 0 auto;
    }
  }
  .list:nth-child(4){
    img{
      width: 0.74rem;
      height: 0.24rem;
    }
  }
  .list:nth-child(5){
    img{
      width: 0.6rem;
      height: 0.16rem;
      margin: 0 auto;
    }
  }
  // .more_box {
  //   position: relative;
  // }
  .modal {
    // position: fixed;
    // display: block;
    // display: flex;
    width: 1.62rem;
    height: 2.2rem;
    background: rgba(0, 0, 0, 0.2);
    border: 0.02rem solid rgba(246, 246, 246, 1);
    border-radius: 0.12rem;
    z-index: 99999;
    p {
      display: inline-block;
      width: 100%;
      height: 0.29rem;
      line-height: 1.5rem;
      text-align: center;
      color: rgba(255, 255, 255, 1);
      font-family: PingFangSC-Medium;
      font-weight: 500;
      font-size: 0.3rem;
    }
  }
}
</style>
