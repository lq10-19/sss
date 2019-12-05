<template>
  <div class="main">
    <img class="flower" src="http://bqyx-qiniu.bqrzzl.com/newyear/flower.png" />
    <div class="zs-left zs"></div>
    <div class="zs-right zs"></div>
    <div class="content" :style="{'min-height': windowHeight+'rpx'}">
      <p class="title">获得红包总额</p>
      <p class="moneny">{{sumRedPacket}}元</p>
      <div class="btn-wrap">
        <div class="tx-btn btn disable" v-if="sumRedPacket <=0">去提现</div>
        <div class="tx-btn btn" v-else @click="goWallet">去提现</div>
      </div>
      <div class="x-title-box">
        <div class="txt">
          <div class="line l-line"></div>
          红包明细
          <div class="line r-line"></div>
        </div>
      </div>
      <div class="null-wrap" v-if="dataShow == false">
        <div class="null-tips">
          <p>当前还没有收到过红包，</p>
          <p>赶紧去拜年讨红包吧！</p>
        </div>
        <div class="btn-wrap">
          <div class="grouplist-btn btn" @click="goMyOrganize">去组团拜年</div>
        </div>
      </div>
      <div class="list-wrap" v-if="dataShow == true">
        <ul>
          <li v-for="(item,index) in dataList" :key="index">
            <div class="lin">
              <p class="form-name">{{item.fromNickname}}打赏的红包</p>
              <p class="num">+{{item.redPackage}}</p>
            </div>
            <div class="lin">
              <p class="balance"></p>
              <p class="time">{{item.modifyTime}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="footer">
      <image class="img" mode="widthFix" src="http://bqyx-qiniu.bqrzzl.com/newyear/footer-bg.png"></image>
    </div>
  </div>
</template>
<script>
import { path, getLoginInfo, getSystemInfo, apiFail ,formatDate } from "@/utils/index";
import { setTimeout } from 'timers';
export default {
  components: {},
  data() {
    return {
      windowHeight: '',
      dataShow: true,
      dataList: '',
      sumRedPacket: '0.00'
    };
  },
  onLoad(options) {
    
  },
  onReady() {
    let that = this;
    wx.getSystemInfo({
      success({windowHeight}) {
        that.windowHeight = windowHeight * 2 -60;
      }
    });
  },
  onShow() {
    this.getRedPacketDetail();
    this.getSumRedPacket();
  },
  methods: {
    getRedPacketDetail(){
      let loginInfo = getLoginInfo();
      let url = path.getRedPacketDetail+'/'+loginInfo.userid;
      let queryData = {
        
      };
      let promises = this.$fly.get(url, queryData);
      promises
        .then(data => {
          console.log(data);
          this.dataList = data;
          console.log(this.dataList.length)
          if(this.dataList.length == 0){
            this.dataShow = false;
          }else{
            this.dataShow = true;
            for(var i=0;i<data.length;i++){
              data[i].modifyTime = formatDate(data[i].modifyTime);
            }
          }
        })
        .catch(e => {
          apiFail(e);
        });
      return promises;
    },
    goMyOrganize(){
      wx.navigateTo({
        url: "/pages/service/newYear/myOrganize/main"
      });
    },
    getSumRedPacket(){
      let loginInfo = getLoginInfo();
      let url = path.getSumRedPacket+'/'+loginInfo.userid;
      let queryData = {
        
      };
      let promises = this.$fly.get(url, queryData);
      promises
        .then(data => {
          console.log(data);
          this.sumRedPacket = this.returnFloat(data);
        })
        .catch(e => {
          apiFail(e);
        });
      return promises;
    },
    returnFloat(value){
      var value=Math.round(parseFloat(value)*100)/100;
      var xsd=value.toString().split(".");
      if(xsd.length==1){
      value=value.toString()+".00";
      return value;
      }
      if(xsd.length>1){
      if(xsd[1].length<2){
      value=value.toString()+"0";
      }
      return value;
      }
    },
    goWallet(){
      wx.navigateTo({
        url: "/pages/user/wallet/main"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  .main{
    width: 100%;
    min-height: 100%;
    height: 100%;
    background: #D22A2A;
    overflow: hidden;
    position: relative;
    .content{
      margin: 0.3rem;
      overflow: hidden;
      background: url('http://bqyx-qiniu.bqrzzl.com/newyear/bg.png') repeat-y top;
      background-size: 100% 7.5rem;
      border-radius: 0.06rem;
      .title{
        width: 100%;
        text-align: center;
        font-size: 0.26rem;
        color: #000;
        font-weight: bold;
        margin-top: 0.97rem;
      }
      .moneny{
        font-size: 0.6rem;
        color: #D22A2A;
        margin-top: 0.4rem;
        font-weight: bold;
        margin-bottom: 0.46rem;
        width: 100%;
        text-align: center;
      }
      .btn-wrap{
        .btn{
          width: 5.8rem;
          height: 0.86rem;
          margin: 0 auto;
        }
        .tx-btn{
          background: url('http://bqyx-qiniu.bqrzzl.com/newyear/btn3@2x.png') repeat-y top;
          background-size: 5.8rem 0.86rem;
          font-size: 0.3rem;
          color: #D22A2A;
          text-align: center;
          line-height: 0.86rem;
          font-weight: bold;
        }
        .tx-btn.disable{
          background: url('http://bqyx-qiniu.bqrzzl.com/newyear/btn5.png') repeat-y top;
          background-size: 5.8rem 0.86rem;
          font-size: 0.3rem;
          color: #D2D2D2;
          text-align: center;
          line-height: 0.86rem;
          font-weight: bold;
        }
      }
      .x-title-box{
        width: 100%;
        text-align: center;
        position: relative;
        margin-top: 0.8rem;
        overflow: hidden;
        margin-bottom: 0.47rem;
        .txt{
          position: relative;
          display:inline-block;
          font-size: 0.26rem;
        }
        .line{
          width: 0.75rem;
          height: 0.02rem;
          background: #000;
          position: absolute;
          top: 50%;
          -webkit-transform: translateY(-50%);
        }
        .l-line{
          left: -1rem;
        }
        .r-line{
          right: -1rem;
        }
      }
      .null-tips{
        width: 100%;
        overflow: hidden;
        text-align: center;
        margin-bottom: 0.5rem;
        p{
          font-size: 0.38rem;
          font-weight: bold;
          color: #D22A2A;
          margin-bottom: 0.22rem;
        }
      }
      .grouplist-btn{
        background: url('http://bqyx-qiniu.bqrzzl.com/newyear/btn3@2x.png') repeat-y top;
        background-size: 5.8rem 0.86rem;
        font-size: 0.3rem;
        color: #D22A2A;
        text-align: center;
        line-height: 0.86rem;
        font-weight: bold;
      }
      .list-wrap{
        width: 100%;
        padding: 0 0.41rem;
        box-sizing: border-box;
        padding-bottom: 1.5rem;
        li{
          width: 100%;
          overflow: hidden;
          border-bottom: 1px solid #ECA168;
          padding-bottom: 0.1rem;
          margin-bottom: 0.2rem;
          .lin{
            width: 100%;
            overflow: hidden;
            position: relative;
            display: -webkit-box;
            display: -webkit-flex;
            display: flex;
            -webkit-box-align: center;
            -webkit-align-items: center;
            align-items: center;
            margin-bottom: 0.15rem;
            .form-name{
              font-weight: bold;
              font-size: 0.3rem;
              color: #000;
              width: 75%;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
            .num{
              flex: 1;
              text-align: right;
              font-size: 0.29rem;
              color: #D22A2A;
              font-weight: bold;
            }
            .tx-num{
              color: #FF9C44;
            }
            .balance{
              font-size: 0.26rem;
              color: #666;
            }
            .time{
              flex: 1;
              text-align: right;
              font-size: 0.26rem;
              color: #666;
            }
          }
        }
      }
    }
    .flower{
      width: 3.78rem;
      height: 1.95rem;
      display: block;
      position: absolute;
      left: 0;
      top: 0;
    }
    .rule-text{
      padding: 0 0.3rem;
      font-size: 0.26rem;
      color: #000;
      margin-top: 1.77rem;
      line-height: 0.5rem;
      font-weight: bold;
    }
    .zs{
      width: 0.55rem;
      height: 100%;
      position: absolute;
      top: 3.5rem;
    }
    .zs-left{
      background: url('http://bqyx-qiniu.bqrzzl.com/newyear/zs-left.png') repeat-y top;
      background-size: 0.55rem 6.72rem;
      left: 0rem;
    }
    .zs-right{
      background: url('http://bqyx-qiniu.bqrzzl.com/newyear/zs-right.png') repeat-y top;
      background-size: 0.55rem 6.72rem;
      right: 0rem;
    }
    .pop-wrap{
      width: 100%;
      height: 100%;
      position: fixed;
      left: 0;
      top: 0;
      background: rgba(0,0,0,0.7);
      z-index: 999;
    }
    .pop-box{
      width: 4.74rem;
      height: 5.4rem;
      background: url('http://bqyx-qiniu.bqrzzl.com/newyear/pop-bg.png') repeat-y top;
      background-size: 4.74rem 5.4rem;
      left: 50%;
      top: 50%;
      -webkit-transform: translate(-50%,-50%);
      position: absolute;
      .msg{
        color: #FDC254;
        font-size: 0.36rem;
        width: 100%;
        text-align: center;
        font-weight: bold;
      }
      .dmsg{
        margin-top: 2.8rem;
      }
      .bbtn{
        width: 3.2rem;
        height: 0.76rem;
        line-height: 0.76rem;
        text-align: center;
        font-weight: bold;
        font-size: 0.3rem;
        background: url('http://bqyx-qiniu.bqrzzl.com/newyear/btn3@2x.png') no-repeat;
        background-size: 3.2rem 0.76rem;
        color: #D22A2A;
        position: absolute;
        bottom: 0.73rem;
        left: 50%;
        -webkit-transform: translateX(-50%);
      }
    }
    .footer{
      .img{
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
      }
    }
  }
</style>
