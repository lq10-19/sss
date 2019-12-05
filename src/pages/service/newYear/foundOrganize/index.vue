<template>
  <div class="main">
    <img class="flower" src="http://bqyx-qiniu.bqrzzl.com/newyear/flower.png" />
    <div class="zs-left zs"></div>
    <div class="zs-right zs"></div>
    <div class="content" :style="{'min-height': windowHeight+'rpx'}">
      <div class="form" v-if="state == 0">
        <p class="title">组织名称:</p>
        <input class="input" v-model="name" placeholder="限12个字以内的中英文、数字" />
        <p class="warn-text">团名称一经创建，不能修改</p>
        <div class="btn-wrap">
          <div class="comfirm-btn" @click="bindComfirm">确定</div>
        </div>
      </div>
      <div class="fish-form" v-if="state == 1">
        <p class="title">组织名称:<span>{{name}}</span></p>
        <button class="btn-wrap" open-type="share">
          <div class="comfirm-btn">去邀请好友加入组织</div>
        </button>
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
      state: 0,
      name: '',
      groupMainId: ''
    };
  },
  onLoad(options) {
    this.state = 0;
    this.name = '';
  },
  onShow() {
    //this.state = 0;
    //this.name = '';
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
    let loginInfo = getLoginInfo();
    let userid = loginInfo.userid;
    let nickname = loginInfo.nickname;
    let groupMainId = this.groupMainId;
    this.goEnjoy = false;
    return {
      title: newYearShareTitle[num],
      imageUrl: 'http://bqyx-qiniu.bqrzzl.com/newyear/newYearBanner2.jpg',
      path: `/pages/service/newYear/singleOrganize/main?nickname=`+nickname+"&groupMainId="+groupMainId+"&userId="+userid
    };
  },
  methods: {
    gofoundOrganize(){
      wx.navigateTo({
        url: "/pages/service/newYear/foundOrganize/main"
      });
    },
    bindComfirm(){
      var checkUser = this.checkUsername();
      var strlen = this.getLength(this.name);
      if(checkUser!=false){
        if(strlen <=24){
          let url = path.groupMainSave;
          let loginInfo = getLoginInfo();
          let queryData = {
            "groupName": this.name,
            "groupType": "1",
            "groupCreateId": loginInfo.userid
          };
          let promise = this.$fly.post(url, queryData);
          promise
            .then(data => {
              console.log(data);
              if(data!=null){
                let url = path.saveGroupUserInfo;
                let loginInfo = getLoginInfo();
                this.groupMainId = data.groupMainId;
                let queryData = [{
                  "groupMainId": data.groupMainId,
                  "userId": loginInfo.userid,
                  "userType": "1",
                  "userStatus": "1"
                }];
                let promises = this.$fly.post(url, queryData);
                promises
                  .then(data => {
                    console.log(data);
                    this.state = 1;
                  })
                  .catch(e => {
                    apiFail(e);
                  });
                return promises;
              }
            })
            .catch(e => {
              apiFail(e);
            });
          return promise;
        }else{
          wx.showToast({
            title: "组织名称长度不得超过12个字",
            icon: "none"
          });
          return false;
        }
      }
      
    },
    checkUsername(){
      //正则表达式
      var reg = new RegExp("^[A-Za-z0-9\u4e00-\u9fa5]+$");
      //判断输入框中有内容
      if(!reg.test(this.name)) {
        wx.showToast({
          title: "组织名称不规范",
          icon: "none"
        });
        return false;
      }
    },
    getLength(str){
      var realLength = 0, len = str.length, charCode = -1;
      for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
      }
      return realLength;
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
      overflow: hidden;
      background: url('http://bqyx-qiniu.bqrzzl.com/newyear/bg.png') repeat-y top;
      background-size: 100% 7.5rem;
      border-radius: 0.06rem;
      .btn-wrap{
        padding: 0 0.55rem;
        margin-top: 0.67rem;
        overflow: hidden;
        background: none;
        .comfirm-btn{
          width: 5.8rem;
          height: 0.86rem;
          line-height: 0.86rem;
          text-align: center;
          font-weight: bold;
          font-size: 0.3rem;
          background: url('http://bqyx-qiniu.bqrzzl.com/newyear/btn3@2x.png') no-repeat;
          background-size: 5.8rem 0.86rem;
          color: #D22A2A;
        }
      }
      .form{
        width: 100%;
        overflow: hidden;
        margin-top: 1.49rem;
        .title{
          font-size: 0.36rem;
          color: #000;
          font-weight: bold;
          padding: 0 1.05rem;
        }
        .input{
          margin: 0 1.05rem;
          height: 0.67rem;
          line-height: 0.67rem;
          background: #fff;
          border-radius: 0.08rem;
          font-size: 0.24rem;
          padding: 0 0.17rem;
          box-sizing: border-box;
          margin-top: 0.2rem;
          margin-bottom: 0.2rem;
        }
        .warn-text{
          font-size: 0.24rem;
          color: #D22A2A;
          padding: 0 1.05rem;
        }
      }
      .btn-wrap::after{
        border: none;
      }
      .fish-form{
        width: 100%;
        overflow: hidden;
        margin-top: 1.49rem;
        .title{
          width: 100%;
          text-align: center;
          font-size: 0.36rem;
          font-weight: bold;
          span{
            font-size: 0.36rem;
            color: #D22A2A;
            margin-left: 0.34rem;
            font-weight: 400;
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
