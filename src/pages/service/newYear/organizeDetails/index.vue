<template>
  <div class="main">
    <img class="flower" src="http://bqyx-qiniu.bqrzzl.com/newyear/flower.png">
    <div class="zs-left zs"></div>
    <div class="zs-right zs"></div>
    <div class="content" :style="{'min-height': windowHeight+'rpx'}">
      <p class="title" v-if="groupUsers[0]">{{groupUsers[0].groupName}}</p>
      <p class="mess-text">全体组织成员（{{groupUsers.length}}人）</p>
      <ul>

        <li class="list" v-for="(item,index) in groupUsers" :key="index" @click="payNewYearCall(item.groupMainId,item.userNickName,item.myself,item)">
          <img class="user" v-if="item.wechatHeadImgUrl!=null" :src="item.wechatHeadImgUrl" />
          <img class="user" v-else src="/static/img/sign/user.png" />
          <p class="name">{{item.userNickName}}</p>
          <div :class="(item.myself == 'true') || (item.isFollow !=1)?'btn disable':'btn'" v-if="pageStare == 'one'">向他拜年</div>
        </li>
        <button class="list" open-type="share" v-if="pageStare == 'one'">
          <img class="add" src="http://bqyx-qiniu.bqrzzl.com/newyear/add.png">
        </button>
      </ul>
    </div>
    <div class="pop-wrap" v-if="popShow == true">
      <div class="pop-box">
        <p class="msg dmsg">加入申请已经发送！</p>
        <div class="bbtn">确定</div>
      </div>
    </div>
    <div class="footer">
      <img class="img" mode="widthFix" src="http://bqyx-qiniu.bqrzzl.com/newyear/footer-bg.png">
    </div>
  </div>
</template>
<script>
import { path, getLoginInfo, getSystemInfo ,showLoading ,apiFail } from "@/utils/index";
import { setTimeout } from "timers";
export default {
  components: {},
  data() {
    return {
      windowHeight: "",
      popShow: false,
      groupUsers: [],
      pageStare: "one",
      groupMainId: ""
    };
  },
  onLoad(options) {
    this.groupMainId = options.groupMainId;
    this.pageStare = options.pageStare;
  },
  onReady() {
    let that = this;
    wx.getSystemInfo({
      success({ windowHeight }) {
        that.windowHeight = windowHeight * 2 - 60;
      }
    });
  },
  onShow() {
    this.groupUsers = '';
    this.getGroupUser();
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
    var num=Math.floor(Math.random()*12);
    if (this.pageStare == "one") {
      let loginInfo = getLoginInfo();
      let userid = loginInfo.userid;
      let nickname = loginInfo.nickname;
      this.goEnjoy = false;
      let groupMainId = this.groupMainId;
      if (!groupMainId) {
        wx.showToast({
          title: "无 groupMainId",
          icon: "none"
        });
        return;
      }
      return {
        title: "您的好友"+nickname+"给您拜年啦！",
        imageUrl: 'http://bqyx-qiniu.bqrzzl.com/newyear/newYearBanner1.jpg',
        path:
          `/pages/service/newYear/singleOrganize/main?nickname=` +
          nickname +
          "&groupMainId=" +
          groupMainId +
          "&userId=" +
          userid
      };
    } else {
      return {
        title: newYearShareTitle[num],
        imageUrl: 'http://bqyx-qiniu.bqrzzl.com/newyear/newYearBanner2.jpg',
        path: `/pages/service/newYear/main`
      };
    }
  },
  methods: {
    getGroupUser() {
      let url = path.getGroupUser;
      let loginInfo = getLoginInfo();
      let queryData = {
        groupMainId: this.groupMainId
      };
      let promises = this.$fly.get(url, queryData);
      showLoading(promises)
      promises
        .then(data => {
          console.log(data);
          for (var i = 0; i < data.length; i++) {
            if (data[i].userId == loginInfo.userid) {
              data[i].myself = "true";
            } else {
              data[i].myself = "false";
            }
          }
          this.groupUsers = data;
        })
        .catch(e => {
          apiFail(e);
        });
      return promises;
    },
    payNewYearCall(e,f,g,item){
      if(g == 'true'){
        wx.showToast({
          title: "不能给自己拜年哦~",
          icon: "none"
        });
        return false;
      }else if(item.isFollow != 1 && g == 'false'){
        wx.showToast({
          title: "此用户还未关注公众号",
          icon: "none"
        });
        return false;
      }
      if(g == 'false' && this.pageStare == 'one' && item.isFollow == 1){
        let loginInfo = getLoginInfo();
        let userid = loginInfo.userid;
        wx.removeStorageSync("passData");
        wx.removeStorageSync("allSelectedData");
        const url = "/pages/service/newYear/groupYear/main?userId="+item.userId+"&userNickName="+item.userNickName+"&groupMainId="+item.groupMainId+"&groupName="+item.groupName;
        wx.navigateTo({
          url: url,
          fail:(res)=>{
            wx.redirectTo({
              url: url
            });
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  min-height: 100%;
  height: 100%;
  background: #d22a2a;
  overflow: hidden;
  position: relative;
  .content {
    margin: 0.3rem;
    overflow: hidden;
    background: url("http://bqyx-qiniu.bqrzzl.com/newyear/bg.png") repeat-y top;
    background-size: 100% 7.5rem;
    border-radius: 0.06rem;
    .title {
      width: 100%;
      text-align: center;
      font-size: 0.36rem;
      color: #d22a2a;
      font-weight: bold;
      margin-top: 0.88rem;
    }
    .mess-text {
      font-size: 0.28rem;
      color: #d22a2a;
      padding: 0 0.27rem;
      margin-top: 0.5rem;
      font-weight: bold;
      margin-bottom: 0.59rem;
    }
    ul {
      margin-left: 0.4rem;
      overflow: hidden;
      padding-bottom: 1rem;
    }
    .list {
      width: 1.08rem;
      text-align: center;
      position: relative;
      margin-right: 0.2rem;
      float: left;
      margin-bottom: 0.5rem;
      border: none;
      background: none;
      padding: 0;
      .user {
        width: 0.88rem;
        height: 0.88rem;
        border-radius: 50%;
      }
      .name {
        width: 1.08rem;
        height: 0.38rem;
        line-height: 0.38rem;
        font-size: 0.24rem;
        color: #fff;
        font-weight: bold;
        border-radius: 0.19rem;
        background: #ffb644;
        position: absolute;
        left: 0;
        top: 0.69rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .btn {
        font-size: 0.2rem;
        color: #d22a2a;
        width: 1.08rem;
        height: 0.38rem;
        line-height: 0.38rem;
        position: relative;
        margin-top: 0.2rem;
      }
      .btn.disable {
        color: #999;
      }
      .btn:after {
        content: " ";
        width: 200%;
        height: 200%;
        position: absolute;
        top: 0;
        left: 0;
        border: 1px solid #f14b4b;
        -webkit-transform: scale(0.5);
        transform: scale(0.5);
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        box-sizing: border-box;
        border-radius: 19px;
      }
      .btn.disable:after {
        border-color: #999;
      }
      .add {
        width: 0.88rem;
        height: 0.88rem;
        margin-top: 0.13rem;
      }
    }
    .list:after {
      border: none;
    }
  }
  .flower {
    width: 3.78rem;
    height: 1.95rem;
    display: block;
    position: absolute;
    left: 0;
    top: 0;
  }
  .rule-text {
    padding: 0 0.3rem;
    font-size: 0.26rem;
    color: #000;
    margin-top: 1.77rem;
    line-height: 0.5rem;
    font-weight: bold;
  }
  .zs {
    width: 0.55rem;
    height: 100%;
    position: absolute;
    top: 3.5rem;
  }
  .zs-left {
    background: url("http://bqyx-qiniu.bqrzzl.com/newyear/zs-left.png") repeat-y
      top;
    background-size: 0.55rem 6.72rem;
    left: 0rem;
  }
  .zs-right {
    background: url("http://bqyx-qiniu.bqrzzl.com/newyear/zs-right.png")
      repeat-y top;
    background-size: 0.55rem 6.72rem;
    right: 0rem;
  }
  .pop-wrap {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 999;
  }
  .pop-box {
    width: 4.74rem;
    height: 5.4rem;
    background: url("http://bqyx-qiniu.bqrzzl.com/newyear/pop-bg.png") repeat-y
      top;
    background-size: 4.74rem 5.4rem;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    position: absolute;
    .msg {
      color: #fdc254;
      font-size: 0.36rem;
      width: 100%;
      text-align: center;
      font-weight: bold;
    }
    .dmsg {
      margin-top: 2.8rem;
    }
    .bbtn {
      width: 3.2rem;
      height: 0.76rem;
      line-height: 0.76rem;
      text-align: center;
      font-weight: bold;
      font-size: 0.3rem;
      background: url("http://bqyx-qiniu.bqrzzl.com/newyear/btn3@2x.png")
        no-repeat;
      background-size: 3.2rem 0.76rem;
      color: #d22a2a;
      position: absolute;
      bottom: 0.73rem;
      left: 50%;
      -webkit-transform: translateX(-50%);
    }
  }
  .footer {
    .img {
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
    }
  }
}
</style>
