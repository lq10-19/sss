<template>
  <div class="bigbox">
    <div v-if="!applySuccess">
      <!--轮播图-->
      <div class="header">
        <swiper
          :indicator-dots="false"
          class="swiper"
          :autoplay="true"
          :interval="3000"
          :duration="500"
        >
          <swiper-item v-for="(item,index) in imgData" :key="index">
            <img class="swipeImg" :src="item.url">
          </swiper-item>
        </swiper>
      </div>

      <div class="body">
        <div>
          车主姓名:
          <input
            type="text"
            v-model="name"
            placeholder="请输入投保人姓名"
            placeholder-style="font-size: 26rpx"
          >
        </div>
        <!-- <div>投保城市:<input type="text" v-model="address" placeholder="请输入投保城市(例：广东深圳)" @blur="submit" placeholder-style="font-size: 26rpx"></div> -->
        <div class="city">
          投保城市:
          <picker
            mode="multiSelector"
            @change="MultiPickerChange"
            @columnchange="MultiPickerColumnChange"
            :value="multiIndex"
            :range="multiArray"
            @cancel="cancel2"
            class="cityName"
          >
            <div class="picker" @click="changeIcon2">
              {{address?address:multiArray[0][multiIndex[0]]+multiArray[1][multiIndex[1]]}}
              <span :animation="animationData2"></span>
            </div>
          </picker>
        </div>
        <div>
          联系电话:
          <input
            type="number"
            v-model="phone"
            placeholder="请输入投保人手机号码"
            placeholder-style="font-size: 26rpx"
          >
        </div>
        <div>
          车牌号码:
          <picker
            @change="bindPickerChange"
            :value="index"
            :range="shortName"
            class="shortName"
            @cancel="cancel"
          >
            <div @click="changeIcon">
              {{province?province:shortName[index]}}
              <span :animation="animationData"></span>
            </div>
          </picker>
          <input
            type="text"
            class="carNum"
            v-model="carNumber"
            placeholder="请输入车牌号码"
            placeholder-style="font-size: 26rpx"
          >
        </div>

        <div class="radio-box">
          <div>险种:</div>
          <radio-group class="radio-group" @change="radioChange">
            <label class="radio" v-for="(item, i) in items" :key="i">
              <radio :value="item.name" :checked="item.checked" @tap="radio"/>
              {{item.value}}
            </label>
          </radio-group>
        </div>
      </div>

      <button @click="submission">提交</button>

      <!-- 蒙版弹窗 -->
      <div v-if="applyFail" class="mark" :style="{height:height+'px',width:width+'px'}">
        <div class="boxs">
          <h1>您已经提交过车险需求,请耐心等待。</h1>
          <button @click="closeMark">确定</button>
        </div>
      </div>
    </div>
    <!-- 申请成功 -->
    <div class="success_box" v-if="applySuccess">
      <div class="tips_box">
        <div>
          <img src="../../../static/img/add_success.png">
        </div>
        <p class="info">提交成功!</p>
        <p class="info2">工作人员会在3个工作日内电话联系您，请耐心等待。</p>
        <button class="btn" @click="goHome">确定</button>
      </div>
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
import { cityList } from "@/utils/djcx/city";
import { constants } from "zlib";
import { debug } from "util";
export default {
  components: {},
  data() {
    return {
      applyFail: false, //控制弹窗
      applySuccess: false, //控制页面
      height: "", //屏幕高度
      width: "", //屏幕宽度
      imgData: [{ url: "http://bqyx-qiniu.bqrzzl.com/djcxbanner.png" }],
      index: 0, //简称序号
      multiIndex: [0, 0],
      multiArray: [
        [
          "北京",
          "安徽",
          "福建",
          "甘肃",
          "广东",
          "广西",
          "贵州",
          "海南",
          "河北",
          "河南",
          "黑龙江",
          "湖北",
          "湖南",
          "吉林",
          "江苏",
          "江西",
          "辽宁",
          "内蒙古",
          "宁夏",
          "青海",
          "山东",
          "山西",
          "陕西",
          "上海",
          "四川",
          "天津",
          "西藏",
          "新疆",
          "云南",
          "浙江",
          "重庆",
          "香港",
          "澳门",
          "台湾"
        ],
        ["北京"]
      ],
      objectMultiArray: cityList.objectMultiArray,
      shortName: [
        "京",
        "津",
        "沪",
        "渝",
        "冀",
        "豫",
        "黑",
        "蒙",
        "辽",
        "吉",
        "新",
        "云",
        "藏",
        "陕",
        "粤",
        "桂",
        "苏",
        "赣",
        "闽",
        "浙",
        "皖",
        "鲁",
        "晋",
        "湘",
        "鄂",
        "甘",
        "宁",
        "贵",
        "川",
        "琼",
        "青",
        "台"
      ], //省简称
      name: null,
      address: "北京",
      phone: null,
      carNumber: null,
      province: null,
      animationData: {}, //动画
      animationData2: {}, //动画
      items: [
        { name: "1", value: "车损+三者+盗抢+座位", checked: true },
        { name: "2", value: "车损+三者", checked: false },
        { name: "3", value: "三者+座位", checked: false },
        { name: "4", value: "三者", checked: false },
        { name: "5", value: "其他险种", checked: false }
      ],
      insure: 1 //险种序号
    };
  },
  onLoad(query) {
    const value = wx.getStorageSync("systemInfo");
    this.height = value.windowHeight;
    this.width = value.windowWidth;
    console.log(this.objectMultiArray, 1111);
  },
  onShow() {
    if (!getLoginInfo()) {
      wx.switchTab({
        url: "/pages/home/main"
      });
      return;
    }
    if (!isBindPhone()) {
      wx.navigateTo({
        url: "/pages/login/bindPhone/main"
      });
      return;
    }
    const animation = wx.createAnimation({
      duration: 100,
      timingFunction: "ease"
    });
    this.animation = animation;
    this.animationData = animation.export();
    this.animationData2 = animation.export();
    this.applySuccess = false;
    this.applyFail = false;
  },
  onShareAppMessage() {
    return {
      title: "佰仟易行",
      path: "/pages/service/service/main",
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    };
  },
  methods: {
    //城市选择
    MultiPickerChange(e) {
      (this.multiIndex[0] = e.mp.detail.value[0]),
        (this.multiIndex[1] = e.mp.detail.value[1]);
      this.address =
        this.multiArray[0][e.mp.detail.value[0]] +
        this.multiArray[1][e.mp.detail.value[1]];
      //console.log(e.mp.detail.value[0], e.mp.detail.value[1]);
      if (
        this.multiArray[0][e.mp.detail.value[0]] ==
        this.multiArray[1][e.mp.detail.value[1]]
      ) {
        this.address = this.multiArray[0][e.mp.detail.value[0]];
      }
      console.log("市：" + this.address);
      this.submit();
      this.animation.rotate(0).step();
      this.animationData2 = this.animation.export();
    },
    MultiPickerColumnChange(e) {
      if (e.mp.detail.column === 0) {
        let list = [];
        for (var i = 0; i < this.objectMultiArray.length; i++) {
          if (
            this.objectMultiArray[i].parid ==
            this.objectMultiArray[e.mp.detail.value].regid
          ) {
            list.push(this.objectMultiArray[i].regname);
          }
        }
        this.multiArray.splice(1, 1);
        this.multiArray.push(list);
        this.multiIndex[0] = e.mp.detail.value;
        this.multiIndex[1] = 0;
      }
    },
    // 单选
    // radio(e) {
    //   let items = this.items;
    //    for (let i = 0; i < items.length; i++) {
    //      if (items[i].name == this.insure) {
    //        for (let j = 0; j < items.length; j++) {
    //          if (items[j].checked && j != i) {
    //            items[j].checked = false;
    //          }
    //        }
    //        items[i].checked = !items[i].checked;
    //      }
    //    }
    //   this.items = items;
    // },
    //输入城市调取简称
    submit() {
      let url = path.cayCityChek;
      let queryData = {
        cityName: this.address
      };
      let promises = this.$fly.post(url, queryData);
      promises
        .then(data => {
          this.province = data.provinceprefix;
          console.log(this.province);
        })
        .catch(e => {
          wx.showToast({
            title: "抱歉主人,未能识别您的城市,请您手动选择车牌前缀~",
            icon: "none",
            duration: 3000
          });
        });
    },
    //选择险种
    radioChange(e) {
      console.log("险种：" + e.mp.detail.value);
      this.insure = e.mp.detail.value;
      let items = this.items;
      for (let i = 0; i < items.length; i++) {
        items[i].checked = false;
        if (items[i].name == e.mp.detail.value) {
          items[i].checked = true;
        }
      }
      this.items = items;
    },
    // 获取用户选择城市
    // bindCityChange (e) {
    //   this.cityIndex = e.target.value;
    //   this.city = this.cityName[this.cityIndex];
    // },
    //获取用户选择省简称
    bindPickerChange(e) {
      this.index = e.target.value;
      this.province = this.shortName[this.index];
      console.log("省：" + this.province);
      this.animation.rotate(0).step();
      this.animationData = this.animation.export();
    },
    changeIcon() {
      //this.down = true;
      this.animation.rotate(180).step();
      this.animationData = this.animation.export();
    },
    changeIcon2() {
      //this.down = true;
      this.animation.rotate(180).step();
      this.animationData2 = this.animation.export();
    },
    //小箭头动画
    cancel(e) {
      this.animation.rotate(0).step();
      this.animationData = this.animation.export();
    },
    cancel2(e) {
      this.animation.rotate(0).step();
      this.animationData2 = this.animation.export();
    },
    //提交
    submission() {
      if (this.name == null) {
        wx.showToast({
          title: "您还未输入姓名",
          icon: "none"
        });
      } else if (this.phone == null) {
        wx.showToast({
          title: "您还未输入电话",
          icon: "none"
        });
      } else if (/^1\d{10}$/.test(this.phone) == false) {
        wx.showToast({
          title: "您输入的电话号码有误",
          icon: "none"
        });
      } else if (this.address == null) {
        wx.showToast({
          title: "您还未输入详细地址",
          icon: "none"
        });
      } else if (this.province == null) {
        wx.showToast({
          title: "您还未选择省份",
          icon: "none"
        });
      } else if (this.carNumber == null) {
        wx.showToast({
          title: "您还未输入车牌号",
          icon: "none"
        });
      } else if (
        /^(([A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/.test(
          this.carNumber
        ) == false
      ) {
        wx.showToast({
          title: "您输入的车牌号有误",
          icon: "none"
        });
      } else if (this.insure == null) {
        wx.showToast({
          title: "您还未选择险种",
          icon: "none"
        });
      } else {
        let url = path.insertCarInsurance;
        let queryData = {
          carOwnerName: this.name,
          insureCity: this.address,
          mobile: this.phone,
          carNumber: this.province + this.carNumber,
          insuranceType: this.insure,
          userId: getLoginInfo().userid
        };
        let promises = this.$fly.post(url, queryData);
        promises
          .then(data => {
            console.log("提交成功");
            this.applySuccess = true;
            //完成留资任务
            if (this.$root.$mp.query.taskId) {
              let queryData = {
                userId: getLoginInfo().userid,
                taskId: this.$root.$mp.query.taskId
              };
              let promises = this.$fly.post(path.getTaskReward, queryData);
              promises
                .then(data => {
                  console.log("留资");
                })
                .catch(e => {
                  apiFail(e);
                });
            }
          })
          .catch(e => {
            if (e.data.code == 410) {
              console.log("重复提交");
              this.applyFail = true;
            } else {
              apiFail(e);
            }
          });
      }
    },
    //关闭弹窗
    closeMark() {
      this.applyFail = false;
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

<style lang="scss" scoped>
.bigbox {
  background: #ffffff;
  width: 100%;
}
.swiper {
  min-height: 290rpx;
}
.swipeImg {
  width: 100%;
  height: 290rpx;
}
.body {
  width: 80%;
  margin: 50rpx auto;
  div {
    height: 76rpx;
    font-size: 32rpx;
    line-height: 56rpx;
    font-weight: 400;
    input {
      position: relative;
      top: 18rpx;
      width: 420rpx;
      margin-left: 10rpx;
      border: 1rpx solid rgba(221, 221, 221, 1);
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      height: 56rpx;
      padding-left: 10rpx;
    }
    .shortName {
      position: relative;
      top: 0rpx;
      border: 1rpx solid rgba(221, 221, 221, 1);
      display: inline-block;
      height: 56rpx;
      width: 130rpx;
      margin-left: 10rpx;
      div {
        line-height: 56rpx;
        margin-left: 30rpx;
        span {
          width: 20rpx;
          height: 17rpx;
          display: inline-block;
          background-image: url("../../../static/icon/triangleChange.png");
          background-repeat: no-repeat;
          background-size: 100% 100%;
          margin-top: 10rpx;
          margin-left: 30rpx;
        }
      }
    }
    .carNum {
      width: 273rpx;
      margin-left: 15rpx;
    }
  }
  .city {
    line-height: 95rpx;
    .cityName {
      position: relative;
      top: 0rpx;
      border: 1rpx solid rgba(221, 221, 221, 1);
      display: inline-block;
      height: 56rpx;
      width: 430rpx;
      margin-left: 10rpx;
      div {
        line-height: 56rpx;
        margin-left: 10rpx;
        width: 100%;
        span {
          position: absolute;
          right: 10rpx;
          top: 20rpx;
          width: 20rpx;
          height: 17rpx;
          display: inline-block;
          background-image: url("../../../static/icon/triangleChange.png");
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
      }
    }
  }
  .radio-box {
    width: 585rpx;
    height: 315rpx;
    margin-top: 40rpx;
    border: 1rpx solid rgba(221, 221, 221, 1);
    div {
      width: 100rpx;
      margin-left: 40rpx;
      margin-top: 10rpx;
    }
    .radio-group {
      font-size: 28rpx;
      position: relative;
      top: -80rpx;
      left: 150rpx;
      label {
        display: block;
        height: 60rpx;
      }
    }
  }
}
button {
  width: 77%;
  background: linear-gradient(
    180deg,
    rgba(254, 235, 167, 1),
    rgba(255, 204, 0, 1)
  );
  font-size: 36rpx;
  border-radius: 40px;
  margin-bottom: 12rpx;
  font-weight: 500;
  border: none;
}
.mark {
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;

  .boxs {
    position: relative;
    top: 30%;
    left: 97.5rpx;
    z-index: 999;
    width: 560rpx;
    height: 356rpx;
    background: rgba(255, 255, 255, 1);
    border-radius: 12rpx;
    font-weight: 400;
    h1 {
      text-align: center;
      font-size: 32rpx;
      height: 146rpx;
      width: 336rpx;
      margin: 0 auto;
      padding-top: 60rpx;
      line-height: 56rpx;
    }
    button {
      width: 77%;
      background: linear-gradient(
        180deg,
        rgba(254, 235, 167, 1),
        rgba(255, 204, 0, 1)
      );
      font-size: 36rpx;
      border-radius: 40px;
      margin-bottom: 12rpx;
      font-weight: 500;
      border: none;
    }
  }
}
.success_box {
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: white;
  .tips_box {
    margin: auto;
    margin-top: 100rpx;
    width: 90%;
    text-align: center;
    .btn {
      width: 80%;
      height: 0.9rem;
      background: linear-gradient(
        180deg,
        rgba(254, 235, 167, 1),
        rgba(255, 204, 0, 1)
      );
      border-radius: 45px;
      color: #000;
      margin-top: 80rpx;
      border: none;
    }
    .btn:after {
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
    .info2 {
      color: rgba(102, 102, 102, 1);
      font-size: 28rpx;
    }
  }
}
.placeholder {
  font-size: 10rpx;
}
/*  重写 radio 样式  */
/* 未选中的 背景样式 */
radio {
  border-radius: 50%; /* 圆角 */
  transform: scale(0.8); /* 缩放 */
}
/* 选中后的 背景样式 （红色背景 无边框 可根据UI需求自己修改） */
// radio .wx-radio-input.wx-radio-input-checked{
//    border: none;
//    background: red;
//    width: 40rpx;
//    height: 40rpx;
// }
/* 选中后的 对勾样式 （白色对勾 可根据UI需求自己修改） */
// radio .wx-radio-input.wx-radio-input-checked::before{
//    border-radius: 50%;/* 圆角 */
//    width: 40rpx; /* 选中后对勾大小，不要超过背景的尺寸 */
//    height: 40rpx; /* 选中后对勾大小，不要超过背景的尺寸 */
//    line-height: 40rpx;
//    text-align: center;
//    font-size:30rpx; /* 对勾大小 30rpx */
//    color:#000; /* 对勾颜色 白色 */
//    background: transparent;
//    transform:translate(-50%, -50%) scale(1);
//    -webkit-transform:translate(-50%, -50%) scale(1);
// }
</style>
