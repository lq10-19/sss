<template>
  <div class="main">
    <img class="flower" src="http://bqyx-qiniu.bqrzzl.com/newyear/flower.png" />
    <div class="zs-left zs"></div>
    <div class="zs-right zs"></div>
    <div class="content" :style="{'min-height': windowHeight+'rpx'}">
      <!-- list -->
       <!-- 搜索 -->
      <div class="search"><i @click="goSearch"></i>
          <form action="#">
              <input @click="goSearch" type="text" placeholder="输入名字或昵称搜索" @focus="goSearch">
          </form>
      </div>
      <div class="myContent">
        <ul>
          <p class="title">拜年对象只能从组织好友当中选择，每次仅能选择一个拜年对象</p>
          <li v-for="(item,index) in groupList" :key="index" @click="toGroupUsers(item.groupMainId,item.groupName)">
            <div class="listImg">
              <div class="ul" :class="'people_'+item.imgList.length">
                <img v-for="(item2,index2) in item.imgList" :key="index2" :src="item2?item2:'/static/img/sign/user.png'" alt="">
              </div>
            </div>
            <div class="listName"><p>{{item.groupName}}</p></div>
          </li>
        </ul>
      </div>
       <!-- 没有团提示 -->
      <div v-show='isShow' class="warn">
        <div><p>您当前没有加入过组织</p></div>
        <div><p>还没有找到自己组织？去<span @click="goHomeFun" class="goHome">组织广场</span>看看</p></div>
      </div>
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
      groupList:[],
      isShow:false
    };
  },
  onLoad(options) {
    let systemInfo = getSystemInfo();
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
  	this.getGroupList();
  },
  methods: {
    getGroupList(){
    	let loginInfo = getLoginInfo();
    	console.log(loginInfo);
    	let url = path.getGroupList;
    	let queryData = {
	        userId: loginInfo.userid,
	    };
	    let promise = this.$fly.get(url, queryData);
      	promise.then(data => {
      		console.log("aaa88",data);
          	if(data.length>0){
              for(var i=0;i<data.length;i++){
                if(data[i].imgList.length >9){
                  data[i].imgList = data[i].imgList.slice(0,9);
                }
              }
              this.groupList = data;
              this.isShow= false;
              console.log("有")
          	}else{
              this.isShow= true;
              console.log("无")
            }
        }).catch(e => {
              wx.showToast({
                title: "系统异常",
                icon: "none"
              });
        });
    },
    toGroupUsers(groupId,groupName){
      wx.removeStorageSync("newYearIsSuccess");
    	wx.navigateTo({
        url: "/pages/service/newYear/groupUsers/main?groupId="+groupId+"&groupName="+groupName,
        fail:(res)=>{
          wx.redirectTo({
              url: "/pages/service/newYear/groupUsers/main?groupId="+groupId+"&groupName="+groupName,
          });
        }
      });
    },
    goSearch(){
      wx.removeStorageSync("newYearIsSuccess");
    	wx.navigateTo({
        	url: "/pages/service/newYear/searchUser/main?fromPage=groupList",
      	});
    },
    goHomeFun(){
      wx.navigateTo({
          url: "/pages/service/newYear/myOrganize/main?currentTab=1",
          fail:(res)=>{
            wx.redirectTo({
               url: "/pages/service/newYear/myOrganize/main?currentTab=1"
            });
          }
      });
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
      padding-bottom:1rem;
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

//list 
// 搜索
  .search {
    width: 4.8rem;
    height: 0.65rem;
    position: relative;
    margin: 0 auto;
    margin-top: 0.8rem;
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
//内容区
.myContent{
  margin: 0 auto;
  margin-top: 0.6rem;
  width: 6.11rem;
  
  ul{
    .title{
      font-size:0.22rem;
      font-family:PingFangSC-Medium;
      font-weight:700;
      color:rgba(0,0,0,1);
      line-height:0.36rem;
      padding-bottom: 0.2rem;
      text-align: center;
    }
    li{
      width: 6.11rem;
      height: 1.57rem;
      background: url("http://bqyx-qiniu.bqrzzl.com/wen/%E5%BA%952@2x.png") no-repeat center/100%;
      padding:0.2rem 0 0 0.38rem;
      box-sizing: border-box;
      margin-bottom: 0.3rem;
      .listImg{
        width: 1.16rem;
        height: 1.16rem;
        float: left;
        background: #F9DBC7;
        box-sizing: border-box;
        overflow: hidden;
        img{
          width: 0.28rem;
          height: 0.28rem;
          margin: 0.08rem 0 0 0.08rem;
          float: left;
        }
      }
      .ul.people_1{
        padding: 5%;
        margin: 0;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        image-resolution: {
          width: 100%;
          height: 100%;
          margin: 0;
        }
      }
      .ul.people_2{
        padding: 5%;
        margin: 0;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        img{
          width: 50%;
          height: 50%;
          margin: 0;
          margin-top: 0.3rem;
        }
      }
      .ul.people_9{
        padding: 5%;
        margin: 0;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        img{
          width: 33.33333%;
          height: 33.33333%;
          margin: 0;
        }
      }
      .ul.people_4{
        padding: 5%;
        margin: 0;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        img{
          width: 50%;
          height: 50%;
          margin: 0;
        }
      }
      .ul.people_3{
        padding: 5%;
        margin: 0;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        position: relative;
        img{
          width: 0.5rem;
          height: 0.5rem;
          margin: 0;
          position: absolute;
        }
        img:nth-child(1){
          left: 50%;
          -webkit-transform: translateX(-50%);
        }
        img:nth-child(2){
          bottom: 5%;
          left: 0.05rem;
        }
        img:nth-child(3){
          bottom: 5%;
          right: 0.05rem;
        }
      }
      .ul.people_5{
        padding: 5%;
        margin: 0;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        position: relative;
        img{
          width: 0.35rem;
          height: 0.35rem;
          margin: 0;
          position: absolute;
        }
        img:nth-child(1){
          left: 0.2rem;
          top: 0.2rem;
        }
        img:nth-child(2){
          right: 0.2rem;
          top: 0.2rem;
        }
        img:nth-child(3){
          left: 0.05rem;
          bottom: 0.25rem;
        }
        img:nth-child(4){
          left: 50%;
          -webkit-transform: translateX(-50%);
          bottom: 0.25rem;
        }
        img:nth-child(5){
          right: 0.05rem;
          bottom: 0.25rem;
        }
      }
      .ul.people_8{
        padding: 5%;
        margin: 0;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        position: relative;
        img{
          width: 0.34rem;
          height: 0.34rem;
          margin: 0;
          position: absolute;
        }
        img:nth-child(1){
          left: 0.2rem;
          top: 3%;
        }
        img:nth-child(2){
          right: 0.2rem;
          top: 3%;
        }
        img:nth-child(3){
          left: 0.05rem;
          top: 0.4rem;
        }
        img:nth-child(4){
          left: 50%;
          -webkit-transform: translateX(-50%);
          top: 0.4rem;
        }
        img:nth-child(5){
          right: 0.05rem;
          top: 0.4rem;
        }
        img:nth-child(6){
          left: 0.05rem;
          bottom: 3%;
        }
        img:nth-child(7){
          left: 50%;
          -webkit-transform: translateX(-50%);
          bottom: 3%;
        }
        img:nth-child(8){
          right: 0.05rem;
          bottom: 3%;
        }
      }
      .ul.people_7{
        padding: 5%;
        margin: 0;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        position: relative;
        img{
          width: 0.34rem;
          height: 0.34rem;
          margin: 0;
          position: absolute;
        }
        img:nth-child(1){
          left: 50%;
          top: 3%;
          -webkit-transform: translateX(-50%);
        }
        img:nth-child(2){
          left: 0.05rem;
          top: 0.4rem;
        }
        img:nth-child(3){
          left: 50%;
          -webkit-transform: translateX(-50%);
          top: 0.4rem;
        }
        img:nth-child(4){
          right: 0.05rem;
          top: 0.4rem;
        }
        img:nth-child(5){
          left: 0.05rem;
          bottom: 3%;
        }
        img:nth-child(6){
          left: 50%;
          -webkit-transform: translateX(-50%);
          bottom: 3%;
        }
        img:nth-child(7){
          right: 0.05rem;
          bottom: 3%;
        }
      }
      .ul.people_6{
        padding: 5%;
        margin: 0;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        img{
          width: 33.33333%;
          height: 33.33333%;
          margin: 0;
        }
        img:nth-child(1){
          margin-top: 0.2rem;
        }
        img:nth-child(2){
          margin-top: 0.2rem;
        }
        img:nth-child(3){
          margin-top: 0.2rem;
        }
      }
      .listName{
        float: left;
        p{
          line-height: 1.16rem;
          color: #D22A2A;
          font-size: 0.3rem;
          font-weight: 700;
          margin-left: 0.37rem;
        }
      }
    }
  }
}
.warn{
  margin-top: 0.5rem;
  div{
    p{
      text-align: center;
      font-size: 0.3rem;
      .goHome{
        color: #D22A2A;
      }
    }
  }

}
</style>
