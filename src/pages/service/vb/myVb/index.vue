<template>
  <div class="bigbox">
    <!--头部-->
    <div class="header">
      <div class="rule" @click="goRule">
        <img src="../../../../../static/img/bangzhu.png">
        <span>什么是V币？</span>
      </div>
      <h1>当前可用V币</h1>
      <p>{{vbNum}}</p>
    </div>
    <!-- 赚V币 -->
    <div>
      <button class="btn" plain @click="goVbHome">赚V币</button>
    </div>
    <!-- 明细 -->
    <div class="module-other">
      <p class="title">————  V币明细  ————</p>
      <ul>
        <li v-for="(item,i) in detailed" :key="i">
          <div class="left">
            <h1>{{item.operationName}}</h1>
            <p>
              <span>V币余额：{{item.balance}}</span>
            </p>
          </div>
          <div class="right">
            <!-- <h1 v-if="item.amount>0">+{{item.amount}}</h1>
            <h1 v-if="item.amount<=0">{{item.amount}}</h1> -->
            <h1>{{item.amount>0?'+'+item.amount:item.amount}}</h1>
            <p>{{item.createDate}}</p>
          </div>
        </li>
      </ul>  
    </div>  
  </div>
</template>

<script>
import utils from "@/utils/index";
import {
  path,
  dataConfig,
  getUserInfo,
  getLoginInfo,
  showLoading,
  isBindPhone,
  event
} from "@/utils/index";
export default {
  data() {
    return {
      vbNum: 0, //用户V币数量
      detailed:[], //V币明细表
      newsDataList: [], //翻页明细
      //是否去过绑定手机号页面
      goBindPhonePage: false,
      pageIndex: 1,
    };
  },
  onLoad() {
    //授权登陆
    if (!getLoginInfo()) {
      const url = "/pages/login/main";
      wx.navigateTo({
        url
      });
      return;
    }
  },
  onShow() {
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
      return
    };
    //数据初始化
    this.detailed = [];
    this.newsDataList = [];
    this.pageNo = 1; //页数
    //获取V币余额
    this.queryBalance();
    //查询V币明细
    this.queryVcoinDetail();
  },
  onShareAppMessage(res) {
    this.choose = false;
    return {
      title: "【佰仟易行】佰仟行，伴你行！",
      path: `/pages/service/vb/main`,
      imageUrl: "http://bqyx-qiniu.bqrzzl.com/VB@2x.png",
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  methods: {
    //获取V币余额
    queryBalance() {
      let url = path.queryBalance;
      let queryData = {
        userId: getLoginInfo().userid
      }
      let promises = this.$fly.post(url, queryData);
      promises.then(data => {
        this.vbNum = data.vcoinBalance;
      })
      .catch(e => {
        apiFail(e);
      });
    },
    //查询V币明细
    queryVcoinDetail() {
      let url = path.queryVcoinDetail;
      let queryData = {
        userId: getLoginInfo().userid,
        pageNo: this.pageNo,
        pageSize: 10 
      }
      let promises = this.$fly.post(url, queryData);
      showLoading(promises);
      promises.then(data => {
        if (data.length > 0) {
          this.newsDataList = data;
          this.detailed = this.detailed.concat(this.newsDataList);
        }
      })
      .catch(e => {
        apiFail(e);
      });
    },
    goRule() {
      const url = "/pages/service/vb/rule/main";
      wx.navigateTo({ url });
    },
    goVbHome() {
      const url = "/pages/service/vb/main";
      wx.navigateTo({ url });
    },
  },
  //上拉触底
  onReachBottom() {
    this.pageNo = this.pageNo + 1;
    this.queryVcoinDetail();
  }
};
</script>

<style lang="scss" scoped>
.bigbox {
  height: 100%;
}
.header {
  width: 100%;
  height: 335rpx;
  background-image: url('http://bqyx-qiniu.bqrzzl.com/banner1@2x.png');
  background-size: 100% 100%;
  font-family: PingFangSC-Medium;
  font-weight: 400;
  text-align: center;
  .rule{
    text-align: right;
    margin-right: 20rpx;
    line-height: 50rpx;
    img{
      width: 24rpx;
      height: 24rpx;
      position: relative;
      top: 4rpx;
      left: -7rpx;
    }
    span{
      font-size: 22rpx;
    }
  }
  h1{
    font-size: 30rpx;
    line-height: 80rpx
  }
  p{
    font-size: 60rpx;
    font-weight: 500;
  }
}
.btn{
  border: none;
  width: 580rpx;
  height: 88rpx;
  background:linear-gradient(176deg,rgba(254,235,167,1),rgba(255,204,0,1));
  border-radius: 44rpx;
  font-size: 36rpx;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  margin-top: 53rpx;
}
.module-other {
  overflow: hidden;
  font-weight: 400;
  margin-top: 50rpx;
  p{
    font-weight: 400;
    font-size: 30rpx;
    color: rgba(102, 102, 102, 1);
    text-align: center;
  }
  ul{
    width: 100%;
    margin: 0rpx auto;
    margin-top: 55rpx;
    margin-bottom: 30rpx;
    li{
      border-bottom: 1rpx solid rgba(238,238,238,1);
      display: flex;
      justify-content: space-between;
      margin-top: 25rpx;
      padding-bottom: 30rpx;
      div{
        font-weight: 400;
        h1{
          font-size: 32rpx;
          line-height: 64rpx;
        }
        p{
          font-size: 28rpx;
          color: rgba(153, 153, 153, 1);
        }
      }
      .left{
        margin-left: 30rpx;
        p{
          text-align: left;
        }
      }
      .right{
        margin-right: 30rpx;
        h1{
          color: rgba(255, 92, 93, 1);
          text-align: right;
        }
      }
      button{
        margin-right: 0rpx;
        font-size: 26rpx;
        min-width: 144rpx;
        height: 56rpx;
        line-height: 56rpx;
        background:linear-gradient(176deg,rgba(254,235,167,1),rgba(255,204,0,1));
        border-radius: 28rpx;
      }
    }
  }
}
</style>
