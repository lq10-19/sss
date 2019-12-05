<template>
  <div class="main">
    <img class="flower" src="http://bqyx-qiniu.bqrzzl.com/newyear/flower.png" />
    <div class="zs-left zs"></div>
    <div class="zs-right zs"></div>
    <div class="content" :style="{'min-height': windowHeight+'rpx'}">
      <p class="title">{{renderGroupName}}</p>
    	  <!-- 搜索 -->
      <div class="search"><i @click="goSearch"></i>
          <form action="#">
              <input @click="goSearch" type="text" placeholder="输入名字或昵称搜索" @focus="goSearch">
          </form>
      </div>
      <p class="subTitle">组拜年团只能从选择的拜年对象所在组织好友当中选择<br>每次最多可选20个好友一起拜年</p>
      
      <p class="mess-text">全体组织成员（{{groupUsers.length}}人）</p>
      <ul class="clearfix">

        <li class="list" v-for="(item,index) in groupUsers" :key="index">
          <img class="user" :src="item.wechatHeadImgUrl?item.wechatHeadImgUrl:'/static/img/sign/user.png'" />
          <p class="name">{{item.userNickName}}</p>
          <div class="btn"></div>
           <div  :class="{'notSelect':item.haveSelected}"  @click="selectFun(item)" class="btn"><p :class="{'selected':item.isSelected}"></p><p>选择</p></div>
        </li>
      </ul>
      <div class="myButton" @click="goGoupYear"><p>确定</p></div>
    </div>
    
    <div class="footer">
      <image class="img" mode="widthFix" src="http://bqyx-qiniu.bqrzzl.com/newyear/footer-bg.png"></image>
    </div>
  </div>
</template>
<script>
import { path, getLoginInfo, getSystemInfo } from "@/utils/index";
import { setTimeout } from 'timers';
export default {
  components: {},
  data() {
    return {
      windowHeight: '',
      popShow: false,
      groupUsers:[],
      isSelected:false,//是否选中
      haveSelected:false,//已经邀请过的好友
      allSelectedData:[],
      groupMainId:"",
      renderGroupName:"",//组名称
    };
  },
  onLoad(options) {

    console.log("groupMainId00",options)
    this.groupMainId = options.groupMainId;
  },
  onReady() {
    let that = this;
    wx.getSystemInfo({
      success({windowHeight}) {
        that.windowHeight = windowHeight * 2 -60;
      }
    });
  },
  onShow(options) {
    if(wx.getStorageSync("newYearIsSuccess")){
      wx.removeStorageSync("newYearIsSuccess");
      wx.redirectTo({
        url: "/pages/service/newYear/main",
      });
      return;
    };
    console.log("保存的选择的数据",wx.getStorageSync("allSelectedData"))
    if(wx.getStorageSync("allSelectedData")){
      this.allSelectedData = wx.getStorageSync("allSelectedData");
    }else{
      wx.setStorageSync("allSelectedData",[]);
      this.allSelectedData = [];
    };
    this.getGroupUsers(this.groupMainId);
  },
  methods: {
    getGroupUsers(groupMainId){
      wx.showLoading({
        title: '正在加载',
        mask: true,
        icon: 'loading'
      })
      //获取保存本地拜年对像的信息
      let passData =  wx.getStorageSync("passData");
      let loginInfo = getLoginInfo();
    	let url = path.getGroupUser;
    	let queryData = {
	        groupMainId: groupMainId,
	    };
	    let promise = this.$fly.get(url, queryData);
      	promise.then(data => {
          console.log("组员信息",data);
            wx.hideLoading();
          	if(data){
              this.groupUsers = data;
              this.renderGroupName = data[0].groupName;
              console.log("passData.userId",passData.userId)
              this.groupUsers.forEach((v,i) => {
                if(v.userId==passData.userId||v.userId==loginInfo.userid||v.isFollow!="1"){//判断组员是否是被拜年对像
                  v.haveSelected = true;
                  console.log("111111")
                }else{
                  v.isSelected = false;
                  v.haveSelected = false;
                    console.log("222222")
                }
               
              });
              console.log("保存的选择数据",this.allSelectedData)
              this.allSelectedData.forEach((v,i)=>{
                 this.groupUsers.forEach((v2,i2) => {
                   if(v2.userId==v.userId){
                     v2.haveSelected = true;
                     v2.isSelected = false;
                   }
                });
              });
              this.groupUsers = Object.assign([],this.groupUsers);
              console.log("ddddd",this.groupUsers)
              console.log("eeee",this.allSelectedData)
              
            }
        }).catch(e => {
           wx.hideLoading();
        });
    },
    goSearch(){
      wx.removeStorageSync("newYearIsSuccess");
    	wx.navigateTo({
          url: "/pages/service/newYear/searchUser/main?fromPage=groupUsers2&groupMainId="+this.groupMainId,
          fail:(res)=>{
          wx.redirectTo({
            url: "/pages/service/newYear/searchUser/main?fromPage=groupUsers2&groupMainId="+this.groupMainId,
          });
        }
      });
    },
    goGoupYear(){
      var selectedData = [];
      this.groupUsers.forEach((v,i)=>{
        if(v.isSelected==true){
          selectedData.push(v);
        }
      });
      if(this.allSelectedData.length+selectedData.length>20){
        wx.showToast({
          title: "最多只能邀请20个好友哦~",
          icon: "none"
        });
        return;
      }else{
        this.allSelectedData = this.allSelectedData.concat(selectedData);
      }
      wx.setStorageSync("allSelectedData",this.allSelectedData);
    	wx.navigateTo({
        url: "/pages/service/newYear/groupYear/main",
        fail:(res)=>{
          wx.redirectTo({
            url: "/pages/service/newYear/groupYear/main",
          });
        }
    	});
    },
    selectFun(item){
      let userInfo = getLoginInfo();
      if(item.userId==userInfo.userid){
        wx.showToast({
          title: "不能邀请自己哦~",
          icon: "none"
        });
        return;
      }
      if(item.isFollow!='1'){
        wx.showToast({
          title: "此用户未关注公众号~",
          icon: "none"
        });
        return;
      };
      if(item.haveSelected==false){
        item.isSelected = !item.isSelected;
        this.groupUsers = Object.assign([],this.groupUsers);
      }else{
        wx.showToast({
          title: "您已经邀请过此好友~",
          icon: "none"
        });
      }
     
    }
  }
};
</script>

<style lang="scss" scoped>
 .clearfix:after{//清除浮动
    content:"";
    display:block;
    height:0;
    line-height:0;
    visibility:hidden;
    clear:both;
  }
	.search {
    width: 4.8rem;
    height: 0.65rem;
    position: relative;
    margin: 0 auto;
    margin-top: 0.3rem;
    box-sizing: border-box;
    i {
      position: absolute;
      left: 0.7rem;
      width: 0.34rem;
      height: 0.64rem;
      line-height: 0.64rem;
      background: url("http://bqyx-qiniu.bqrzzl.com/newyear/searchBtn.png") no-repeat center/100%;
    }
    input {
      width: 4.8rem;
      background: #fff;
      border-radius: 0.32rem;
      color: #000;
      font-size: 0.3rem;
      padding-left: 1.19rem;
      height: 0.64rem;
      line-height: 0.64rem;
      text-align: left;
      // border: 1px solid #333;
      box-sizing: border-box;
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
    .cancel{
      position: absolute;
      top: 0rem;
      right: -0.8rem;
      color: #D22A2A;
      font-size: 0.32rem;
      line-height: 0.65rem;
      font-weight: 700;
    }
  }
	//搜索列表
	.nameList{
	  width: 6.3rem;
	  height: 100%;
	  margin: 0 auto;
	  margin-top: 0.69rem;
	  ul{
	    li{
	      width: 6.3rem;
	      height: 1rem;
	      background: #fff;
	      margin-bottom: 1px;
	      box-sizing: border-box;
	      position: relative;
	      img{
	        width: 0.7rem;
	        height: 0.65rem;
	        border-radius: 0.06rem;
	        float: left;
	        margin-top: 0.2rem;
	        margin-left: 0.3rem;
	      }
	      p{
	        float: left;
	        font-weight:700;
	        font-size: 0.3rem;
	        line-height: 1rem;
	        margin-left: 0.33rem;
	      }
	      .rightText{
	        text-align: right;
	        font-weight: 400;
	        width: 100%;
	        position: absolute;
	        right: 0.2rem;
	        top: 50%;
	        transform: translateY(-50%);
	      }
	    }
	  }
	}
  .main{
    width: 100%;
    min-height: 100%;
    height: 100%;
    background: #D22A2A;
    overflow: hidden;
    position: relative;
    padding-bottom: 1rem;
    .content{
      margin: 0.3rem;
      overflow: hidden;
      background: url('http://bqyx-qiniu.bqrzzl.com/newyear/bg.png') repeat-y top;
      background-size: 100% 7.5rem;
      border-radius: 0.06rem;
      padding-bottom: 1rem;
      .title{
        width: 100%;
        text-align: center;
        font-size: 0.36rem;
        color: #D22A2A;
        font-weight: bold;
        margin-top: 0.88rem;
      }
      .mess-text{
        font-size: 0.28rem;
        color: #D22A2A;
        padding: 0 0.27rem;
        margin-top: 0.5rem;
        font-weight: bold;
        margin-bottom: 0.59rem;
      }
      ul{
        margin-left: 0.4rem;
      }
      .list{
        width: 1.08rem;
        text-align: center;
        position: relative;
        margin-right: 0.2rem;
        float: left;
        margin-bottom: 0.5rem;
        .user{
          width: 0.88rem;
          height: 0.88rem;
          border-radius: 50%;
        }
        .name{
          width: 1.08rem;
          height: 0.38rem;
          line-height: 0.38rem;
          font-size: 0.24rem;
          color: #fff;
          font-weight: bold;
          border-radius: 0.19rem;
          background: #FFB644;
          position: absolute;
          left: 0;
          top: 0.69rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space:nowrap;
        }
        .btn{
          font-size: 0.2rem;
          color: #000;
          width: 1.08rem;
          height: 0.38rem;
          line-height: 0.38rem;
          position: relative;
          margin-top: -0.1rem;
          p:nth-of-type(1){
            position: absolute;
            top:50%;
            transform: translateY(-50%);
            left: 0.15rem;
            width: 0.2rem;
            height: 0.2rem;
            background:url("http://bqyx-qiniu.bqrzzl.com/newyear/circle.png") no-repeat center/100%;
          }
          .selected{
            background:url("http://bqyx-qiniu.bqrzzl.com/newyear/circle_select.png") no-repeat center/100% !important;
          }
          p:nth-of-type(2){
            padding-left: 0.2rem;
          }
          // .notSelect{
          //   color:#999 !important;
          // }
        }
        .notSelect{
          p:nth-of-type(1){
            background:none !important;
            border-radius: 50%;
            box-sizing: border-box;
            border: 1px solid #999;
          }
          p:nth-of-type(2){
            color:#999 !important;
          }
        }
        
        // .btn:after{
        //   content: " ";
        //   width: 200%;
        //   height: 200%;
        //   position: absolute;
        //   top: 0;
        //   left: 0;
        //   border: 1px solid #F14B4B;
        //   -webkit-transform: scale(0.5);
        //   transform: scale(0.5);
        //   -webkit-transform-origin: 0 0;
        //   transform-origin: 0 0;
        //   box-sizing: border-box;
        //   border-radius: 50%;
        // }
        .add{
          width: 0.88rem;
          height: 0.88rem;
          margin-top: 0.13rem;
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
  .myButton{
  width:5.8rem;
  height:0.8rem;
  background:rgba(255,182,68,1);
  box-shadow:0px 0.06rem 0px 0px rgba(245,131,30,1);
  border-radius:0.38rem;
  margin: 0 auto;
  margin-top: 0.69rem;
  p{
    font-size:0.3rem;
    font-weight:700;
    color:rgba(210,42,42,1);
    line-height:0.8rem; 
    text-align: center;
  }
}
.subTitle{
  font-size: 0.22rem;
  text-align: center;
  margin-top: 0.4rem;
}
</style>
