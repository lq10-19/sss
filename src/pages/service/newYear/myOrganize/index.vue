<template>
  <div class="main">
    <img class="flower" src="http://bqyx-qiniu.bqrzzl.com/newyear/flower.png" />
    <div class="zs-left zs"></div>
    <div class="zs-right zs"></div>
    <div class="content" :style="{'min-height': windowHeight+'rpx'}">
      <div class="swiper-tab">
        <div class="d"></div>
        <div :class="currentTab=='0'?'.swiper-tab-item active': '.swiper-tab-item'" data-current="0" @click="switchTab('switchTab',$event)">我的组织</div>
        <div :class="currentTab=='1'?'.swiper-tab-item active': '.swiper-tab-item'" data-current="1" @click="switchTab('switchTab',$event)">组织广场</div>
      </div>
      <p class="max-text">每人最多创建或加入10个组织</p>
      <div class="btn-wrap">
        <div class="foundOrganize-btn" @click="gofoundOrganize">创建组织</div>
      </div>
      <p class="tips" v-if="state == 0">还没有找到组织？去组织广场看看</p>
      <swiper class="cont" @change="switchItem('switchItem',$event)" :current="currentTab" circular="true" skip-hidden-item-layout="true" :style="{height:swiperHeight}">
        <swiper-item>
          <div class="item">
            <ul class="group-wrap">
              <li class="group-list" v-for="(item,index) in organizationData" :key="index">
                <div class="mess-block" @click="goOrganizeDetails(item.groupMainId,'one')">
                  <div class="group-box">
                    <ul :class="'people_'+item.imgList.length">
                      <li v-for="(items,indexs) in item.imgList" :key="indexs"><img v-if="items!=null" class="user"  :src="items" /><img v-else class="user" src="/static/img/sign/user.png" /></li>
                    </ul>
                  </div>
                  <div class="mess">
                    <p class="group-name">{{item.groupName}}</p>
                    <p class="group-form">({{item.groupCreateName}}创建)</p>
                  </div>
                </div>
                <button class="btn" :data-groupMainID="item.groupMainId" open-type="share">邀请组员</button>
              </li>
            </ul>
          </div>
        </swiper-item>
        <swiper-item>
          <div class="item">
            <ul class="group-wrap">
              <li class="group-list" v-for="(item,index) in organizationSquareData" :key="index">
                <div class="mess-block" @click="goOrganizeDetails(item.groupMainId,'two')">
                  <div class="group-box">
                    <ul :class="'people_'+item.imgList.length">
                      <li v-for="(items,indexs) in item.imgList" :key="indexs"><img v-if="items!=null" class="user" :src="items" /><img v-else class="user" src="/static/img/sign/user.png" /></li>
                    </ul>
                  </div>
                  <div class="mess">
                    <p class="group-name">{{item.groupName}}</p>
                    <p class="group-form">({{item.groupCreateName}}创建)</p>
                  </div>
                </div>
                <div class="btn" @click="joinOrgainize(item.groupMainId)">加入</div>
              </li>
            </ul>
          </div>
        </swiper-item>
      </swiper>
      <div class="more-block" v-if="currentTab == 1">
        <p class="more" v-if="moreTipShow == true">下拉加载更多</p>
        <p class="more" v-else>没有更多了</p>
      </div>
    </div>
    <div class="pop-wrap" v-if="popShow == true">
      <div class="pop-box">
        <p class="msg dmsg">加入成功！</p>
        <div class="bbtn" @click="closePop">确定</div>
      </div>
    </div>
    <div class="footer">
      <image class="img" mode="widthFix" src="http://bqyx-qiniu.bqrzzl.com/newyear/footer-bg.png"></image>
    </div>
  </div>
</template>
<script>
import { path, getLoginInfo, getSystemInfo, showLoading ,apiFail} from "@/utils/index";
import { setTimeout } from 'timers';
export default {
  components: {},
  data() {
    return {
      windowHeight: '',
      currentTab: 0,
      state: 0,
      swiperHeight: '',
      popShow: false,
      organizationData: '',
      organizationSquareData: [],
      groupMainId: '',
      pageSize: 10,
      pageIndex: 1,
      moreTipShow: true,
      total: 1
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
    if(this.currentTab == 0){
      this.myOrganization();
    }else if(this.currentTab == 1){
      this.organizationSquare();
    }
  },
  onShareAppMessage(params) {
    console.log(params);
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
    if(params.target == undefined){
      return {
        title: newYearShareTitle[num],
        imageUrl: 'http://bqyx-qiniu.bqrzzl.com/newyear/newYearBanner2.jpg',
        path: `/pages/service/newYear/main`
      };
    }else{
      let loginInfo = getLoginInfo();
      let userid = loginInfo.userid;
      let nickname = loginInfo.nickname;
      this.goEnjoy = false;
      let groupMainId = params.target.dataset.groupmainid;
      console.log(groupMainId);
      console.log(`/pages/service/newYear/singleOrganize/main?nickname=`+nickname+"&groupMainId="+this.groupMainId+"&userId="+userid)
      return {
        title: "您的好友"+nickname+"给您拜年啦！",
        imageUrl: 'http://bqyx-qiniu.bqrzzl.com/newyear/newYearBanner1.jpg',
        path: `/pages/service/newYear/singleOrganize/main?nickname=`+nickname+"&groupMainId="+groupMainId+"&userId="+userid
      };
    }
  },
  onReachBottom(){
    if(this.currentTab == 1){
      console.log('下拉');
      if(this.pageIndex <= this.total){
        this.pageIndex  = this.pageIndex + 1;
        let url = path.queryOrganizationSquare;
        let loginInfo = getLoginInfo();
        let queryData = {
          "userId": loginInfo.userid,
          "pageSize": this.pageSize,
          "pageIndex" : this.pageIndex
        };
        let promises = this.$fly.get(url, queryData);
        showLoading(promises)
        promises
          .then(data => {
            console.log(data);
            if(data != null && data.length > 0){
              
              this.organizationSquareData = this.organizationSquareData.concat(data);
              //this.organizationSquareData = data;
              let arr1 = this.organizationSquareData.length;
              console.log(this.organizationSquareData.length)
              if(this.organizationSquareData.length == data[0].total){
                this.moreTipShow = false;
              }else{
                this.moreTipShow = true;
              }
              this.total = Math.ceil(data[0].total / this.pageSize);
              this.swiperHeight = (this.organizationSquareData.length * 157) + (30 * this.organizationSquareData.length) + 'rpx';
            }else{
              
            }
          })
          .catch(e => {
            apiFail(e);
            console.log(e);
          });
        return promises;
      }else{
        this.moreTipShow = false;
      }
    }
  },
  methods: {
    gofoundOrganize(){
      wx.navigateTo({
        url: "/pages/service/newYear/foundOrganize/main",
        fail:(res)=>{
          wx.redirectTo({
            url: "/pages/service/newYear/foundOrganize/main",
          });
        }
      });
    },
    switchTab: function (prompt,res) {
      console.log(prompt,res);
      let oIndex = res.mp.currentTarget.dataset.current;
      this.currentTab = oIndex;
      if(oIndex == 0){
        let arr1 = this.organizationData.length;
        this.myOrganization();
      }else if(oIndex == 1){
        console.log('组织广场');
        this.pageIndex = 1;
        this.moreTipShow = true;
        var that = this;
        this.organizationSquare();
        this.state = 1;
      }
    },
    switchItem: function (prompt,res) {
      // console.log(prompt,res.mp.detail.current);
      let oIndex = res.mp.detail.current;
      this.currentTab = oIndex;
    },
    goOrganizeDetails(e,f){
      console.log(e);
      console.log(f);
      wx.navigateTo({
        url: "/pages/service/newYear/organizeDetails/main?groupMainId="+e+"&pageStare="+f,
        fail:(res)=>{
          wx.redirectTo({
            url: "/pages/service/newYear/organizeDetails/main?groupMainId="+e+"&pageStare="+f
          });
        }
      });
    },
    myOrganization(){
      let url = path.queryMyOrganization;
      let loginInfo = getLoginInfo();
      let queryData = {
        "userId": loginInfo.userid
      };
      let promises = this.$fly.get(url, queryData);
      showLoading(promises)
      promises
        .then(data => {
          console.log(data);
          if(data.length >=1){
            this.state = 1;
            for(var i=0;i<data.length;i++){
              if(data[i].imgList.length >9){
                data[i].imgList = data[i].imgList.slice(0,9);
              }
            }
            this.organizationData = data;
            console.log(this.organizationData);
            let arr1 = this.organizationData.length;
            this.swiperHeight = (arr1 * 157) + (30 * arr1) + 'rpx';
          }else{
            this.state = 0;
          }
        })
        .catch(e => {
          apiFail(e);
        });
      return promises;
    },
    organizationSquare(){
      let url = path.queryOrganizationSquare;
      let loginInfo = getLoginInfo();
      let queryData = {
        "userId": loginInfo.userid,
        "pageSize": this.pageSize,
        "pageIndex" : this.pageIndex
      };
      let promises = this.$fly.get(url, queryData);
      showLoading(promises)
      promises
        .then(data => {
          console.log(data);
          if(data != null && data.length > 0){
            for(var i=0;i<data.length;i++){
              if(data[i].imgList.length >9){
                data[i].imgList = data[i].imgList.slice(0,9);
              }
            }
            //this.organizationSquareData = this.organizationSquareData.concat(data);
            this.organizationSquareData = data;
            let arr1 = this.organizationSquareData.length;
            if(this.organizationSquareData.length >= data[0].total){
              this.moreTipShow = false;
            }else{
              this.moreTipShow = true;
            }
            this.total = Math.ceil(data[0].total / this.pageSize);
            this.swiperHeight = (this.organizationSquareData.length * 157) + (30 * this.organizationSquareData.length) + 'rpx';
          }else{
            
          }
        })
        .catch(e => {
          apiFail(e);
          console.log(e);
        });
      return promises;
    },
    joinOrgainize(e){
      console.log(e);
      let url = path.saveGroupUserInfo;
      let loginInfo = getLoginInfo();
      let queryData = [{
        "groupMainId": e,
        "userId": loginInfo.userid,
        "userType": "0",
        "userStatus": "1"
      }];
      let promises = this.$fly.post(url, queryData);
      promises
        .then(data => {
          console.log(data);
          this.popShow = true;
          this.currentTab = 0;
          this.myOrganization();
          this.organizationSquareData = [];
          this.pageIndex = 1;
          this.organizationSquare();
          this.moreTipShow = true;
        })
        .catch(e => {
          apiFail(e);
        });
      return promises;
    },
    closePop(){
      this.popShow = false;
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
      padding-bottom: 1.5rem;
      box-sizing: border-box;
      .max-text{
        font-size: 0.24rem;
        width: 100%;
        color: #000;
        text-align: center;
        position: absolute;
        top: 1.92rem;
        left: 0;
      }
      .cont{
        padding: 0 0.4rem;
        overflow: hidden;
        margin-top: 0.6rem;
        box-sizing: border-box;
      }
      .swiper-tab{
        width: 3.9rem;
        height: 0.68rem;
        margin: 0 auto;
        margin-top: 0.78rem;
        overflow: hidden;
        border-radius: 0.34rem;
        position: relative;
        .swiper-tab-item{
          float: left;
          width: 50%;
          text-align: center;
          height: 0.68rem;
          line-height: 0.68rem;
          font-size: 0.3rem;
          color: #FFD29C;
          background: #D22A2A;
          border-radius: 0.34rem;
          z-index: 9;
          position: relative;
        }
        .swiper-tab-item.active{
          color: #D22A2A;
          background: #FFB644;
        }
        .d{
          width: 60%;
          height: 0.68rem;
          position: absolute;
          background: #D22A2A;
          left: 50%;
          -webkit-transform: translateX(-50%);
          z-index: 1;
        }
      }
      .group-wrap{
        width: 100%;
        overflow: hidden;
        .group-list{
          width: 100%;
          height: 1.57rem;
          background: url('http://bqyx-qiniu.bqrzzl.com/newyear/group-list-bg.png') repeat-y top;
          background-size: 100% 1.57rem;
          overflow: hidden;
          position: relative;
          display: -webkit-box;
          display: -webkit-flex;
          display: flex;
          -webkit-box-align: center;
          -webkit-align-items: center;
          align-items: center;
          margin-bottom: 0.3rem;
          .mess-block{
            position: relative;
            display: -webkit-box;
            display: -webkit-flex;
            display: flex;
            -webkit-box-align: center;
            -webkit-align-items: center;
            align-items: center;
          }
          .group-box{
            width: 1.16rem;
            height: 1.16rem;
            background: #F9DBC7;
            overflow: hidden;
            margin-left: 0.38rem;
            border-radius: 0.05rem;
            ul{
              margin-top: 0.26rem;
              float: left;
              li{
                float: left;
                width: 0.28rem;
                height: 0.28rem;
                margin-left: 0.08rem;
                margin-bottom: 0.08rem;
                .user{
                  width: 0.28rem;
                  height: 0.28rem;
                  display: block;
                }
              }
            }
            ul.people_1{
              padding: 5%;
              margin: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              li{
                width: 100%;
                height: 100%;
                margin: 0;
                .user{
                  width: 100%;
                  height: 100%;
                  display: block;
                }
              }
            }
            ul.people_2{
              padding: 5%;
              margin: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              li{
                width: 50%;
                height: 50%;
                margin: 0;
                margin-top: 0.3rem;
                .user{
                  width: 100%;
                  height: 100%;
                  display: block;
                }
              }
            }
            ul.people_9{
              padding: 5%;
              margin: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              li{
                width: 33.33333%;
                height: 33.33333%;
                margin: 0;
                .user{
                  width: 100%;
                  height: 100%;
                  display: block;
                }
              }
            }
            ul.people_4{
              padding: 5%;
              margin: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              li{
                width: 50%;
                height: 50%;
                margin: 0;
                .user{
                  width: 100%;
                  height: 100%;
                  display: block;
                }
              }
            }
            ul.people_3{
              padding: 5%;
              margin: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              position: relative;
              li{
                width: 0.5rem;
                height: 0.5rem;
                margin: 0;
                position: absolute;
                .user{
                  width: 100%;
                  height: 100%;
                  display: block;
                }
              }
              li:nth-child(1){
                left: 50%;
                -webkit-transform: translateX(-50%);
              }
              li:nth-child(2){
                bottom: 5%;
                left: 0.05rem;
              }
              li:nth-child(3){
                bottom: 5%;
                right: 0.05rem;
              }
            }
            ul.people_5{
              padding: 5%;
              margin: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              position: relative;
              li{
                width: 0.35rem;
                height: 0.35rem;
                margin: 0;
                position: absolute;
                .user{
                  width: 100%;
                  height: 100%;
                  display: block;
                }
              }
              li:nth-child(1){
                left: 0.2rem;
                top: 0.2rem;
              }
              li:nth-child(2){
                right: 0.2rem;
                top: 0.2rem;
              }
              li:nth-child(3){
                left: 0.05rem;
                bottom: 0.25rem;
              }
              li:nth-child(4){
                left: 50%;
                -webkit-transform: translateX(-50%);
                bottom: 0.25rem;
              }
              li:nth-child(5){
                right: 0.05rem;
                bottom: 0.25rem;
              }
            }
            ul.people_8{
              padding: 5%;
              margin: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              position: relative;
              li{
                width: 0.34rem;
                height: 0.34rem;
                margin: 0;
                position: absolute;
                .user{
                  width: 100%;
                  height: 100%;
                  display: block;
                }
              }
              li:nth-child(1){
                left: 0.2rem;
                top: 3%;
              }
              li:nth-child(2){
                right: 0.2rem;
                top: 3%;
              }
              li:nth-child(3){
                left: 0.05rem;
                top: 0.4rem;
              }
              li:nth-child(4){
                left: 50%;
                -webkit-transform: translateX(-50%);
                top: 0.4rem;
              }
              li:nth-child(5){
                right: 0.05rem;
                top: 0.4rem;
              }
              li:nth-child(6){
                left: 0.05rem;
                bottom: 3%;
              }
              li:nth-child(7){
                left: 50%;
                -webkit-transform: translateX(-50%);
                bottom: 3%;
              }
              li:nth-child(8){
                right: 0.05rem;
                bottom: 3%;
              }
            }
            ul.people_7{
              padding: 5%;
              margin: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              position: relative;
              li{
                width: 0.34rem;
                height: 0.34rem;
                margin: 0;
                position: absolute;
                .user{
                  width: 100%;
                  height: 100%;
                  display: block;
                }
              }
              li:nth-child(1){
                left: 50%;
                top: 3%;
                -webkit-transform: translateX(-50%);
              }
              li:nth-child(2){
                left: 0.05rem;
                top: 0.4rem;
              }
              li:nth-child(3){
                left: 50%;
                -webkit-transform: translateX(-50%);
                top: 0.4rem;
              }
              li:nth-child(4){
                right: 0.05rem;
                top: 0.4rem;
              }
              li:nth-child(5){
                left: 0.05rem;
                bottom: 3%;
              }
              li:nth-child(6){
                left: 50%;
                -webkit-transform: translateX(-50%);
                bottom: 3%;
              }
              li:nth-child(7){
                right: 0.05rem;
                bottom: 3%;
              }
            }
            ul.people_6{
              padding: 5%;
              margin: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              li{
                width: 33.33333%;
                height: 33.33333%;
                margin: 0;
                .user{
                  width: 100%;
                  height: 100%;
                  display: block;
                }
              }
              li:nth-child(1){
                margin-top: 0.2rem;
              }
              li:nth-child(2){
                margin-top: 0.2rem;
              }
              li:nth-child(3){
                margin-top: 0.2rem;
              }
            }
          }
          .mess{
            width: 2.4rem;
            float: left;
            margin-left: 0.37rem;
            padding-right: 0.1rem;
            box-sizing: border-box;
            .group-name{
              color: #D22A2A;
              font-size: 0.3rem;
              overflow: hidden;
              white-space: nowrap;
              text-overflow:ellipsis;
            }
            .group-form{
              color: #D22A2A;
              font-size: 0.3rem;
              overflow: hidden;
              white-space: nowrap;
              text-overflow:ellipsis;
            }
          }
          .btn{
            width: 1.4rem;
            height: 0.5rem;
            line-height: 0.5rem;
            color: #FFD29C;
            font-size: 0.24rem;
            padding: 0;
            box-sizing: border-box;
            font-weight: 400; 
            background-color: none;
            background: #D22A2A;
            border-radius: 0.25rem;
            border: none;
            text-align: center;
          }
          .btn:after{
            border: none
          }
        }
      }
      .btn-wrap{
        padding: 0 0.55rem;
        margin-top: 0.67rem;
        overflow: hidden;
        .foundOrganize-btn{
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
      .tips{
        font-weight: bold;
        font-size: 0.32rem;
        width: 100%;
        text-align: center;
        color: #000;
        margin-top: 0.8rem;
        overflow: hidden;
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
        background: url('http://bqyx-qiniu.bqrzzl.com/newyear/btn4.png') no-repeat;
        background-size: 3.2rem 0.76rem;
        color: #D22A2A;
        position: absolute;
        bottom: 0.73rem;
        left: 50%;
        -webkit-transform: translateX(-50%);
      }
    }
    .more{
      width: 100%;
      overflow: hidden;
      text-align: center;
      padding-bottom: 0.2rem;
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
