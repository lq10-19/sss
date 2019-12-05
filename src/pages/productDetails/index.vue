<template>
  <div class="product-detail">
    <div class="car-imgs" :style="{height:carImgsHeight}">
      <swiper
        :indicator-dots="false"
        class="swiper"
        :autoplay="true"
        :interval="3000"
        :duration="500"
      >
        <swiper-item v-for="item in swiperImg" :key="item.objectId">
          <img
            :src="item.httpUrl"
            v-bind:style="{ width: carPicStyle.width, height: carPicStyle.height}"
          >
        </swiper-item>
      </swiper>
    </div>
    <div class="car-info">
      <p class="name">{{productData.productName}}</p>
      <div class="price">
        <span>市场指导价: {{productData.guidancePrice}}</span>
        <span> | </span>
        <span>预约数: {{productData.count}}</span>
      </div>
      <div class="hot-icon">
        <ul>
          <li v-for="(item,index) of labels" :key="index">
            <p>{{item}}</p>
          </li>
          <!-- <li>
            <p>最新款</p>
          </li>
          <li>
            <p>强力推荐</p>
          </li>-->
        </ul>
      </div>
      <!-- <div class="containsService">
        <span class="icon"></span>
        <span>含购置税（约省</span>
        <span class="wen_money">0.98万</span>
        <span>）</span>
      </div>-->
    </div>
    <div class="plans">
      <div class="title" v-show="isShowPlansTab">
        <p @click="plansChange(1)" class="left" :class="{active:isSelected}">推荐方案(1+3)</p>
        <p @click="plansChange(2)" class="right" :class="{active:!isSelected}">传统方案(36期)</p>
      </div>
      <!--推荐方案-->
      <div class="boxWrap">
        <div class="box box1" :class="{boxHide:!isSelected}">
          <div class="plans-section">
            <div class="plans-item">
              <div class="label-icon">送</div>
              <p class="label">免费上牌</p>
            </div>
            <div class="plans-item">
              <div class="label-icon">送</div>
              <p class="label">首年保险</p>
            </div>
            <div class="plans-item">
              <div class="label-icon">含</div>
              <p class="label">购置税</p>
            </div>
          </div>
          <div class="priceDetail">
            <div class="price-title">
              <p class="icon"></p>先用一年
            </div>
            <div class="price-table">
              <div v-for="(item,index) in plans1" :key="index">
                <div class="item item1">
                  <p class="label">首付比例</p>
                  <p class="val">{{item.downPaymentProportion}}</p>
                </div>
                <div class="item item2 item2line">
                  <p class="label">首付金额</p>
                  <p class="val">{{item.downPayment}}元</p>
                </div>
                <div class="item item3 item3line">
                  <p class="label">月供</p>
                  <p class="val">{{item.firstYearRent}}元</p>
                </div>
                <div class="item item4">
                  <p class="label">期数</p>
                  <p class="val">{{item.dateNumber||'无'}}期</p>
                </div>
              </div>
            </div>
            <div class="priceDetail2">
              <!-- <p class="txt1">分期付款</p>
              <p class="txt2"><span class="moneyNum">¥{{monthlySupply}}月</span></p>
              <p class="txt3">一次性付清：<span>请咨询业务人员</span></p>
              <p class="txt4">尾款可选方案：一、1年后还车（限公里数）</p>
              <p class="txt5">二、1年后付尾款购车 </p>
              <p class="txt5">三、1年后尾款再分期三年</p>-->
              <div class="price-title">
                <p class="icon"></p>一年后
                <span>(两种方式可选)</span>
              </div>
              <div class="price-table">
                <div class="item item1">
                  <div class="row row1">方案一</div>
                  <div class="row row2">尾款结清</div>
                  <div class="row row3">
                    一次性支付
                    <span>{{disposableTail}}元</span>
                  </div>
                </div>
                <div class="item item2">
                  <div class="row row1">方案二</div>
                  <div class="row row2">继续分期</div>
                  <div class="row row3">
                    <span>{{monthlySupply}}x36期</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--方案二(3年期)-->
        <div class="box box2" :class="{boxHide:isSelected}">
          <div class="plans-section">
            <div class="plans-item">
              <div class="label-icon">送</div>
              <p class="label">免费上牌</p>
            </div>
            <div class="plans-item">
              <div class="label-icon">送</div>
              <p class="label">首年保险</p>
            </div>
            <div class="plans-item">
              <div class="label-icon">含</div>
              <p class="label">购置税</p>
            </div>
          </div>
          <div class="priceDetail">
            <div class="price-title">
              <p class="icon"></p>分期三年
            </div>
            <div class="price-table">
              <div v-for="(item,index) in plans2" :key="index">
                <div class="item item1">
                  <p class="label">首付比例</p>
                  <p class="val">{{item.downPaymentProportion}}</p>
                </div>
                <div class="item item2 item2line">
                  <p class="label">首付金额</p>
                  <p class="val">{{item.extensionPayment}}元</p>
                </div>
                <div class="item item3 item3line">
                  <p class="label">月供</p>
                  <p class="val">{{item.monthlySupply}}元</p>
                </div>
                <div class="item item4">
                  <p class="label">期数</p>
                  <p class="val">{{item.extensionNumber||'无'}}期</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--申请流程-->
    <div class="applyPro">
      <div class="title">
        <div class="con">
          <span class="left"></span>
          <span class="middle">申请流程</span>
          <span class="right"></span>
        </div>
      </div>
      <div class="proBox">
        <div class="line-box">
          <img class="line line1" src="/static/img/carProduct/line.png" alt>
          <img class="line line2" src="/static/img/carProduct/line.png" alt>
          <img class="line line3" src="/static/img/carProduct/line.png" alt>
        </div>
        <div class="part part1">
          <p class="p-img">
            <img src="/static/img/carProduct/pro1.png" alt>
          </p>
          <span class="txt">
            选中车型
            <br>在线申请
          </span>
          <span class="line"></span>
        </div>
        <div class="part part2">
          <p class="p-img">
            <img src="/static/img/carProduct/pro2.png" alt>
          </p>
          <span class="txt">
            客服致电
            <br>指引购车
          </span>
          <span class="line"></span>
        </div>
        <div class="part part3">
          <p class="p-img">
            <img src="/static/img/carProduct/pro3.png" alt>
          </p>
          <span class="txt">
            店内看车
            <br>完成签约
          </span>
          <span class="line"></span>
        </div>
        <div class="part part4">
          <p class="p-img">
            <img src="/static/img/carProduct/pro4.png" alt>
          </p>
          <span class="txt">店内提车</span>
        </div>
      </div>
    </div>
    <!--申请资料-->
    <div class="applyFiles">
      <div class="title">
        <div class="con">
          <span class="left"></span>
          <span class="middle">申请资料</span>
          <span class="right"></span>
        </div>
      </div>
      <div class="fileBox">
        <div class="part part1">
          <p class="f-img">
            <img src="/static/img/carProduct/file2.png" alt>
          </p>
          <span class="txt">身份证</span>
        </div>
        <div class="part part2">
          <p class="f-img">
            <img src="/static/img/carProduct/file1.png" alt>
          </p>
          <span class="txt">驾驶证</span>
        </div>
        <div class="part part3">
          <p class="f-img">
            <img src="/static/img/carProduct/file3.png" alt>
          </p>
          <span class="txt">征信授权</span>
        </div>
      </div>
    </div>
    <!--猜你喜欢-->
    <!-- <div class="like">
      <p class="title">
        <span><img src="/static/img/carProduct/like.png" alt=""></span>
        <span class="guessLike">猜你喜欢</span>
      </p>
    </div>-->
    <!--猜你喜欢的车-->
    <!-- <div class="carListBox clearfix">
      <li class="carList clearfix">
        <div class="car_left fl">
          <img src="/static/img/1.jpg" alt="">
        </div>
        <div class="car_right fl">
          <div class="car_title">
            <p>雷凌2017款 1.2T G CVT</p>
          </div>
          <div class="firstPayment">
            <p>首付<span class="firstPaymentNumber">1.26</span><span>万</span></p>
            <p class="monthPayment">月供27585元</p>
          </div>
          <div class="guidePrice">
            <p>厂家指导价<span>14.98万</span></p>
          </div>
          <div class="others">
            <p>含购置税保险等</p>
          </div>
          <div class="hotLable"><span>10%首付</span><span>月供直降</span>
          </div>
        </div>
      </li>
      <li class="carList clearfix">
        <div class="car_left fl">
          <img src="/static/img/1.jpg" alt="">
        </div>
        <div class="car_right fl">
          <div class="car_title">
            <p>雷凌2017款 1.2T G CVT</p>
          </div>
          <div class="firstPayment">
            <p>首付<span class="firstPaymentNumber">1.26</span><span>万</span></p>
            <p class="monthPayment">月供27585元</p>
          </div>
          <div class="guidePrice">
            <p>厂家指导价<span>14.98万</span></p>
          </div>
          <div class="others">
            <p>含购置税保险等</p>
          </div>
          <div class="hotLable"><span>10%首付</span><span>月供直降</span>
          </div>
        </div>
      </li>
    </div>-->
    <!--拨打电话,立即申请-->
    <div class="bottom">
      <div class="left">
        <div class="con" @click="arouseService">
          <i></i>
          <p class="free">免费咨询</p>
          <P class="time">工作日(9:00-18:00)</P>
        </div>
        <a
          href="tel:4009987103"
          style="display:block;height:0.98rem;width:40%;line-height:0.98rem;text-align:center;position:absolute;left:0;top:0; z-index:100;opacity:0;"
        >400-9987-103</a>
      </div>
      <!-- <div class="mid">    
        <button open-type="contact" class="live">在线客服</button>
      </div>-->
      <div class="right">
        <button v-if="flag" open-type="getPhoneNumber" plain @getphonenumber="getPhoneNumber">立即申请</button>
        <button v-else plain @click="toApply">立即申请</button>
      </div>
      <div></div>
    </div>
    <div class="btn-live">
      <button open-type="contact" class="live">
        <img src="/static/img/carProduct/kefu.png" alt class="liveImg">
      </button>
    </div>
  </div>
</template>

<script>
import {
  path,
  dataConfig,
  getLoginInfo,
  getUserInfo,
  isBindPhone,
  apiFail,
  event,
  getSystemInfo
} from "@/utils/index";
export default {
  data() {
    return {
      productData: {},
      swiperImg: [],
      isShowPlansTab: false, //方案是否可以选择切换
      imgData: [],
      swipeIndex: {
        sumNuber: "",
        index: "1"
      },
      labels: [],
      swiperImg: [], //轮播图片
      isChange: false,
      productId: "",
      downPayment: "", //首付
      monthlySupply: "", //月供
      isSelected: true, //方案一 方案二切换
      plansDataList: [],
      plans1: [], //方案1数据
      plans2: [], //方案2数据
      paddingTop: false,
      disposableTail: "",
      carPicStyle: {
        width: "",
        height: ""
      },
      carImgsHeight: "250px",
      flag: true //默认没有绑定手机号
    };
  },
  onLoad(query) {
    this.productId = query.productId;
    let systemInfo = getSystemInfo();
    let width = systemInfo.windowWidth;
    let height = systemInfo.windowHeight;
    this.carPicStyle.width = "100%";
    this.carPicStyle.height = width / 4 * 3 + "px";
    this.carImgsHeight = width / 4 * 3 + 1 + "px";
  },
  onShow() {
    this.isSelected = true;
    this.isShowPlansTab = false;
    this.getProductData(this.productId);
    if (wx.getStorageSync("phone") || isBindPhone()) {
      this.flag = false;
    }
  },
  onShareAppMessage() {
    console.log(this.productId);
    return {
      title: this.productData.productName,
      path: "/pages/productDetails/main?productId=" + this.productId,
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    };
  },
  methods: {
    //获取手机号
    getPhoneNumber(e) {
      //判断是否已存电话号码
      if (wx.getStorageSync("phone")) {
        //电话已存在
        this.toApply();
      } else {
        wx.login({
          //获取code 使用wx.login得到的登陆凭证，用于换取openid
          success: res => {
            if (res.code) {
              // console.log("code:" + res.code);
               console.log("errMsg:" + e.mp.detail.errMsg);
              // console.log("iv:" + e.mp.detail.iv);
               console.log("encryptedData:" + e.mp.detail.encryptedData);
              //用户是否同意授权
              if (e.mp.detail.encryptedData == undefined) {
                //不同意...
                this.toApply();
              } else {
                let url = path.deciphering;
                let queryData = {
                  encrypdata: e.mp.detail.encryptedData,
                  ivdata: e.mp.detail.iv,
                  code: res.code
                };
                let promise = this.$fly.get(url, queryData);
                promise
                  .then(data => {
                    let phoneData = JSON.parse(data);
                    console.log("电话：", phoneData.phoneNumber);
                    wx.setStorageSync("phone", phoneData.phoneNumber);
                    //将微信绑定的手机号推送给后台保存
                    this.wxPhoneNum(phoneData.phoneNumber);
                    this.toApply();
                  })
                  .catch(e => {
                    apiFail(e);
                  });
              }
            }
          },
          fail: res =>{
            this.toApply();
          }
        });
      }
    },
    wxPhoneNum(phoneNumber) {
      let url = path.updateUserMobile;
      let queryData = {
        mobile: phoneNumber,
        userId: getLoginInfo().userid
      };
      let promise = this.$fly.get(url, queryData);
      promise
        .then(data =>{
          console.log("成功接收手机号："+ data)
        })
        .catch(e =>{
          apiFail(e);
        });
      return promise;  
    },
    toApply() {
      getApp().aldstat.sendEvent(event["product.apply"]);
      let url = "";
      if (!getLoginInfo()) {
        const url = "/pages/login/main";
        wx.navigateTo({ url });
        return;
      }
      if (!isBindPhone() && !wx.getStorageSync("phone")) {
        url = "../login/bindPhone/main";
      } else {
        url = "../apply/main?productId=" + this.productData.productId;
      }
      wx.navigateTo({ url });
    },
    arouseService() {
      wx.makePhoneCall({
        phoneNumber: "4009987103",
        success() {
          console.log("success");
        },
        fail() {
          wx.showToast({
            title: "联系客服失败"
          });
        }
      });
    },
    getProductData(id) {
      let queryData = { productId: id };
      let url = path.carModelInfo;
      this.$fly
        .post(url, queryData)
        .then(data => {
          this.getProductDataSuccess(data);
        })
        .catch(error => {
          apiFail(error);
        });
    },
    getProductDataSuccess(data) {
      this.productData = data;
      this.swiperImg = data.carImgResultList;
      this.labels = data.labels;
      this.downPayment = this.productData.carProductRelationSchemeResultList[0].downPayment;
      this.monthlySupply = this.toThousands(
        this.productData.carProductRelationSchemeResultList[0].monthlySupply
      );
      this.disposableTail = this.toThousands(this.productData.disposableTail);
      this.plansDataList = this.productData.carProductRelationSchemeResultList;
      //方案处理
      var newArr = [];
      this.plansDataList.forEach((v, i) => {
        v.index = v.downPaymentProportion.replace(/%/g, "") / 1;
        if (newArr.indexOf(v.schemeTypeId) == -1) {
          newArr.push(v.schemeTypeId);
        }
      });
      var newArrList = [];
      newArr.forEach((v, i) => {
        var newObj = {
          schemeTypeId: "",
          list: []
        };
        newObj.schemeTypeId = v;
        newArrList.push(newObj);
      });
      newArrList.forEach((v, i) => {
        this.plansDataList.forEach((v2, i2) => {
          if (v.schemeTypeId == v2.schemeTypeId) {
            v.list.push(v2);
          }
        });
      });
      // 方案排序

      if (newArrList.length > 1) {
        this.isShowPlansTab = true;
      } else {
        this.isShowPlansTab = false;
      }

      newArrList.forEach((v, i) => {
        if (v.schemeTypeId == 1) {
          this.plans1 = v.list;
          this.plans1[0].downPayment = this.toThousands(
            this.plans1[0].downPayment
          );
          console.log(this.toThousands(this.plans1[0].downPayment));
          this.plans1[0].firstYearRent = this.toThousands(
            this.plans1[0].firstYearRent
          );
        } else if (v.schemeTypeId == 2) {
          this.plans2 = v.list;
          this.plans2[0].extensionPayment = this.toThousands(
            this.plans2[0].extensionPayment
          );
          this.plans2[0].monthlySupply = this.toThousands(
            this.plans2[0].monthlySupply
          );
        }
      });
    },
    plansChange(plans) {
      if (plans == 1) {
        this.isSelected = true;
      } else {
        this.isSelected = false;
      }
    },
    toThousands(num) {
      var num = (num || 0).toString(),
        result = "";
      while (num.length > 3) {
        result = "," + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
      }
      if (num) {
        result = num + result;
      }
      return result;
    }
  }
};
</script>

<style lang="scss" scoped>
$jbColorTop: rgba(255, 224, 86, 1);
$jbColorBottom: #ffcc00;
.product-detail {
  background-color: #f1f2f4;
}
.car-imgs {
  .swiper {
    height: 100%;
    img {
      display: block;
      margin: auto;
    }
  }
}
.car-info {
  padding-left: 28rpx;
  background: #fff;
  border-top: #f2f3f5 2rpx solid;
  .name {
    font-size: 36rpx;
    font-weight: 800;
    color: rgba(0, 0, 0, 1);
    line-height: 88rpx;
  }
  .price {
    span {
      color: #666666;
      font-size: 28rpx;
    }
  }
  .hot-icon {
    padding: 0 0 20rpx 0;
    li {
      display: inline-block;
      height: 36rpx;
      background: linear-gradient(180deg, $jbColorTop, $jbColorBottom);
      border-radius: 6rpx;
      margin-right: 10rpx;
      margin-top: 18rpx;
      p {
        font-size: 22rpx;
        color: #000;
        height: 36rpx;
        line-height: 36rpx;
        padding: 0 10rpx;
      }
    }
  }
  /* 购置税 */
  .containsService {
    font-size: 0.24rem;
    color: rgba(153, 153, 153, 1);
    line-height: 0.88rem;
    .icon {
      display: inline-block;
      line-height: 100%;
      width: 0.24rem;
      height: 0.24rem;
      background: url("../../../static/icon/tick.png") no-repeat center/100%;
      margin-right: 0.1rem;
    }
    p:nth-of-type(2) {
      margin-left: 0.6rem;
    }
    .wen_money {
      color: #f46d49;
    }
  }
}
.plans {
  min-height: 3rem;
  width: 100%;
  background: #fff;
  padding-top: 0.3rem;
  margin-bottom: 0.01rem;
  margin-top: 20rpx;
  .boxHide {
    display: none;
  }
  .title {
    height: 0.6rem;
    padding: 0 0.3rem;
    margin: 0 auto;
    color: #272636;
    margin-bottom: 0.2rem;
    font-size: 0.26rem;
    position: relative;
    padding-bottom: 0.3rem;
    overflow: hidden;
    .left {
      float: left;
      height: 0.58rem;
      line-height: 0.55rem;
      text-align: center;
      width: 50%;
      border-radius: 5px 0 0 5px;
      border: 1px solid #272636;
      box-sizing: border-box;
      -webkit-box-sizing: border-box;
    }
    .right {
      float: right;
      height: 0.58rem;
      line-height: 0.55rem;
      text-align: center;
      width: 50%;
      border-radius: 0 5px 5px 0;
      border: 1px solid #272636;
      box-sizing: border-box;
      -webkit-box-sizing: border-box;
    }
    .active {
      background: #272636;
      color: #fff;
    }
    :after {
      content: " ";
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      height: 1px;
      border-bottom: 1px solid #e5e5e5;
      color: #e5e5e5;
      -webkit-transform-origin: 0 100%;
      transform-origin: 0 100%;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      z-index: 2;
    }
  }
  .box1 {
    margin-bottom: 0.2rem;
    .plans-section {
      padding: 0 0.3rem;
      width: 100%;
      box-sizing: border-box;
      position: relative;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      -webkit-box-align: center;
      -webkit-align-items: center;
      align-items: center;
      flex-direction: row-reverse;
      padding-bottom: 0.05rem;
      .plans-item {
        position: relative;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        margin-left: 0.16rem;
        .label-icon {
          width: 0.32rem;
          height: 0.32rem;
          background: linear-gradient(180deg, $jbColorTop, $jbColorBottom);
          border-radius: 50%;
          font-weight: 400;
          font-size: 0.2rem;
          color: #000;
          text-align: center;
          margin-right: 0.12rem;
        }
        .label {
          font-size: 0.22rem;
          color: #000;
          font-weight: 400;
        }
      }
    }
    .priceDetail {
      overflow: hidden;
      padding-bottom: 0.6rem;
      min-height: 0.92rem;
      width: 100%;
      padding: 0 0.3rem;
      box-sizing: border-box;
      .price-title {
        position: relative;
        padding-left: 0.25rem;
        font-size: 0.32rem;
        color: #000;
        font-weight: bold;
        .icon {
          position: absolute;
          width: 0.08rem;
          height: 0.3rem;
          background: linear-gradient(180deg, $jbColorTop, $jbColorBottom);
          left: 0;
          top: 50%;
          -webkit-transform: translateY(-50%);
          border-radius: 4px;
        }
      }
      .price-table {
        width: 100%;
        background: #f9f9f9;
        height: 1.59rem;
        border-radius: 0.26rem;
        margin-top: 0.38rem;
        margin-bottom: 0.55rem;
        .item {
          width: 25%;
          position: relative;
          float: left;
          text-align: center;
          .label {
            font-size: 0.26rem;
            color: #000;
            margin: 0.3rem 0;
            font-weight: 400;
          }
          .val {
            color: #ff5c5d;
            font-size: 0.28rem;
            font-weight: bold;
          }
        }
        .item2line {
          :before {
            content: " ";
            position: absolute;
            left: 0;
            top: 0.4rem;
            height: 0.79rem;
            border-left: 1px solid #dddddd;
            -webkit-transform-origin: 0 100%;
            transform-origin: 0 100%;
            z-index: 2;
          }
          :after {
            content: " ";
            position: absolute;
            right: 0;
            top: 0.4rem;
            height: 0.79rem;
            border-right: 1px solid #dddddd;
            -webkit-transform-origin: 0 100%;
            transform-origin: 0 100%;
            z-index: 2;
          }
        }
        .item3line {
          :after {
            content: " ";
            position: absolute;
            right: 0;
            top: 0.4rem;
            height: 0.79rem;
            border-right: 1px solid #dddddd;
            -webkit-transform-origin: 0 100%;
            transform-origin: 0 100%;
            z-index: 2;
          }
        }
      }
      .priceDetail2 {
        .price-table {
          padding: 0 0.35rem;
          box-sizing: border-box;
        }
        .item1,
        .item2 {
          height: 0.79rem;
          line-height: 0.79rem;
          width: 100%;
        }
        .item1 {
          border-bottom: 1px dashed #bfbfbf;
        }
        .row {
          float: left;
          font-size: 0.26rem;
          color: #000;
          font-weight: 400;
          span {
            color: #ff5c5d;
            font-weight: bold;
          }
        }
        .row1 {
          width: 25%;
        }
        .row2 {
          width: 30%;
        }
        .row3 {
          width: 45%;
        }
      }
      .p-title2 {
        .left {
          background: url("/static/img/carProduct/p-titleBg2.png") no-repeat
            left top;
          background-size: 100% 100%;
        }
        .middle {
          color: #4d9fe6;
        }
        .right {
          background: url("/static/img/carProduct/p-titleBg2.png") no-repeat
            left top;
          background-size: 100% 100%;
        }
      }
      .detail1 {
        min-height: 3.38rem;
        width: 6.18rem;
        border: 1px dashed #f9b6a4;
        .txt1 {
          height: 0.7rem;
          line-height: 0.7rem;
          width: 100%;
          text-align: center;
          color: #000;
        }
        .txt2 {
          height: 0.6rem;
          line-height: 0.6rem;
          width: 100%;
          text-align: center;
          color: #ff5c5d;
          font-size: 0.52rem;
          font-weight: 600;
        }
        .txt3 {
          font-size: 26rpx;
          height: 0.7rem;
          line-height: 0.7rem;
          width: 100%;
          text-align: center;
          color: #000;
        }
        .txt4 {
          height: 0.6rem;
          line-height: 0.6rem;
          width: 100%;
          text-align: center;
          color: #ff5c5d;
          font-size: 0.52rem;
          font-weight: 600;
        }
        .txt5 {
          padding: 0.2rem;
          line-height: 0.3rem;
          text-align: center;
        }
      }
      .detail2 {
        min-height: 3.7rem;
        width: 6.18rem;
        border: 1px dashed #4d9fe6;
        display: flex;
        flex-direction: column;
        p {
          text-align: center;
        }
        .text1 {
          margin-top: 32rpx;
          font-size: 22rpx;
          color: #ff5c5d;
        }
        .text2 {
          margin-top: 18rpx;
          font-size: 22rpx;
          color: #000000;
        }
        .text3 {
          margin-top: 18rpx;
          font-size: 60rpx;
          color: #4d9fe6;
          font-weight: bold;
        }
        .text4 {
          margin-top: 18rpx;
          font-size: 22rpx;
          color: #000000;
        }
        .text5 {
          margin-top: 18rpx;
          font-size: 60rpx;
          color: #4d9fe6;
          font-weight: bold;
        }
        // .txt1 {
        // height: 0.7rem;
        // line-height: 0.7rem;
        // width: 100%;
        // text-align: center;
        // color: #000;
        // }
        // .txt2 {
        // height: 0.6rem;
        // line-height: 0.6rem;
        // width: 100%;
        // text-align: center;
        // color: #4d9fe6;
        // font-size: 0.52rem;
        // font-weight: 600;
        // }
        // .txt3 {
        // color: #888;
        // font-size: 26rpx;
        // height: 0.7rem;
        // line-height: 0.7rem;
        // width: 100%;
        // text-align: center;
        // color: #000;
        // }
        // .txt4 {
        // color: #888;
        // font-size: 26rpx;
        // height: 0.4rem;
        // line-height: 0.4rem;
        // width: 100%;
        // text-align: center;
        // }
        // .txt5 {
        // color: #888;
        // font-size: 26rpx;
        // height: 0.4rem;
        // line-height: 0.4rem;
        // margin-left: 2.35rem;
        // }
      }
    }
  }
  .box2 {
    margin-bottom: 0.2rem;
    .plans-section {
      padding: 0 0.3rem;
      width: 100%;
      box-sizing: border-box;
      position: relative;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      -webkit-box-align: center;
      -webkit-align-items: center;
      align-items: center;
      flex-direction: row-reverse;
      padding-bottom: 0.05rem;
      .plans-item {
        position: relative;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        margin-left: 0.16rem;
        .label-icon {
          width: 0.32rem;
          height: 0.32rem;
          background: linear-gradient(180deg, $jbColorTop, $jbColorBottom);
          border-radius: 50%;
          font-weight: 400;
          font-size: 0.2rem;
          color: #000;
          text-align: center;
          margin-right: 0.12rem;
        }
        .label {
          font-size: 0.22rem;
          color: #000;
          font-weight: 400;
        }
      }
    }
    .priceDetail {
      overflow: hidden;
      padding-bottom: 0.6rem;
      min-height: 0.92rem;
      width: 100%;
      padding: 0 0.3rem;
      box-sizing: border-box;
      .price-title {
        position: relative;
        padding-left: 0.25rem;
        font-size: 0.32rem;
        color: #000;
        font-weight: bold;
        .icon {
          position: absolute;
          width: 0.08rem;
          height: 0.3rem;
          background: #ff665c;
          left: 0;
          top: 50%;
          -webkit-transform: translateY(-50%);
          border-radius: 4px;
        }
      }
      .price-table {
        width: 100%;
        background: #f9f9f9;
        height: 1.59rem;
        border-radius: 0.26rem;
        margin-top: 0.38rem;
        margin-bottom: 0.55rem;
        .item {
          width: 25%;
          position: relative;
          float: left;
          text-align: center;
          .label {
            font-size: 0.26rem;
            color: #000;
            margin: 0.3rem 0;
            font-weight: 400;
          }
          .val {
            color: #ff5c5d;
            font-size: 0.28rem;
            font-weight: bold;
          }
        }
        .item2line {
          :before {
            content: " ";
            position: absolute;
            left: 0;
            top: 0.4rem;
            height: 0.79rem;
            border-left: 1px solid #dddddd;
            -webkit-transform-origin: 0 100%;
            transform-origin: 0 100%;
            z-index: 2;
          }
          :after {
            content: " ";
            position: absolute;
            right: 0;
            top: 0.4rem;
            height: 0.79rem;
            border-right: 1px solid #dddddd;
            -webkit-transform-origin: 0 100%;
            transform-origin: 0 100%;
            z-index: 2;
          }
        }
        .item3line {
          :after {
            content: " ";
            position: absolute;
            right: 0;
            top: 0.4rem;
            height: 0.79rem;
            border-right: 1px solid #dddddd;
            -webkit-transform-origin: 0 100%;
            transform-origin: 0 100%;
            z-index: 2;
          }
        }
      }
    }
  }
  .priceTab {
    width: 6.2rem;
    margin: 0 auto;
    border-collapse: collapse;
    font-size: 0.32rem;
    margin-bottom: 0.2rem;
    tr {
      td {
        text-align: center;
        border: 1px dashed #ededed;
        display: inline-block;
        width: 24%;
        height: 80px;
        line-height: 80px;
        font-weight: 600;
      }
      th {
        background: #f3f3f3;
        color: #000;
        display: inline-block;
        width: 25%;
        text-align: center;
        height: 80px;
        line-height: 80px;
        font-weight: 600;
      }
      .list1 {
        color: #000;
        font-weight: 600;
      }
      .list2 {
        color: #ff5c5d;
        font-weight: 600;
      }
      .list3 {
        color: #ff5c5d;
        font-weight: 600;
      }
    }
  }
}
/* 查看车辆信息 */
.carIntr {
  width: 100%;
  height: 0.88rem;
  background-color: #fff;
  margin-bottom: 0.2rem;
  line-height: 0.88rem;
  border-top: 1px solid #f9f9f9;
  .title {
    margin: 0 0.35rem;
    .left {
      font-size: 0.3rem;
    }
    .right > img {
      display: inline-block;
      width: 0.16rem;
      height: 0.27rem;
      line-height: 0.88rem;
      margin: 0.31rem 0 0;
    }
  }
}
/* 申请流程 */
.applyPro {
  height: 3.1rem;
  width: 100%;
  background: #fff;
  margin-bottom: 0.2rem;
  .title {
    height: 0.9rem;
    line-height: 0.9rem;
    width: 100%;
    border-bottom: 1px solid #f1f2f4;
    position: relative;
    .con {
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      -webkit-box-align: center;
      -webkit-align-items: center;
      align-items: center;
      position: absolute;
      left: 50%;
      -webkit-transform: translateX(-50%);
    }
    .left {
      height: 1px;
      width: 0.38rem;
      background: #000;
      margin: 0.42rem 0;
    }
    .middle {
      height: 0.86rem;
      line-height: 0.86rem;
      color: #000;
      text-align: center;
      margin: 0 0.19rem;
      font-size: 0.3rem;
      font-weight: bold;
    }
    .right {
      height: 1px;
      width: 0.38rem;
      background: #000;
      margin: 0.42rem 0;
    }
  }
  .proBox {
    height: 2.22rem;
    width: 100%;
    display: flex;
    display: -webkit-flex;
    position: relative;
    .line-box {
      height: 1px;
      .line {
        width: 0.56rem;
        height: 1px;
        position: absolute;
        top: 0.66rem;
      }
      .line1 {
        left: 20%;
      }
      .line3 {
        right: 20%;
      }
      .line2 {
        left: 50%;
        -webkit-transform: translateX(-50%);
      }
    }
    .part {
      flex: 1;
      -webkit-flex: 1;
      position: relative;
      .p-img {
        height: 0.5rem;
        width: 100%;
        margin-top: 0.46rem;
        margin-bottom: 0.1rem;
      }
      .p-img > img {
        height: 0.5rem;
        width: 0.5rem;
        margin: 0 auto;
        display: block;
      }
      .txt {
        display: block;
        height: 0.7rem;
        line-height: 0.3rem;
        width: 100%;
        text-align: center;
        font-size: 0.24rem;
        color: #333;
      }
    }
    .part4 .txt {
      line-height: 0.7rem;
    }
  }
}
.applyFiles {
  height: 3.1rem;
  width: 100%;
  background: #fff;
  margin-bottom: 0.7rem;
  padding-bottom: 0.5rem;
  .title {
    height: 0.86rem;
    line-height: 0.86rem;
    width: 100%;
    border-bottom: 1px solid #f1f2f4;
    position: relative;
    .con {
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      -webkit-box-align: center;
      -webkit-align-items: center;
      align-items: center;
      position: absolute;
      left: 50%;
      -webkit-transform: translateX(-50%);
    }
    .left {
      height: 1px;
      width: 0.38rem;
      background: #000;
      margin: 0.42rem 0;
    }
    .middle {
      height: 0.9rem;
      line-height: 0.9rem;
      color: #000;
      text-align: center;
      margin: 0 0.19rem;
      font-size: 0.3rem;
      font-weight: bold;
    }
    .right {
      height: 1px;
      width: 0.38rem;
      background: #000;
      margin: 0.42rem 0;
    }
  }
  .fileBox {
    height: 2.22rem;
    width: 100%;
    display: flex;
    display: -webkit-flex;
    .part {
      flex: 1;
      -webkit-flex: 1;
      .f-img {
        height: 1rem;
        width: 100%;
        margin-top: 0.33rem;
      }
      .f-img > img {
        height: 1rem;
        width: 1rem;
        margin: 0 auto;
        display: block;
      }
      .txt {
        display: block;
        height: 0.7rem;
        line-height: 0.9rem;
        width: 100%;
        text-align: center;
        font-size: 0.24rem;
      }
    }
  }
}
/* 拨打电话,立即申请 */
.bottom {
  height: 0.98rem;
  width: 100%;
  color: #fff;
  display: flex;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 999;
  .left {
    float: left;
    height: 0.98rem;
    width: 40%;
    background-size: 100% 100%;
    text-align: center;
    background: #000;
    .con {
      position: relative;
      font-size: 13px;
      i {
        display: block;
        height: 0.38rem;
        width: 0.38rem;
        background: url("../../../static/img/carProduct/tel.png") no-repeat left
          top;
        background-size: 100% 100%;
        position: absolute;
        left: 0.3rem;
        top: 0.2rem;
      }
      .free {
        font-size: 0.26rem;
        color: #fff !important;
        padding-left: 0.91rem;
        text-align: left;
        margin-top: 0.15rem;
      }
      .time {
        padding-left: 0.91rem;
        text-align: left;
        font-size: 0.22rem;
      }
    }
  }
  // .mid{
  // height: 0.98rem;
  // width: 20%;
  // background-size: 100% 100%;
  // .live{
  // text-align: center;
  // background:#000;
  // font-size: 0.26rem;
  // line-height: 0.98rem;
  // color: white;
  // padding: 0;
  // }
  // }
  .right {
    width: 60%;
    height: 0.98rem;
    background: linear-gradient(180deg, $jbColorTop, $jbColorBottom);
    button {
      height: 100%;
      width: 100%;
      line-height: 0.98rem;
      text-align: center;
      font-size: 0.32rem;
      color: #000;
      float: none;
      display: block;
      border: transparent;
      font-weight: 600;
    }
  }
}
/* 门店地址 */
.address {
  width: 100%;
  background: #fff;
  .shopAddress {
    border-bottom: 1px solid #f9f9f9;
    .title {
      height: 0.9rem;
      line-height: 0.9rem;
      width: 2.3rem;
      margin: 0 auto;
      font-size: 13px;
      .left {
        float: left;
        height: 1px;
        width: 0.38rem;
        background: #000;
        margin: 0.42rem 0;
      }
      .middle {
        float: left;
        height: 0.9rem;
        line-height: 0.9rem;
        color: #000;
        width: 1.54rem;
        text-align: center;
      }
      .right {
        float: right;
        height: 1px;
        width: 0.38rem;
        background: #000;
        margin: 0.42rem 0;
      }
    }
  }
  .addressBox {
    margin: 0 0.35rem;
    .company {
      font-size: 0.3rem;
      color: #000;
      margin-top: 0.36rem;
    }
    .addressDetail {
      padding: 0.34rem 0.8rem 0.38rem 0;
      font-size: 0.24rem;
      color: #888;
    }
    .icon {
      float: right;
      margin-top: -0.77rem;
      img {
        display: inline-block;
        width: 0.35rem;
        height: 0.35rem;
        line-height: 0.35rem;
      }
    }
    .distance {
      font-size: 0.24rem;
      padding-bottom: 0.3rem;
      .storeDistance {
        font-size: 0.24rem;
        color: #606060;
        margin-right: 0.33rem;
      }
      .lately {
        display: none;
        font-size: 0.24rem;
        color: #ffbd56;
      }
    }
  }
}
/* 查看全部门店地址 */
.allShop {
  width: 100%;
  height: 0.88rem;
  line-height: 0.88rem;
  background-color: #fff;
  border-top: 1px solid #f9f9f9;
  margin-bottom: 0.2rem;
  .title {
    margin: 0 0.35rem;
    .left {
      font-size: 0.3rem;
      color: #888;
    }
    .right > img {
      display: inline-block;
      width: 0.16rem;
      height: 0.27rem;
      line-height: 0.88rem;
      margin: 0.31rem 0 0;
    }
  }
}
/* 猜你喜欢 */
.like {
  width: 100%;
  height: 0.9rem;
  line-height: 0.9rem;
  .title {
    text-align: center;
    span > img {
      display: inline-block;
      width: 0.32rem;
      height: 0.28rem;
      margin-right: 0.14rem;
      vertical-align: middle;
    }
    .guessLike {
      font-size: 0.3rem;
      vertical-align: middle;
    }
  }
}
// 猜你喜欢的车-->
.carListBox {
  padding-bottom: 1.5rem;
  p {
    font-size: 0.24rem;
    color: #666;
  }
  .carLoading {
    text-align: center;
    font-size: 0.3rem;
    color: #333;
  }
}
.carList {
  border-bottom: 1px solid #f3f3f3;
  background: #fff;
  padding: 0.36rem 0.1rem 0.36rem 0.36rem;
  .car_left {
    width: 2.1rem;
    height: 1.8rem;
    display: inline-block;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .car_right {
    display: inline-block;
    margin-left: 0.25rem;
    width: 4.6rem;
    .car_title {
      p {
        font-size: 0.32rem;
        color: #333;
        height: 0.36rem;
        line-height: 0.36rem;
        font-weight: 700; // 3个点显示
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
    .firstPayment {
      margin-top: 0.1rem;
      font-size: 0.26rem;
      height: 0.53rem;
      line-height: 0.53rem;
      font-weight: 700;
      vertical-align: bottom;
      p {
        color: #ff5c5d;
        float: left;
        vertical-align: bottom;
      }
      .monthPayment {
        margin-left: 0.35rem;
        color: #70b3e1;
        vertical-align: bottom;
        font-size: 0.26rem;
      }
      .firstPaymentNumber {
        font-size: 0.4rem;
        height: 0.5rem;
        line-height: 0.5rem;
        vertical-align: top;
      }
    }
    .guidePrice {
      font-size: 0.24rem;
      color: #666;
      height: 0.43rem;
      line-height: 0.43rem;
    }
    .others {
      p {
        font-size: 0.24rem;
        color: #999;
        line-height: 0.3rem;
        margin-top: 0.08rem;
      }
    }
    .hotLable {
      span {
        display: inline-block;
        height: 0.36rem;
        line-height: 0.36rem;
        color: #fff;
        margin-right: 0rem;
        border-radius: 0.06rem;
        margin-top: 0.12rem;
        padding: 0 0.07rem;
        font-size: 0.22rem;
        background-image: linear-gradient(0deg, #ff655d, #ff775c);
        // 线性有百分比写法
      }
    }
  }
}
.btn-live {
  position: fixed;
  right: 0;
  bottom: 1.5rem;
  z-index: 9999;
  width: 1rem;
  height: 1rem;
  .live {
    width: 100%;
    height: 100%;
    padding: 0;
    .liveImg {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
