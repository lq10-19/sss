<template>
  <div class="bigbox">
    <div class="header">
      <div @click="goBack" class="header_left">
        <p></p>
      </div>
      <div class="header_center">
        <p>设置</p>
      </div>
      <div class="header_right">
        <p></p>
      </div>
    </div>

    <div class="userset-box">
      <ul>
        <li>
          <div class="set-logo" @click="editHead">
            <p class="list-title">头像</p>
            <p class="user-logo">
              <img :src="headPhoto?headPhoto:personalInfo.avatarurl">
            </p>
          </div>
        </li>
        <li>
          <div class="set-list" @click="editNick">
            <p class="list-title">昵称</p>
            <p class="list-icon">
              <img class="img" src="/static/img/right_arrow.png" alt>
            </p>
            <p class="list-value">{{nickName!=''?nickName:personalInfo.nickname}}</p>
          </div>
        </li>
        <li>
          <div class="set-list" @click="editSex">
            <p class="list-title">性别</p>
            <p class="list-icon">
              <img class="img" src="/static/img/right_arrow.png" alt>
            </p>
            <p class="list-value" v-if="sex">{{sex}}</p>
            <p class="list-value" v-else>{{personalInfo.sex==1?'男':'女'}}</p>
          </div>
        </li>
        <li>
          <picker
            mode="multiSelector"
            @change="MultiPickerChange"
            @columnchange="MultiPickerColumnChange"
            :value="multiIndex"
            :range="multiArray"
            class="cityName"
          >
            <div class="set-list">
              <p class="list-title">地区</p>
              <p class="list-icon">
                <img class="img" src="/static/img/right_arrow.png" alt>
              </p>
              <p class="list-value">{{address?address:(personalInfo.province+personalInfo.city)}}</p>
              <!-- <p class="list-value">{{address?address:multiArray[0][multiIndex[0]]+multiArray[1][multiIndex[1]]}}</p> -->
            </div>
          </picker>
        </li>
        <li>
          <div class="set-list" v-if="!phone">
            <p class="list-title">手机号</p>
            <p class="list-icon">
              <img class="img" src="/static/img/right_arrow.png" alt>
            </p>
            <button open-type="getPhoneNumber" plain @getphonenumber="getPhoneNumber">点击绑定手机号</button>
          </div>
          <div class="set-list" v-if='phone' @click="editPhone">
            <p class="list-title">手机号</p>
            <p class="list-icon">
              <img class="img" src="/static/img/right_arrow.png" alt>
            </p>
            <p class="list-value">{{phone}}</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="userset-box">
      <ul>
        <!-- <li>
          <div class="set-list">
            <p class="list-title">清除缓存</p>
            <p class="list-icon"></p>
            <p class="list-value">{{current}}KB</p>
          </div>
        </li> -->
        <li>
          <div class="set-list" @click="goAbout">
            <p class="list-title">关于佰仟易行</p>
            <p class="list-icon">
              <img class="img" src="/static/img/right_arrow.png" alt>
            </p>
            <p class="list-value"></p>
          </div>
        </li>
        <li @click="toTest">
          <div class="set-list">
            <p class="list-title">当前版本</p>
            <p class="list-icon">
              <!-- <img class="img" src="/static/img/right_arrow.png" alt=""> -->
            </p>
            <p class="list-value">V{{version}}</p>
          </div>
        </li>
      </ul>
    </div>
    <!-- 蒙版弹窗(修改昵称) -->
    <div v-if="inputNickName" class="mark" :style="{height:height+'px',width:width+'px'}" catchtouchmove="ture">
      <div class="boxs">
        <h1>请输入昵称</h1>
        <p>起个好听的名字，让好友更容易找到你！</p>
        <input type="text" v-model="newNickName" maxlength='8'>
        <div>
          <span @click="closeMark">取消</span>
          <div>|</div>
          <span @click="successNickName">确定</span>
        </div>
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
  event,
  link 
} from "@/utils/index";
import { cityList } from "@/utils/djcx/city";
export default {
  components: {},

  data() {
    return {
      height: "", //屏幕高度
      width: "", //屏幕宽度
      version: dataConfig.version, //版本号
      personalInfo: {}, //授权资料
      testCount: 0,
      current: 0, //缓存
      headPhoto: "", //头像
      nickName: "", //昵称
      newNickName: null, //修改的昵称
      sex: "", //性别
      province: null, //省
      city: null, //市
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
      address: "",
      phone: "", //手机号
      inputNickName: false, //修改昵称弹窗
    };
  },
  onLoad() {
    this.personalInfo = getLoginInfo();
    console.log(this.personalInfo, 888);
    const value = wx.getStorageSync("systemInfo");
    this.height = value.screenHeight;
    this.width = value.windowWidth;
  },
  onShow() {
    this.inputNickName = false;
    //获取缓存信息
    const res = wx.getStorageInfoSync();
    //console.log(res.currentSize)
    this.current = res.currentSize;
    //获取用户信息
    this.getInfo();
  },
  methods: {
    //获取用户信息
    getInfo() {
      let url = path.getInfo;
      let queryData = {
        userId: getLoginInfo().userid
      };
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          //console.log(data,101)
          this.nickName = data.nickname;
          if(data.sex == 1){
            this.sex = "男";
          }else{
            this.sex = "女";
          };
          if(data.province == data.city){
            this.address = data.city;
          }else{
            this.address = data.province + data.city;
          };
          this.phone = data.mobile;
          this.headPhoto = data.avatarUrl;
        })
        .catch(e => {
          apiFail(e);
        });
    },
    //修改用户信息
    updateBaseInfo(queryData) {
      let url = path.updateBaseInfo;
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          //console.log(data,202)
        })
        .catch(e => {
          apiFail(e);
        });
      return promise;  
    },
    //关于
    goAbout() {
      const url = "../about/main";
      wx.navigateTo({ url });
    },
    //修改头像
    editHead() {
      wx.navigateTo({
        url: '/pages/user/setting/setHead/main'
      })
    },
    //修改昵称
    editNick() {
      this.inputNickName = true;
    },
    //确定修改
    successNickName() {
      this.inputNickName = false;
      let queryData = {
        userId: getLoginInfo().userid,
        nickname: this.newNickName
      };
      let promise = this.updateBaseInfo(queryData);
      promise
        .then(data => {
          if(this.newNickName){
            this.nickName = data.nickname;
            wx.showToast({
              title: "昵称修改成功",
              icon: "success"
            });
          }else{
            wx.showToast({
              title: "您还没有输入新昵称",
              icon: "none"
            });
          }
        })
        .catch(e => {
          apiFail(e);
        });
    },
    //关闭修改昵称弹窗
    closeMark() {
      this.inputNickName = false;
    },
    //修改性别
    editSex() {
      wx.showActionSheet({
        itemList: ['男', '女'],
        success:(res)=>{
          if(res.tapIndex == 0){
            let queryData = {
              userId: getLoginInfo().userid,
              sex: 1
            };
            let promise = this.updateBaseInfo(queryData);
            promise
              .then(data => {
                this.sex = '男';
                wx.showToast({
                  title: "性别修改成功",
                  icon: "success"
                });
              })
              .catch(e => {
                apiFail(e);
              }); 
          }else if(res.tapIndex == 1){
            let queryData = {
              userId: getLoginInfo().userid,
              sex: 2
            };
            let promise = this.updateBaseInfo(queryData);
            promise
              .then(data => {
                this.sex = '女';
                wx.showToast({
                  title: "性别修改成功",
                  icon: "success"
                });
              })
              .catch(e => {
                apiFail(e);
              }); 
          }
        },
        fail(res) {
          console.log(res.errMsg)
        }
      })
    },
    //城市选择
    MultiPickerChange(e) {
      (this.multiIndex[0] = e.mp.detail.value[0]),
      (this.multiIndex[1] = e.mp.detail.value[1]);
      let queryData = {
        userId: getLoginInfo().userid,
        province: this.multiArray[0][e.mp.detail.value[0]],
        city: this.multiArray[1][e.mp.detail.value[1]]
      };
      let promise = this.updateBaseInfo(queryData);
      promise
        .then(data => {
          wx.showToast({
            title: "地区修改成功",
            icon: "success"
          });
          if(data.province == data.city){
            this.address = data.city;
          }else{
            this.address = data.province + data.city;
          }
          //console.log("市：" + this.address);
        })
        .catch(e => {
          apiFail(e);
        });
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
        fail: res =>{
          console.log(res)
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
        .then(data =>{
          console.log("成功接收手机号：")
          //重新获取用户信息
          this.getInfo()
        })
        .catch(e =>{
          apiFail(e);
        });
      return promise;  
    },
    //跳转验证手机号
    editPhone() {
      wx.navigateTo({
        url: `/pages/login/checkPhone/main?phone=${this.phone}`
      })
    },
    toTest() {
      ++this.testCount;
      if (this.testCount >= 3) {
        let userId = getLoginInfo().userid;
        let url = `/pages/user/cddApply/main`;
        //console.log(url);
        wx.reLaunch({
          url: url
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.bigbox {
  position: fixed;
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
      // background: url("../../../static/images/backBtn2.png") no-repeat
      //   center/100%;
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
      font-family: PingFangSC-Medium;
      color: rgba(0, 0, 0, 1);
    }
  }
  .header_right {
    width: 1rem;
    height: 100%;
    float: right;
    margin-right: 0.3rem;
    p {
      height: 0.8rem;
      font-size: 0.36rem;
      text-align: center;
      line-height: 0.8rem;
    }
  }
}

.userset-box {
  width: 100%;
  background: #fff;
  margin-top: 0.3rem;
  ul {
    li {
      .set-logo {
        height: 1.2rem;
        border-bottom: 0.01rem solid rgba(153, 153, 153, 0.1);
        .list-title {
          display: inline-block;
          float: left;
          height: 1.2rem;
          margin-left: 0.3rem;
          line-height: 1.2rem;
          font-size: 0.32rem;
          font-weight: 400;
          color: rgba(0, 0, 0, 1);
        }
        .user-logo {
          display: inline-block;
          width: 0.88rem;
          height: 0.88rem;
          float: right;
          margin: 0.16rem 0;
          margin-right: 0.3rem;
          img {
            display: block;
            border-radius: 1.2rem;
            width: 0.88rem;
            height: 0.88rem;
          }
        }
      }

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
          color: rgba(0, 0, 0, 1);
        }
        .list-icon {
          float: right;
          margin-right: 0.3rem;
          margin-top: 0.2rem;
          width: 0.12rem;
          height: 0.22rem;
          .img {
            width: 0.12rem;
            height: 0.22rem;
          }
          // background: url("../../../static/images/right_arrow.png") no-repeat
          //   center/100%;
        }
        .list-value {
          display: inline-block;
          float: right;
          font-size: 0.28rem;
          color: rgba(153, 153, 153, 1);
          margin-right: 0.4rem;
          margin-top: 0.3rem;
        }
        button{
          display: inline-block;
          float: right;
          font-size: 0.28rem;
          color: rgba(153, 153, 153, 1);
          margin-top: 0.15rem;
          border: none;
          padding-right: 0.36rem;
        }
        .user-logo {
          display: inline-block;
          width: 0.88rem;
          height: 0.88rem;
          float: right;
          margin: 0.06rem 0;
          background: red;
          margin-right: 0.3rem;
        }
      }
    }
  }
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
      height: 40rpx;
      width: 336rpx;
      margin: 0 auto;
      padding-top: 40rpx;
      padding-bottom: 20rpx;
      line-height: 40rpx;
    }
    p{
      font-size: 24rpx;
      color: #d8d2d2;
      text-align: center;
      margin: 15rpx auto;
    }
    input{
      border: 1rpx solid #f2f3f5;
      background: #f2f3f5;
      border-radius: 10rpx;
      width: 450rpx;
      margin: 0 auto;
      margin-bottom: 40rpx;
      padding-left: 20rpx;
      font-size: 32rpx;
      height: 60rpx;
      line-height: 60rpx;
    }
    div{
      width: 544rpx;
      margin: 0 auto;
      span {
        display: inline-block;
        width: 270rpx;
        font-size: 36rpx;
        margin: 0 auto;
        text-align: center;
        margin-bottom: 12rpx;
        font-weight: 500;
        border-top: 1rpx solid #f2f3f5;
        line-height: 90rpx;
      }
      div{
        width: 1rpx;
        display: inline-block;
        color: #f2f3f5;
        border-top: 1rpx solid #f2f3f5;
        line-height: 90rpx;
      }
    }
  }
}
</style>
