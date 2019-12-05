<template>
  <div class="main">
    <img class="flower" src="http://bqyx-qiniu.bqrzzl.com/newyear/flower.png" />
    <div class="zs-left zs"></div>
    <div class="zs-right zs"></div>
    <div class="content" :style="{'min-height': windowHeight+'rpx'}">
      <div class="title-box">
        <p>答谢成功！</p>
      </div>
      <div class="block" v-if="followPublic == false">
        <p class="desc">关注公众号，及时获取拜年组团、红包等消息。</p>
        <div class="form">
          <button open-type="contact" show-message-card="true" send-message-img="http://bqyx-qiniu.bqrzzl.com/newyear/newYearBanner2.jpg" class="btn">关注公众号</button>
          <p class="tips">点击按钮后请如下图操作 识别二维码关注公众号</p>
          <img class="step-ani" src="http://bqyx-qiniu.bqrzzl.com/newyear/stepani.gif" />
        </div>
      </div>
      <div class="btn-wrap" v-if="followPublic == true">
        <div class="grouplist-btn btn" @click="goActiveHome">去拜年主页看看</div>
      </div>
    </div>
    <div class="footer">
      <image class="img" mode="widthFix" src="http://bqyx-qiniu.bqrzzl.com/newyear/footer-bg.png"></image>
    </div>
  </div>
</template>
<script>
import { path, getLoginInfo, getSystemInfo, apiFail } from "@/utils/index";
import { setTimeout } from 'timers';
export default {
  components: {},
  data() {
    return {
      windowHeight: '',
      followPublic : true
    };
  },
  onLoad(options) {
    
  },
  onShow() {
    this.subscribe();
  },
  onReady() {
    let that = this;
    wx.getSystemInfo({
      success({windowHeight}) {
        that.windowHeight = windowHeight * 2 -60;
      }
    });
  },
  onShareAppMessage(params) {
    var newYearShareTitle = [
      '来组团拜年吧，新年一起旺旺旺！',
      '不是好友也能给他拜年？不信戳我',
      '创意拜年新方式，一起组队忒好玩！',
      '金猪贺岁，组队拜年领红包！',
      '新年红包大派送，猪年好运连连来',
      '迎新春、贺新年，组个团队来拜年',
      '2019好彩头 拜年就能领红包',
      '新春开门红 贺岁红包一起领',
      '咚咚锵 咚咚锵 红包来了 开！',
      '猪年行大运  红包拿不停',
      '你有一个新年红包  快拆开',
      '一大波组队拜年消息袭来，赶紧去试试吧'
    ];
    console.log(newYearShareTitle);
    var num=Math.floor(Math.random()*12);
    console.log(num)
    return {
      title: newYearShareTitle[num],
      imageUrl: 'http://bqyx-qiniu.bqrzzl.com/newyear/newYearBanner2.jpg',
      path: `/pages/service/newYear/main`
    };
  },
  methods: {
    subscribe(){
      var sceneVal = wx.getStorageSync("sceneVal");
      console.log(sceneVal);
      let loginInfo = getLoginInfo();
      console.log(loginInfo);
      let url = path.subscribe;
      var unionid = loginInfo.unionid
      let queryData = {
        "unionid": unionid
      };
      let promises = this.$fly.post(url, queryData);
      promises
        .then(data => {
          console.log('是否关注公众号');
          console.log(data);
          if(data.data[unionid] == 1){
            this.followPublic = true;
            console.log('yes关注公众号')
          }else{
            console.log('no关注公众号')
            this.followPublic = false;
          }
        })
        .catch(e => {
          apiFail(e);
        });
      return promises;
    },
    goActiveHome(){
      wx.redirectTo({
        url: "/pages/service/newYear/main"
      })
    }
  }
};
</script>

<style lang="scss" scoped>
  .main{
    width: 100%;
    min-height: 100%;
    background: #D22A2A;
    overflow: hidden;
    position: relative;
    .content{
      margin: 0.3rem;
      box-sizing: border-box;
      background: url('http://bqyx-qiniu.bqrzzl.com/newyear/bg.png') repeat-y top;
      background-size: 100% 7.5rem;
      border-radius: 0.06rem;
      padding-bottom: 2rem;
      .title-box{
        width: 100%;
        text-align: center;
        overflow: hidden;
        padding-top: 0.88rem;
        margin-bottom: 0.4rem;
        p{
          font-size: 0.5rem;
          color: #D22A2A;
        }
      }
      .desc{
        width: 100%;
        overflow: hidden;
        font-size: 0.3rem;
        color: #000;
        text-align: center;
        font-weight: bold;
        margin-bottom: 0.21rem;
      }
      .form{
        overflow: hidden;
        margin: 0 0.65rem;
        border-radius: 0.2rem;
        background: #fff;
        box-sizing: border-box;
        padding: 0.25rem 0.5rem;
        .btn{
          width: 4.5rem;
          height: 0.86rem;
          line-height: 0.86rem;
          text-align: center;
          font-weight: bold;
          font-size: 0.3rem;
          background: url('http://bqyx-qiniu.bqrzzl.com/newyear/btn6.png') no-repeat;
          background-size: 4.5rem 0.86rem;
          color: #D22A2A;
          margin: 0 auto;
          border: none;
          padding: 0;
        }
        .btn::after{
          border: none;
        }
        .tips{
          width: 3rem;
          margin: 0 auto;
          font-size: 0.26rem;
          color: #000;
          text-align: center;
          margin-top: 0.17rem;
          margin-bottom: 0.22rem;
        }
        .step-ani{
          width: 4.6rem;
          height: 5.5rem;
          margin: 0 auto;
        }
      }
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
      .grouplist-btn{
        background: url('http://bqyx-qiniu.bqrzzl.com/newyear/btn3@2x.png') repeat-y top;
        background-size: 5.8rem 0.86rem;
        font-size: 0.3rem;
        color: #D22A2A;
        text-align: center;
        line-height: 0.86rem;
        font-weight: bold;
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
