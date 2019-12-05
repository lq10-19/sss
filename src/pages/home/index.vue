<template>
  <div class="container">
    <div class="searchBox" :class="{changeSearchCss:isChange}">
      <div class="city">
        <p>{{positionCity?positionCity:'定位中...'}}</p>
        <!-- <img src="../../../static/icon/triangleChange.png"> -->
      </div>
      <div class="search" v-if="true">
        <img src="/static/icon/searchChange.png" />
        <form action="#">
          <input @focus="searchFun" type="search" placeholder="搜索您想要的车" v-model="serchVal" />
        </form>
      </div>
    </div>

    <div class="slide">
      <swiper
        :indicator-dots="false"
        class="swiper"
        :autoplay="true"
        :interval="3000"
        :duration="500"
        :circular="true"
      >
        <swiper-item
          v-for="(item,index) in imgData"
          :key="index"
          @click="jumpTo(item.activityName,item)"
        >
          <img :src="item.activityImg" />
        </swiper-item>
      </swiper>
    </div>

    <div class="section-2" style="padding-top:2rem">
      <!-- 功能图标 -->
      <div class="quick">
        <div @click="goOldcar">
          <img src="../../../static/homeImg/icon_esc.png" alt />
          <p>二手车</p>
        </div>
        <div @click="goNewcar">
          <img src="../../../static/homeImg/iocn_xc.png" alt />
          <p>新车</p>
        </div>
        <!-- <div @click="goCzyr">
          <img src="../../../static/homeImg/icon_hcyr.png" alt>
          <p>好车易融</p>
        </div>-->
        <div @click="goCdd">
          <img src="../../../static/homeImg/icon_hcyr.png" alt />
          <p>佰车融</p>
        </div>
        <!-- <div @click="goCzyr">
          <img src="../../../static/homeImg/icon_czyr.png" alt>
          <p>车主易融</p>
        </div>-->
        <div @click="goBxfq">
          <img src="../../../static/homeImg/icon_czyr.png" alt />
          <p>保险分期</p>
        </div>
      </div>
    </div>

    <div class="section-2" style="padding-top:1rem;padding-bottom:1rem;">
      <!-- 功能图标 -->
      <div class="quick">
        <div @click="goPrice">
          <img src="../../../static/homeImg/icon_gj.png" alt />
          <p>汽车估价</p>
        </div>
        <!-- <div @click="goWei">
          <img src="../../../static/homeImg/icon_wzcx.png" alt>
          <p>违章查询</p>
        </div>-->
        <div @click="goZx">
          <img src="../../../static/homeImg/icon_wzcx.png" alt />
          <p>汽车资讯</p>
        </div>
        <div @click="goJycz">
          <img src="../../../static/homeImg/icon_jycz.png" alt />
          <p>加油充值</p>
        </div>
        <div @click="goZacx">
          <img src="../../../static/homeImg/icon_djcx.png" alt />
          <p>底价车险</p>
        </div>
      </div>
    </div>
    <!-- 活动胶囊入口 -->
    <!-- <div class="redBag" v-show="hasActiveGroup">
      <img
        v-if="ActiveCapsuleImg[0]"
        :src="ActiveCapsuleImg[0].activityImg"
        @click="jumpTo(ActiveCapsuleImg[0].activityName, ActiveCapsuleImg[0])"
      >
    </div>-->
    <!-- 汽车品牌 -->
    <div class="line"></div>
    <!-- <div class="section-2" style="padding-top:1rem">
      <div class="quick">
        <div class="priceRange">
          <p>5万以下</p>
        </div>
        <div class="priceRange">
          <p>5-10万</p>
        </div>
        <div class="priceRange">
          <p>10-15万</p>
        </div>
        <div class="priceRange">
          <p>15万以上</p>
        </div>
      </div>
    </div>-->
    <div class="section-2">
      <!-- <p class="title">热门品牌</p> -->
      <ul>
        <li v-for="item in hotBrandList" :key="item.brandId" @click="toCalList(item.brandId)">
          <img :src="item.imgAddress" />
          <p>{{item.brandName}}</p>
        </li>
        <li @click="toBrand">
          <img src="/static/icon/more@2x.png" />
          <p>更多</p>
        </li>
      </ul>
    </div>
    <!-- <div class="section-3">
      <p class="title">爆款推荐</p>
      <scroll-view :scroll-x="true" class="scroll-view">
        <div
          v-for="item in hotCarList"
          :key="item.productId"
          class="item"
          @click="gotoProductDetails(item.productId)"
        >
          <img src="/static/icon/tab1@2x.png" alt class="tab1" style="width:25px;height:32px;">
          <img
            :src="item.imgAddress"
            :style="{width:hotCarImgStyle.width,height:hotCarImgStyle.height}"
          >
          <div class="desc">
            <p>{{item.productName}}</p>
            <p>
              <span>首付&nbsp;</span>
              <span class="value">{{item.downPayment}}</span>
              <span>&nbsp;万</span>
            </p>
            <p>{{item.monthlySupply}}元/月</p>
          </div>
        </div>
      </scroll-view>
    </div>-->
    <div class="line"></div>
    <!-- 万元家用车  -->
    <div class="familyCar">
      <div v-for="(item,i) in labels" :key="i">
        <div
          class="items"
          :class="{wan:item.labelName=='万元家用车',zhun:item.labelName=='准新车',ru:item.labelName=='入门首选',
        xian:item.labelName=='限时特卖'}"
          @click="goSpecialCar(item.labelId,item.labelName)"
        >
          <h1>{{item.labelName}}</h1>
          <p v-if="item.labelName=='万元家用车'">热销车型 舒适性高</p>
          <p v-if="item.labelName=='万元家用车'">性价比高</p>
          <p v-if="item.labelName=='准新车'">3年内准新车 权威认证</p>
          <p v-if="item.labelName=='准新车'">品质保障</p>
          <p v-if="item.labelName=='入门首选'">低价格 高品质</p>
          <p v-if="item.labelName=='入门首选'">新手必备</p>
          <p v-if="item.labelName=='限时特卖'">低首付 低月供</p>
          <p v-if="item.labelName=='限时特卖'">轻松购入无压力</p>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <!--二手车 -->
    <div class="section-4">
      <img src="http://bqyx-qiniu.bqrzzl.com/1ershouche.png" class="productImg" @click="goOldcar" />
      <div class="section-5">
        <div
          v-for="(item,carIndex) in oldCarList"
          :key="carIndex"
          class="item"
          @click="oldCarToHV(item.carId)"
        >
          <p class="p1" v-if="(carIndex+1)%3 === 1">人气车型</p>
          <p class="p1" v-if="(carIndex+1)%3 === 2">奢华享受</p>
          <p class="p1" v-if="(carIndex+1)%3 === 0">超值车款</p>
          <img src="/static/icon/tab.png" alt class="tab1" />
          <img :src="item.carImage" alt class="tab2" style="width:216rpx;height:186rpx;" />
          <div class="desc">
            <p>
              <span>首付&nbsp;</span>
              <span class="value">{{item.initialPayment}}</span>
              <span>&nbsp;万</span>
            </p>
            <p>{{item.carName}}</p>
          </div>
        </div>
      </div>
    </div>
    <!--新车 -->
    <div class="section-4">
      <img src="http://bqyx-qiniu.bqrzzl.com/2xinche.png" class="productImg" @click="goNewcar" />
      <div class="section-5">
        <div
          v-for="(item,carIndex) in carList"
          :key="item.productStateId"
          class="item"
          @click="gotoProductDetails(item.productId)"
        >
          <p class="p1" v-if="(carIndex+1)%3 === 1">人气车型</p>
          <p class="p1" v-if="(carIndex+1)%3 === 2">奢华享受</p>
          <p class="p1" v-if="(carIndex+1)%3 === 0">超值车款</p>
          <img src="/static/icon/tab.png" alt class="tab1" />
          <img :src="item.imgAddress" alt class="tab2" style="width:216rpx;height:186rpx;" />
          <div class="desc">
            <p>
              <span>首付&nbsp;</span>
              <span class="value">{{item.downPayment}}</span>
              <span>&nbsp;万</span>
            </p>
            <p>{{item.productName}}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 热门推荐、低首付、低月供 -->
    <!-- <div v-for="(item,carIndex) in carList" :key="item.productStateId" class="section-4">
      <img
        src="http://bqyx-qiniu.bqrzzl.com/tittle1@2x.png"
        class="productImg"
        v-if="(carIndex+1)%3 === 1"
        @click="test(item)"
      >
      <img
        src="http://bqyx-qiniu.bqrzzl.com/tittle2@2x.png"
        class="productImg"
        v-if="(carIndex+1)%3 === 2"
        @click="test(item)"
      >
      <img
        src="http://bqyx-qiniu.bqrzzl.com/tittle3@2x.png"
        class="productImg"
        v-if="(carIndex+1)%3 === 0"
        @click="test(item)"
      >
      <div class="section-5">
        <div
          v-for="product in item.list"
          :key="product.productId"
          class="item"
          @click="gotoProductDetails(product.productId)"
        >
          <img src="/static/icon/tab2@2x.png" alt class="tab1" v-if="(carIndex+1)%3 === 1">
          <img src="/static/icon/tab3@2x.png" alt class="tab1" v-if="(carIndex+1)%3 === 2">
          <img src="/static/icon/tab4@2x.png" alt class="tab1" v-if="(carIndex+1)%3 === 0">
          <img :src="product.imgAddress" alt class="tab2" style="width:216rpx;height:186rpx;">
          <div class="desc">
            <p>{{product.productName}}</p>
            <p>
              <span>首付&nbsp;</span>
              <span class="value">{{product.downPayment}}</span>
              <span>&nbsp;万</span>
            </p>
            <p>{{product.monthlySupply}}元/月</p>
          </div>
        </div>
      </div>
    </div>-->
    <!-- 为您推荐 -->
    <div class="section-6">
      <div class="title">
        <img src="/static/icon/tuijian@2x.png" />
        <span>为您推荐</span>
      </div>
      <div class="carMain">
        <div v-for="(item,i) in hotCarList" :key="i" @click="gotoProductDetails(item.productId)">
          <img :src="item.imgAddress" />
          <h1>{{item.productNameMain}}</h1>
          <p>{{item.productDetailed}}</p>
          <h2>
            首付
            <span>{{item.downPayment}}</span> 万
          </h2>
          <h3>
            月供
            <span>{{item.monthlySupply}}</span>元
          </h3>
        </div>
      </div>
    </div>
    <!-- 活动弹窗 -->
    <!-- <div
      class="active-bargain-wrapper"
      :class="{show:isShowBargainWrapper}"
      catchtouchmove="ture"
      v-if="vbNewUser"
    >
      <img
        v-if="popupImg[0]"
        class="img"
        :src="popupImg[0].activityImg"
        @click="jumpTo(popupImg[0].activityName, popupImg[0])"
      >
      <img class="icon clear" src="/static/icon/clear.png" @click="isShowBargainWrapper=false">
    </div>-->
  </div>
</template>

<script>
import {
  path,
  dataConfig,
  getUserInfo,
  isBindPhone,
  getLoginInfo,
  apiFail,
  showLoading,
  hideLoading,
  isHuaWei,
  isOppo,
  getSystemInfo,
  event,
  compareVersion,
  getSceneCode,
  setSceneCode,
  link
} from "@/utils/index";
import md5 from "md5";
import { debug } from "util";
export default {
  data() {
    return {
      userInfo: {},
      hotBrandList: [],
      hotCarList: [],
      carList: [],
      isChange: false,
      positionCity: false,
      showLoading: false,
      bindPhone: false,
      //有无活动
      hasActivity: false,
      //有无拜年活动
      hasNewYearActivity: false,
      hasSweepActivity: false,
      hasAccuActivity: false,
      activityId: "",
      //有无红包
      hasRedBag: false,
      //有无活动胶囊
      hasActiveGroup: false,
      //是否打开红包
      redBag: false,
      type: [1, 2, 3],
      //红包活动金额
      money: 0,
      //邀请人id
      aidUserId: "",
      //是否去过登录页面
      isGoLoginPage: false,
      //判断新老用户
      userFlag: "",
      isHuaWei: false,
      isOppo: false,
      redBagStyle: {
        width: "",
        height: ""
      },
      redTextStyle: {
        marginTop: "0",
        marginTopA: "0"
      },
      imgData: [], //活动轮播图
      ActiveCapsuleImg: [], //活动胶囊图
      popupImg: [], //活动弹窗图
      hotCarImgStyle: {
        width: "",
        height: ""
      },
      carHeight: "",
      showSignPop: true,
      isShowBargainWrapper: false, //弹窗显示开关
      vbNewUser: false, //vb活动新用户
      //是否去过绑定手机号页面
      goBindPhonePage: false,
      labels: [], //二手车标签
      oldCarList: [] //二手车展示列表（3条）
    };
  },
  onLoad(options) {
    //资讯提示红点
    wx.showTabBarRedDot({
      index: 3
    });
    // if (options.scene) {
    //   setSceneCode(options.scene);
    //   this.aidUserId = options.scene;
    // } else {
    //   setSceneCode(options.aidUserId);
    //   this.aidUserId = options.aidUserId;
    // }
    this.userFlag = options.userFlag;
    this.isHuaWei = isHuaWei();
    this.isOppo = isOppo();
    let systemInfo = getSystemInfo();
    let height = systemInfo.windowHeight;
    let width = systemInfo.windowWidth;
    this.redBagStyle.width = "100%";
    this.redBagStyle.height = 861.45 + "rpx";
    this.redTextStyle.marginTop = height * 0.4 + "px";
    this.redTextStyle.marginTopA = height * 0.19 + "px";
    this.hotCarImgStyle.width = width * 0.35 + "px";
    this.hotCarImgStyle.height = width * 0.35 * 0.857 + "px";
    if (options.from) {
      console.log(options);
      //埋点
      getApp().aldstat.sendEvent(event["from"], options.from);
    }
    // const system =systemInfo.system;
    // if (compareVersion(system, "iOS 10.3.3") < 0) {
    //   wx.showModal({
    //     title: "提示",
    //     content:
    //       "当前系统版本过低，无法正常使用该功能，请升级到最新系统版本后重试。"
    //   });
    // }
  },
  //点击tab事件
  onTabItemTap(item) {
    wx.hideTabBarRedDot({
      index: 3
    });
  },
  onPageScroll({ scrollTop }) {
    if (scrollTop >= 1) {
      this.isChange = true;
    } else {
      this.isChange = false;
    }
  },
  onShow() {
    this.hasRedBag = false;
    this.redBag = false;
    // if (!getLoginInfo() && !this.isGoLoginPage) {
    //   this.isGoLoginPage = true;
    //   const url = "/pages/login/main";
    //   wx.navigateTo({ url });
    //   return;
    // }
    if (!getLoginInfo() && !this.isGoLoginPage) {
      wx.showModal({
        title: "请求授权",
        content: "为了获取更多的服务内容，请先进行授权登录",
        success(res) {
          if (res.confirm) {
            console.log("用户点击确定");
            this.isGoLoginPage = true;
            const url = "/pages/login/main";
            wx.navigateTo({ url });
            return;
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    } else {
      //获取地理位置
      this.getLocation();
    }
    showLoading(
      this.getHotBrandData(),
      this.qureyCarList(),
      this.getActivity(),
      this.getNewYearActivity(),
      this.getSweepActivity(),
      this.getAccuActivity()
    );
    //获取地理位置
    //this.getLocation();
    //请求活动列表
    this.getGroupActivity();
    this.isShowBargainWrapper = true;
    //生成新人礼包
    //this.getGeneratePackage();
    //判断拉新关系
    //this.saveInvitation();
    //获取二手车标签
    this.getLabels();
    //获取二手车前3个展示
    this.queryList();
  },
  onHide() {
    //清空活动图
    this.imgData = [];
    this.ActiveCapsuleImg = [];
    this.popupImg = [];
  },
  onShareAppMessage() {
    return {
      title: "佰仟易行",
      path: "/pages/home/main",
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    };
  },
  methods: {
    putClose() {
      this.hasRedBag = false;
    },
    jumpTo(resName, resItem) {
      if (resName == "AI扫车") {
        wx.navigateTo({
          url: "/pages/active/sweeping/main"
        });
      } else if (resName == "签到") {
        wx.navigateTo({
          url: "/pages/service/sign/main?backShow=false"
        });
      } else if (resName == "积步") {
        wx.navigateTo({
          url: "/pages/active/accumulation/main"
        });
      } else if (resName == "商城砍价活动") {
        if (!getLoginInfo()) {
          const url = "/pages/login/main";
          wx.navigateTo({ url });
          return;
        }
        let userId = getLoginInfo().userid;
        let toLink = link.bargainActive + `?userId=${userId}`;
        toLink = encodeURIComponent(toLink);
        let url = `/pages/bargainPage/main?toLink=${toLink}`;
        wx.navigateTo({
          url: url
        });
      } else if (resName == "组队抽奖活动") {
        let url = `/pages/active/group/main?activityId=${
          resItem.id
        }&activityNo=${resItem.activityNo}`;
        wx.navigateTo({
          url
        });
      } else if (resName == "拉新领V币活动") {
        this.openPackage();
      } else if (resName == "二手车") {
        this.goOldcar();
      }
    },
    goClose() {
      this.redBag = false;
    },
    goRecord() {
      wx.navigateTo({
        url: "/pages/user/walletRecord/main"
      });
    },
    test(item) {
      let url = path.getProductStatuslist;
      let productStateId = item.productStatusId;
      wx.navigateTo({
        url: `/pages/car/main?productStateId=${productStateId}`
      });
    },
    /**
     * 查看活动
     */
    getActivity() {
      let url = path.getActivity;
      let loginInfo = getLoginInfo();
      let queryData = {
        userId: loginInfo.userid,
        sourceType: dataConfig.sourceType
      };
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          if (data == null) {
            this.hasActivity = false;
          } else {
            this.activityId = data.activityId;
            this.hasActivity = true;
            this.money = data.amount;
            //未领取红包
            if (data.gotFlag == 0) {
              this.hasRedBag = true;
            }
          }
        })
        .catch(e => {
          apiFail(e);
        });
      return promise;
    },
    getNewYearActivity() {
      let loginInfo = getLoginInfo();
      let url = path.getNewYearActivity + "/" + "bqyx_E_001";
      let queryData = {};
      let promises = this.$fly.get(url, queryData);
      promises
        .then(data => {
          if (data == null) {
            this.hasNewYearActivity = false;
          } else {
            if (data.enabled == "1" && data.status == "B") {
              this.hasNewYearActivity = true;
            } else {
              this.hasNewYearActivity = false;
            }
          }
        })
        .catch(e => {
          apiFail(e);
        });
      return promises;
    },
    getSweepActivity() {
      let loginInfo = getLoginInfo();
      let url = path.getSweepActivity + "/" + "bqyx_F_001";
      let queryData = {};
      let promises = this.$fly.get(url, queryData);
      promises
        .then(data => {
          if (data == null) {
            this.hasSweepActivity = false;
          } else {
            if (data.enabled == "1" && data.status == "B") {
              this.hasSweepActivity = true;
            } else {
              this.hasSweepActivity = false;
            }
          }
        })
        .catch(e => {
          apiFail(e);
        });
      return promises;
    },
    getAccuActivity() {
      let loginInfo = getLoginInfo();
      let url = path.getSweepActivity + "/" + "bqyx_G_001";
      let queryData = {};
      let promises = this.$fly.get(url, queryData);
      promises
        .then(data => {
          if (data == null) {
            this.hasAccuActivity = false;
          } else {
            if (data.enabled == "1" && data.status == "B") {
              this.hasAccuActivity = true;
            } else {
              this.hasAccuActivity = false;
            }
          }
        })
        .catch(e => {
          apiFail(e);
        });
      return promises;
    },

    //请求活动列表
    getGroupActivity() {
      let url = path.queryActivity;
      let queryData = {
        upperChannel: 2,
        advertPosition: 1
      };
      let promises = this.$fly.get(url, queryData);
      promises
        .then(data => {
          if (data && data.length > 0) {
            this.imgData = data;
            //console.log('轮播图:')
            //console.log(this.imgData)
          } else {
            let logo = {
              activityImg:
                "http://bqyx-qiniu.bqrzzl.com/%E4%BD%B0%E4%BB%9F%E6%98%93%E8%A1%8Clogo.png"
            };
            this.imgData.push(logo);
          }
        })
        .catch(e => {
          apiFail(e);
        });
      let queryData2 = {
        upperChannel: 2,
        advertPosition: 2
      };
      let promises2 = this.$fly.get(url, queryData2);
      promises2
        .then(data => {
          if (data && data.length > 0) {
            this.ActiveCapsuleImg = data;
            this.hasActiveGroup = true;
            //console.log('胶囊图:')
            //console.log(this.ActiveCapsuleImg)
          }
        })
        .catch(e => {
          apiFail(e);
        });
      let queryData5 = {
        upperChannel: 2,
        advertPosition: 5
      };
      let promises5 = this.$fly.get(url, queryData5);
      promises5
        .then(data => {
          if (data && data.length > 0) {
            this.popupImg = data;
            //console.log('弹窗图:')
            //console.log(this.popupImg)
          }
        })
        .catch(e => {
          apiFail(e);
        });
    },
    //判断vb活动新人
    getGeneratePackage() {
      this.vbNewUser = false;
      let url = path.generatePackage;
      let queryData = {
        userId: getLoginInfo().userid
      };
      let promises = this.$fly.post(url, queryData);
      promises
        .then(data => {
          if (data != null && data.openFlag != 1) {
            //是新用户
            this.vbNewUser = true;
          }
        })
        .catch(e => {
          apiFail(e);
        });
    },
    //判断vb活动拉新关系
    saveInvitation() {
      //console.log("判断拉新关系")
      if (this.$root.$mp.query.inviterUserId) {
        //console.log("有邀请人")
        let url = path.saveInvitation;
        let queryData = {
          userId: getLoginInfo().userid,
          aidUserId: this.$root.$mp.query.inviterUserId
        };
        let promises = this.$fly.post(url, queryData);
        promises
          .then(data => {
            //是新用户
            if (data == 1) {
              //邀请人领取奖励
              let queryData = {
                userId: this.$root.$mp.query.inviterUserId,
                taskId: this.$root.$mp.query.taskId,
                attach: `${getLoginInfo().userid}_${
                  this.$root.$mp.query.inviterUserId
                }`
              };
              let promises = this.$fly.post(path.getTaskReward, queryData);
              promises
                .then(data => {
                  console.log("Invitation");
                })
                .catch(e => {
                  apiFail(e);
                });
            }
          })
          .catch(e => {
            apiFail(e);
          });
      }
    },
    /**
     * 打开红包
     */
    openRedBag() {
      if (!isBindPhone()) {
        let url = "/pages/login/bindPhone/main";
        wx.navigateTo({ url });
        return;
      }
      let url = path.getRedopen2;
      let loginInfo = getLoginInfo();
      let queryData = {
        type: "openRedBag",
        aaaa: Date.now(),
        userId: loginInfo.userid,
        aidUserId: getSceneCode(),
        activityId: this.activityId,
        sourceType: dataConfig.sourceType,
        userFlag: this.userFlag
      };
      this.$fly
        .post(url, queryData)
        .then(data => {
          if (data == null) {
            this.redBag = false;
          } else {
            this.hasRedBag = false;
            this.redBag = true;
          }
        })
        .catch(e => {
          apiFail(e);
        });
    },
    searchFun() {
      const url = "../search/main";
      wx.navigateTo({ url });
    },
    //跳转品牌分类
    toCalList(brandId) {
      const url = `/pages/car/main?brandId=${brandId}`;
      wx.navigateTo({ url });
    },
    //更多
    toBrand() {
      const url = `../brand/main`;
      wx.navigateTo({ url });
    },
    //分享得红包
    // getRedBag() {
    //   getApp().aldstat.sendEvent(event["home.invitation.redbag"]);
    //   if (!getLoginInfo()) {
    //     const url = "/pages/login/main";
    //     wx.navigateTo({ url });
    //     return;
    //   }
    //   wx.navigateTo({
    //     url: "/pages/service/redBag/main"
    //   });
    // },
    // bindViewTap() {
    //   const url = "../logs/main";
    //   wx.navigateTo({ url });
    // },
    //跳转车辆详情
    gotoProductDetails(productId) {
      wx.navigateTo({
        url: `/pages/productDetails/main?productId=${productId}`
      });
    },
    //热门品牌列表
    getHotBrandData() {
      let queryData = { brandStateId: dataConfig.hotCarId };
      let url = path.hotBrand;
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          this.getHotBrandDataSuccess(data);
        })
        .catch(error => {
          apiFail(error);
        });
      return promise;
    },
    getHotBrandDataSuccess(data) {
      if (data.length === 0) {
        return;
      }
      if (data.length > 9) {
        this.hotBrandList = data.slice(0, 9);
      } else {
        this.hotBrandList = data;
      }
    },
    qureyCarList() {
      let url = path.getProductStatuslist;
      let promise = this.$fly.post(url);
      promise
        .then(data => {
          // data.forEach(item => {
          //   item.list.forEach(p => {
          //     p.downPayment = p.downPayment / 10000;
          //     // .toFixed(2);
          //   });
          // });
          // this.hotCarList = data[0].list;
          // this.carList = data.slice(1);
          // //只显示前四个
          // this.carList.forEach(item => {
          //   item.list = item.list.slice(0, 4);
          // });
          data.forEach(item => {
            item.list.forEach(p => {
              p.downPayment = p.downPayment / 10000;
              // .toFixed(2);
            });
          });
          //为您推荐
          this.hotCarList = data[0].list;
          this.hotCarList.forEach(element => {
            let n = element.productName.indexOf("2");
            element.productNameMain = element.productName.substring(0, n);
            //console.log(element.productNameMain);
            element.productDetailed = element.productName.substring(n);
            //console.log(element.productDetailed);
          });
          //新车专场
          this.carList = data[1].list;
          console.log(data, 111);
        })
        .catch(error => {
          apiFail(error);
        });
      return promise;
    },
    //一成首付
    toList() {
      const url = `/pages/car/main?productStateId=3`;
      wx.navigateTo({ url });
    },
    //佰车融
    goCdd() {
      // if (isBindPhone()) {
      //   wx.navigateTo({
      //     url: "/pages/user/cddApply/main"
      //   });
      // } else {
      //   const url = "/pages/login/bindPhone/main";
      //   wx.navigateTo({ url });
      // }
      wx.showToast({
        title: "功能升级中，尽情期待",
        icon: "none"
      });
    },
    //好车易融
    goCzyr() {
      getApp().aldstat.sendEvent(event["home.czyr.apply"]);
      if (!getLoginInfo()) {
        const url = "/pages/login/main";
        wx.navigateTo({ url });
        return;
      }
      if (!isBindPhone()) {
        wx.navigateTo({
          url: "/pages/login/bindPhone/main"
        });
        return;
      }
      // wx.navigateTo({
      //   url: "/pages/czyr/main"
      // });
      wx.showToast({
        title: "即将上线，尽情期待",
        icon: "none"
      });
    },
    //保险分期
    goBxfq() {
      if (!getLoginInfo()) {
        const url = "/pages/login/main";
        wx.navigateTo({ url });
        return;
      }
      if (!isBindPhone()) {
        wx.navigateTo({
          url: "/pages/login/bindPhone/main"
        });
        return;
      }
      if (true) {
        wx.scanCode({
          success: res => {
            console.log("扫描二维码", res);
            console.log("携带内容", res.result);
            if (res.result.indexOf("QdbApplication") != -1) {
              let result = JSON.parse(res.result);
              console.log(result, 303);
              result.userId = getLoginInfo().userid;
              result.userType = "1";
              let bxfqQrCodeData = encodeURIComponent(JSON.stringify(result));
              console.log(bxfqQrCodeData, 404);
              wx.navigateTo({
                url: `/pages/user/bxfq/main?backData=${bxfqQrCodeData}`
              });
            } else {
              console.log("请扫描销售经理的二维码");
              wx.showToast({
                title: "请扫描销售经理的二维码",
                icon: "none"
              });
            }
          }
        });
      } else {
        wx.showToast({
          title: "即将上线，尽情期待",
          icon: "none"
        });
      }
    },
    //底价车险
    goZacx() {
      wx.navigateTo({
        url: "/pages/djcx/main"
      });
    },
    //汽车资讯
    goZx() {
      wx.switchTab({
        url: "/pages/service/news/main"
      });
    },
    //违章查询
    goWei() {
      getApp().aldstat.sendEvent(event["violation.enquiry"]);
      let url = "";
      if (!isBindPhone()) {
        url = "/pages/login/bindPhone/main";
      } else {
        url = "/pages/service/violationInquiry/main";
      }
      wx.navigateTo({ url });
    },
    //汽车估价
    goPrice() {
      getApp().aldstat.sendEvent(event["car.evaluation"]);
      if (!isBindPhone()) {
        wx.navigateTo({ url: "/pages/login/bindPhone/main" });
      } else {
        wx.navigateTo({ url: "/pages/service/evaluate/main" });
      }
    },
    //二手车列表
    queryList() {
      let queryData = {
        pageNo: 1,
        pageSize: 3,
        labelId: "ce24d8468982430d8164af6ec566f400"
      };
      let url = path.getByLabel;
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          this.oldCarList = data.infoList;
        })
        .catch(error => {
          apiFail(error);
        });
    },
    //二手车
    goOldcar() {
      wx.switchTab({
        url: "/pages/carSelection/main"
      });
    },
    //二手车跳转H5详情
    oldCarToHV(options) {
      let carId = encodeURIComponent(options);
      wx.navigateTo({
        url: `/pages/carItem/main?carId=${carId}`
      });
    },
    //新车
    goNewcar() {
      wx.navigateTo({
        url: `/pages/car/main?productStateId=2`
      });
    },
    //加油充值
    goJycz() {
      // wx.navigateTo({
      //   url: "/pages/jycz/main"
      // });
      wx.showToast({
        title: "功能升级中，尽情期待",
        icon: "none"
      });
    },
    //获取位置API
    getLocation() {
      this.authorizeLoaction()
        .then(() => {
          wx.getLocation({
            type: "wgs84",
            success: res => {
              let latitude, longitude;
              latitude = res.latitude.toString();
              longitude = res.longitude.toString();
              let service = "https://apis.map.qq.com";
              let path = "/ws/geocoder/v1";
              let key = "GMCBZ-5KDWD-DF74G-HVAMW-UGCEJ-E5BIE";
              let sk = "hotongfN6xAWnasEc2MRGj6orzVBibN";
              let location = latitude + "," + longitude;
              let sig = md5(`${path}?key=${key}&location=${location}${sk}`);
              console.log("sig", sig);
              let url = `${service}${path}?key=${key}&location=${location}&sig=${sig}`;
              wx.request({
                header: {
                  "Content-Type": "application/text"
                },
                url: url,
                success: res => {
                  try {
                    this.positionCity = res.data.result.address_component.city;
                  } catch (error) {
                    console.log(error);
                    this.positionCity = "未知城市";
                  }
                },
                fail: e => apiFail(e)
              });
            },
            fail: e => {
              console.error(e);
            }
          });
        })
        .catch(e => {
          console.error(e);
          this.positionCity = "未知城市";
        });
    },
    /**
     * 请求地理位置信息授权
     */
    authorizeLoaction() {
      return new Promise((resolve, reject) => {
        wx.getSetting({
          success(res) {
            if (!res.authSetting["scope.userLocation"]) {
              wx.authorize({
                scope: "scope.userLocation",
                success: () => {
                  resolve();
                },
                fail: e => {
                  reject(e);
                }
              });
            } else {
              resolve();
            }
          },
          fail(e) {
            reject(e);
          }
        });
      });
    },
    //气泡
    // fiexPop() {
    //   wx.navigateTo({
    //     url: "/pages/service/doubleTwelve/main"
    //   });
    // },
    // closeSignPop() {
    //   this.showSignPop = false;
    // },
    // goSign() {
    //   this.showSignPop = false;
    //   wx.navigateTo({
    //     url: "/pages/service/sign/main"
    //   });
    // },
    //积步领红包
    goAccu() {
      wx.navigateTo({
        url: "/pages/active/accumulation/main"
      });
    },
    // goSweep() {
    //   wx.navigateTo({
    //     url: "/pages/active/sweeping/main"
    //   });
    // },
    submitInfo(e) {
      console.log(e);
      this.showSignPop = false;
      wx.navigateTo({
        url: "/pages/service/sign/main?backShow=false"
      });
      let url = path.clickSign;
      let formId = e.mp.detail.formId;
      console.log(formId);
      let loginInfo = getLoginInfo();
      let queryData = {
        userId: loginInfo.userid,
        formId: formId
      };
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          console.log(data);
        })
        .catch(e => {
          apiFail(e);
        });
      return promise;
    },
    backHome() {
      wx.switchTab({
        url: "/pages/home/main"
      });
    },
    //领取新人礼包
    openPackage() {
      //绑定手机号
      if (!isBindPhone()) {
        if (this.goBindPhonePage) {
          this.goBindPhonePage = false;
          wx.switchTab({
            url: "/pages/home/main"
          });
        } else {
          this.goBindPhonePage = true;
          wx.navigateTo({
            url: "/pages/login/bindPhone/main"
          });
        }
        return;
      }
      this.vbNewUser = false;
      this.isShowBargainWrapper = false;
      let url = path.openPackage;
      let queryData = {
        userId: getLoginInfo().userid
        //userId: "7dac24c95e7c4d829002537f5192b5b6"
      };
      let promises = this.$fly.post(url, queryData);
      promises
        .then(data => {
          wx.showModal({
            title: `恭喜您`,
            content: `领取${data.vcoinAmount}V币成功！`,
            success(res) {
              if (res.confirm) {
                console.log("用户点击确定");
                wx.navigateTo({
                  url: "/pages/service/vb/main"
                });
              } else if (res.cancel) {
                console.log("用户点击取消");
              }
            }
          });
        })
        .catch(e => {
          apiFail(e);
        });
    },
    //获取手机号
    getPhoneNumber(e) {
      wx.login({
        //获取code 使用wx.login得到的登陆凭证，用于换取openid
        success: res => {
          if (res.code) {
            // console.log("code:" + res.code);
            // console.log("errMsg:" + e.mp.detail.errMsg);
            // console.log("iv:" + e.mp.detail.iv);
            // console.log("encryptedData:" + e.mp.detail.encryptedData);
            //用户是否同意授权
            if (e.mp.detail.encryptedData == undefined) {
              //不同意...(自己去绑定)
              this.goBindPhonePage = true;
              let url = "/pages/login/bindPhone/main";
              wx.navigateTo({ url });
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
                  //console.log("电话：", phoneData.phoneNumber);
                  wx.setStorageSync("phone", phoneData.phoneNumber);
                  //将微信绑定的手机号推送给后台保存
                  this.wxPhoneNum(phoneData.phoneNumber);
                })
                .catch(e => {
                  apiFail(e);
                });
            }
          }
        },
        fail: res => {
          console.log(res);
        }
      });
    },
    wxPhoneNum(phoneNumber) {
      let url = path.updateUserMobile;
      let queryData = {
        mobile: phoneNumber,
        userId: getLoginInfo().userid
      };
      let promise = this.$fly.get(url, queryData);
      promise
        .then(data => {
          console.log("成功接收手机号：");
        })
        .catch(e => {
          apiFail(e);
        });
      return promise;
    },
    //获取二手车标签
    getLabels() {
      let url = path.getLabels;
      let queryData = {};
      let promise = this.$fly.get(url, queryData);
      promise
        .then(data => {
          this.labels = data;
        })
        .catch(e => {
          apiFail(e);
        });
      return promise;
    },
    //特殊二手车页
    goSpecialCar(labelId, labelName) {
      wx.navigateTo({
        url: `/pages/specialCar/main?labelId=${labelId}&labelName=${labelName}`
      });
    }
  }
};
</script>

<style lang="scss" scoped>
$jbColorTop: rgba(255, 224, 86, 1);
$jbColorBottom: #ffcc00;
.container {
  position: relative;
  overflow: hidden;
  background-color: #f2f3f5;
  height: 100%;
  .loading {
    position: absolute;
  }
  .searchBox {
    width: 690rpx;
    position: fixed;
    height: 90rpx;
    left: 30rpx;
    top: 375rpx;
    border-radius: 10rpx;
    z-index: 1000;
    //padding: 0 30rpx 0 30rpx;
    display: flex;
    background: #fff;
    box-shadow: 0rpx 4rpx 18rpx 0rpx rgba(0, 0, 0, 0.07);
    // border: 1rpx solid #000;
    .city {
      width: 75px;
      margin: auto;
      p {
        color: #000;
        font-size: 30rpx;
        height: 0.9rem;
        line-height: 0.9rem;
        float: left;
        margin-left: 30rpx;
      }
      img {
        display: inline-block;
        margin-left: 0.1rem;
        margin-top: 0.4rem;
        width: 0.14rem;
        height: 0.12rem;
        line-height: 0.12rem;
        //background: url("../../../static/icon/triangle.png") no-repeat center/100%;
      }
    }
    .search {
      //display: inline-block;
      flex: 1;
      width: 480rpx;
      height: 0.64rem;
      position: relative;
      // margin-left: 0.2rem;
      padding-right: 0.6rem;
      margin: auto 30rpx;
      //border: 1rpx solid #000;
      img {
        position: absolute;
        left: 40px;
        top: 9px;
        width: 16px;
        height: 16px;
        line-height: 0.64rem;
      }
      input {
        background: white;
        //border-radius: 0.32rem;
        color: #fff;
        font-size: 0.3rem;
        padding-left: 127rpx;
        height: 0.64rem;
        line-height: 0.64rem;
        text-align: left;
        border-left: 1rpx solid #eee;
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
  //滚动时搜索框样式改变
  .changeSearchCss {
    // padding:0.15rem 0.3rem 0.06rem 0.3rem;
    //padding-top: 0.11rem;
    width: 100%;
    height: 0.88rem;
    box-sizing: border-box;
    background: #fff;
    border-radius: 0rpx;
    top: 0;
    left: 0;
    // padding-top: 0.5rem !important;
    border-bottom: 1px solid #eee;
    .city {
      p {
        color: #333;
      }
    }
    .search {
      i {
        background: url("../../../static/icon/searchChange.png") no-repeat
          center/100%;
      }
      input {
        border-radius: 0.32rem;
        background: #ededed;
        color: #333;
        border: none;
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
  .slide {
    .swiper {
      height: 420rpx;
    }
    img {
      width: 100%;
      height: 420rpx;
    }
    button {
      padding: 0;
      background: none;
      color: #fff;
      border: none;
      text-align: left;
      border-radius: 0;
    }
    button:after {
      border: none;
      box-shadow: none;
    }
    button:before {
      border: none;
      box-shadow: none;
    }
  }
  //胶囊图
  .redBag {
    width: 100%;
    height: 140rpx;
    //padding-top: 50rpx;
    background-color: white;
    img {
      width: 690rpx;
      height: 140rpx;
      margin-left: 30rpx;
    }
  }
  .section-1 {
    width: 90%;
    border-radius: 26rpx;
    padding: 30rpx;
    padding-top: 20rpx;
    box-sizing: border-box;
    position: relative;
    // z-index: 3333;
    margin: 0 auto;
    margin-top: -30rpx;
    background-color: white;
    height: 125px;
    .title {
      font-size: 36rpx;
      color: #000;
      font-weight: 700;
      line-height: 60rpx;
    }
    .limit-max {
      color: #999;
      font-size: 26rpx;
      margin-top: 27rpx;
    }
    .value {
      color: #000;
      font-size: 57rpx;
      font-weight: 700;
      line-height: 78rpx;
    }
    a {
      position: absolute;
      right: 31rpx;
      bottom: 38rpx;
      width: 87px;
      height: 62rpx;
      display: inline-block;
      background: linear-gradient(
        -90deg,
        rgba(255, 103, 92, 1),
        rgba(255, 118, 92, 1)
      );
      border-radius: 31rpx;
      font-size: 30rpx;
      font-weight: 700;
      color: rgba(255, 255, 255, 1);
      line-height: 62rpx;
      text-align: center;
    }
  }
  .section-2 {
    background-color: #ffffff;
    .sign-title {
      width: 100%;
      padding: 0 0.3rem;
      box-sizing: border-box;
      height: 0.8rem;
      line-height: 0.8rem;
      position: relative;
      background: rgba(255, 251, 236, 1);
      .icon {
        width: 0.3rem;
        height: 0.3rem;
        position: absolute;
        left: 0.3rem;
        top: 50%;
        transform: translateY(-50%);
      }
      p {
        font-size: 0.28rem;
        color: #000;
        line-height: 0.8rem;
        height: 0.8rem;
        padding-left: 0.48rem;
      }
      margin-bottom: 0.3rem;
      overflow: hidden;
    }
    .section-1 {
      width: 90%;
      border-radius: 26rpx;
      padding: 30rpx;
      padding-top: 20rpx;
      box-sizing: border-box;
      position: relative;
      margin: 0 auto;
      background: -webkit-linear-gradient(top, $jbColorTop, $jbColorBottom);
      height: 125px;
      .title {
        font-size: 36rpx;
        color: #000;
        font-weight: 700;
        line-height: 60rpx;
        margin-left: -30rpx;
        margin-top: -38rpx;
      }
      .limit-max {
        color: #000;
        font-size: 26rpx;
        margin-top: 27rpx;
      }
      .value {
        color: #000;
        font-size: 57rpx;
        font-weight: 700;
        line-height: 78rpx;
        margin-left: -10rpx;
      }
      a {
        position: absolute;
        right: 31rpx;
        bottom: 38rpx;
        width: 87px;
        height: 62rpx;
        display: inline-block;
        background: #fff;
        border-radius: 31rpx;
        font-size: 30rpx;
        font-weight: 700;
        color: #000;
        line-height: 62rpx;
        text-align: center;
      }
    }
    .redBag {
      width: 100%;
      margin-top: 50rpx;
      img {
        width: 690rpx;
        height: 140rpx;
        margin: 0 auto;
      }
    }
    .title {
      font-size: 44rpx;
      font-weight: 700;
      color: #010101;
      line-height: 128rpx;
      padding-left: 30rpx;
      padding-top: 40rpx;
    }
    //车辆品牌
    ul {
      width: 100%;
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      padding-bottom: 50rpx;
      //padding: 0 32rpx 32rpx 32rpx;
      li {
        display: inline-block;
        width: 160rpx;
        height: 48rpx;
        margin-top: 50rpx;
        //margin-bottom: 50rpx;
        img {
          display: inline-block;
          width: 44rpx;
          height: 44rpx;
          margin-left: 10rpx;
          margin-bottom: 5rpx;
        }
        p {
          height: 48rpx;
          width: 76rpx;
          padding-left: 10rpx;
          display: inline-block;
          text-align: center;
          font-size: 28rpx;
          line-height: 48rpx;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  .section-3 {
    background-color: #ffffff;
    height: 550rpx;
    .title {
      font-size: 44rpx;
      font-weight: 700;
      color: #010101;
      line-height: 128rpx;
      margin-top: 12px;
      margin-left: 30rpx;
    }
    .scroll-view {
      white-space: nowrap;
      padding: 0 20rpx;
      .tab1 {
        width: 25px;
        height: 32px;
        position: absolute;
        margin-left: 19px;
      }
      .item {
        display: inline-block;
        width: 280rpx;
        height: 300rpx;
        .desc {
          padding-left: 20rpx;
          padding-top: 12px;
          font-size: 24rpx;
          .value {
            font-size: 32rpx;
          }
          p:nth-child(1) {
            color: #000;
            font-size: 26rpx;
            font-weight: 700;
            line-height: 48rpx;
            white-space: nowrap;
            overflow: hidden;
          }
          p:nth-child(2) {
            color: #fc3425;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 24rpx;
            overflow: hidden;
            white-space: nowrap;
            width: 260rpx;
          }
          p:nth-child(3) {
            color: #999999;
            font-size: 24rpx;
            margin-bottom: 20px;
          }
        }
        img {
          width: 288rpx;
          height: 232rpx;
        }
      }
    }
  }
  .familyCar {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    background: #fff;
    padding-top: 20rpx;
    padding-bottom: 30rpx;
    padding-left: 20rpx;
    padding-right: 20rpx;
    .items {
      height: 180rpx;
      width: 345rpx;
      margin-top: 10rpx;
      background-repeat: no-repeat;
      background-size: 180rpx 335rpx;
      padding-top: 5rpx;
      h1 {
        line-height: 50rpx;
        font-size: 30rpx;
        margin-left: 20rpx;
        margin-top: 10rpx;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
      p {
        line-height: 30rpx;
        font-size: 20rpx;
        margin-left: 20rpx;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
      }
    }
    .wan {
      background: url("http://bqyx-qiniu.bqrzzl.com/pic_wanyuan@2x.png")
        no-repeat center / 100% 100%;
    }
    .zhun {
      background: url("http://bqyx-qiniu.bqrzzl.com/pic_zhunxinche@2x.png")
        no-repeat center / 100% 100%;
    }
    .ru {
      background: url("http://bqyx-qiniu.bqrzzl.com/pic_rumen@2x.png") no-repeat
        center / 100% 100%;
    }
    .xian {
      background: url("http://bqyx-qiniu.bqrzzl.com/pic_xiangshi@2x.png")
        no-repeat center / 100% 100%;
    }
  }
  .section-4 {
    padding-top: 30rpx;
    background-color: #ffffff;
    padding-bottom: 20rpx;
    .productImg {
      height: 180rpx;
      width: 702rpx;
      padding: 0 24rpx 0 24rpx;
    }
    .section-5 {
      padding: 0 24rpx 0 24rpx;
      background-color: #ffffff;
      height: 100%;
      white-space: nowrap;
      margin-top: 25px;
      .title {
        font-size: 44rpx;
        font-weight: 700;
        color: #010101;
        line-height: 128rpx;
        margin-top: 25px;
      }
      .item {
        display: inline-block;
        width: 240rpx;
        position: relative;
        .p1 {
          width: 56rpx;
          height: 56rpx;
          top: -15rpx;
          left: 9rpx;
          position: absolute;
          z-index: 9;
          font-size: 20rpx;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          line-height: 24rpx;
          text-align: center;
          white-space: pre-wrap;
        }
        .tab1 {
          width: 70rpx;
          height: 70rpx;
          top: -25rpx;
          position: absolute;
        }
        .tab2 {
          width: 216rpx;
          height: 216rpx;
          //border: 1px solid rgba(213, 212, 212, 1);
          border-radius: 6px 7px 7px 7px;
        }
        .desc {
          padding-top: 12rpx;
          font-size: 24rpx;
          bottom: 40rpx;
          .value {
            font-size: 32rpx;
          }
          // p:nth-child(1) {
          //   color: #000;
          //   font-size: 26rpx;
          //   font-weight: 700;
          //   line-height: 48rpx;
          //   white-space: nowrap;
          //   overflow: hidden;
          //   text-overflow: ellipsis;
          // }
          p:nth-child(1) {
            color: #fc3425;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 24rpx;
            overflow: hidden;
            white-space: nowrap;
            font-weight: bold;
            width: 260rpx;
          }
          p:nth-child(2) {
            color: #999999;
            font-size: 24rpx;
            line-height: 50rpx;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 170rpx;
          }
        }
      }
    }
  }
  .putRedBag {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    overflow: hidden;
    z-index: 100;
    .put_close {
      position: fixed;
      width: 48rpx;
      height: 48rpx;
      z-index: 103;
      margin-left: 351rpx;
      bottom: 8%;
    }
    .div_redBag {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .light {
        width: 100%;
        height: 100%;
        z-index: 101;
      }
      .putRedBag_put {
        position: absolute;
        height: 650rpx;
        z-index: 102;
      }
    }
  }
  .putRedBagL {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    overflow: hidden;
    z-index: 100;
    .put_closes {
      position: fixed;
      width: 24px;
      height: 24px;
      z-index: 200;
      bottom: 8%;
      margin-left: 351rpx;
    }
    .div_redBagL {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      .light {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 101;
      }
      .putRedBags {
        position: absolute;
        height: 650rpx;
        z-index: 102;
      }
    }
    .putRedBagWord {
      position: fixed;
      width: 100%;
      height: 100%;
      z-index: 103;
      bottom: 0;
      .title {
        width: 50%;
        margin-left: auto;
        margin-right: auto;
        text-align: center;
      }
      .p_title {
        color: #d7a75c;
        font-weight: bold;
        font-size: 40px;
        margin-top: 60%;
      }
      .p_title1 {
        color: #61605f;
        font-size: 8px;
      }
      .p_title2 {
        color: #ffe5b3;
        font-size: 12px;
        margin-top: 22%;
      }
      .p_title3 {
        color: #ffffff;
        font-size: 12px;
        margin-top: 14px;
      }
      .is-huawei {
        margin-top: 50%;
      }
      .is-oppo {
        margin-top: 75%;
      }
    }
  }
  .fiexPop {
    position: fixed;
    z-index: 99999;
    width: 174rpx;
    height: 153rpx;
    right: 10rpx;
    bottom: 50rpx;
    img {
      width: 174rpx;
      height: 153rpx;
    }
  }
  .newYearPopBg {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 9999999999999;
    .titleBox {
      width: 5.03rem;
      height: 6.24rem;
      position: absolute;
      background: url("http://bqyx-qiniu.bqrzzl.com/newyear/newYearPop.png")
        repeat-y top;
      background-size: 100% 100%;
      top: 50%;
      left: 50%;
      -webkit-transform: translate(-50%, -50%);
      .closeIcon {
        width: 0.48rem;
        height: 0.48rem;
        position: absolute;
        top: -0.7rem;
        right: -0.3rem;
      }
    }
  }
  .formSubmit {
    button {
      padding: 0;
      background: none;
      color: #fff;
      border: none;
      text-align: left;
    }
    button:after {
      border: none;
      box-shadow: none;
    }
    button:before {
      border: none;
      box-shadow: none;
    }
  }
  //跳转功能按钮
  .quick {
    width: 100%;
    display: flex;
    justify-content: space-around;
    div {
      width: 0.84rem;
      height: 1.2rem;
      align-items: center;
      img {
        width: 100%;
        height: 0.84rem;
      }
      p {
        font-size: 0.22rem;
        line-height: 0.22rem;
        width: 0.89rem;
        height: 0.22rem;
        text-align: center;
      }
    }
    .priceRange {
      width: 140rpx;
      height: 48rpx;
      background: rgba(239, 242, 246, 1);
      border-radius: 6rpx;
      p {
        width: 100%;
        text-align: center;
        line-height: 48rpx;
        font-size: 28rpx;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
    }
  }
  //分割线
  .line {
    width: 690rpx;
    height: 2rpx;
    background: rgba(238, 242, 246, 1);
    margin: 0 auto;
  }
  .new-year {
    width: 100%;
    overflow: hidden;
    margin-top: 0.4rem;
    img {
      width: 6.9rem;
      height: 1.5rem;
      margin: 0 auto;
      display: block;
    }
  }
  .section-6 {
    margin-top: 50rpx;
    .title {
      height: 100rpx;
      width: 220rpx;
      margin: 0 auto;
      position: relative;
      img {
        width: 44rpx;
        height: 44rpx;
        position: absolute;
        top: 5rpx;
      }
      span {
        position: absolute;
        left: 65rpx;
        font-size: 36rpx;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(0, 0, 0, 1);
        letter-spacing: 1rpx;
      }
    }
    .carMain {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-bottom: 50rpx;
      div {
        width: 372rpx;
        height: 500rpx;
        font-family: PingFangSC-Medium;
        border: 1rpx solid #f2f3f5;
        background: #fff;
        margin-top: 1rpx;
        img {
          height: 279rpx;
          width: 100%;
        }
        h1 {
          height: 40rpx;
          margin: 0rpx 20rpx 22rpx 20rpx;
          font-size: 32rpx;
          font-weight: 500;
          line-height: 36rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          line-clamp: 2;
        }
        p {
          margin-left: 20rpx;
          margin-top: 18rpx;
          font-size: 22rpx;
          font-weight: 400;
          line-height: 28rpx;
          color: rgba(102, 102, 102, 1);
          overflow: hidden;
          text-overflow: ellipsis;
          line-clamp: 2;
        }
        h2 {
          margin-top: 40rpx;
          margin-left: 20rpx;
          display: inline-block;
          font-size: 24rpx;
          font-weight: 500;
          color: rgba(252, 52, 37, 1);
          span {
            font-size: 40rpx;
            line-height: 45rpx;
          }
        }
        h3 {
          margin-top: 30rpx;
          margin-left: 15rpx;
          display: inline-block;
          font-size: 24rpx;
          font-weight: 400;
          color: rgba(141, 142, 153, 1);
          line-height: 48rpx;
        }
      }
    }
  }
  //弹窗
  .active-bargain-wrapper {
    display: none;
    position: absolute;
    width: 375px;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    &.show {
      display: block;
    }
    .img {
      display: block;
      margin: 0 auto;
      margin-top: 60px;
      width: 280px;
      height: 280px * 1.24;
    }
    .icon {
      &.clear {
        display: block;
        margin: 0 auto;
        width: 32px;
        height: 32px;
        margin-top: 12px;
      }
    }
  }
}
</style>