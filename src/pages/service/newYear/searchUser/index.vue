<template>
  <div class="main">
    <img class="flower" src="http://bqyx-qiniu.bqrzzl.com/newyear/flower.png" />
    <div class="zs-left zs"></div>
    <div class="zs-right zs"></div>
    <div class="content" :style="{'min-height': windowHeight+'rpx'}">
    	<div class="search"><i></i>
          <form action="#">
              <input ref="inputVal" :focus="autoFocus"  @keyup.enter="submit"   type="search" v-model="inputVal" @input="submit" placeholder="输入名字或昵称搜索">
              <span v-show="isCancel" @click="cancelFun" class="cancel">取消</span>
          </form>
      	</div>
      	<div class="nameList">
	        <ul>
	          <li v-for="(item,index) in queryNameData" :key="index" @click="getBnUser(item)"><img :src="item.wechatHeadImgUrl" alt=""><p>{{item.userNickName}}</p><p class="rightText">{{item.groupName}}</p></li>
	        </ul>
      	</div>
        <!-- 搜索无内容提示 -->
        <div v-show="showWarn" class="warn"><p>没有匹配到内容~</p></div>
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
      oldInputVal:"",
      inputVal:"",
      isCancel:false,
      fromPage:'',//判断是从哪个页面来的
      queryNameData:[],//搜索到的名字
      allSelectedData:[],
      groupMainId:"",
      showMsg:false,
      showWarn:false,
      autoFocus:true,
      groupUsers:[],
    };
  },
  onLoad(options) {
    this.inputVal = "";
    this.fromPage = options.fromPage;
    this.groupMainId = options.groupMainId;
    this.queryNameData = [];
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
    if(wx.getStorageSync("newYearIsSuccess")){
      wx.removeStorageSync("newYearIsSuccess");
      wx.redirectTo({
        url: "/pages/service/newYear/main",
      });
      return;
    };
  },
  created() {
    
  },
  methods: {
  	cancelFun(){
      wx.navigateBack({
        delta: 1
      });
    },
    submit(){
      this.isCancel = true;
      this.inputVal = this.inputVal.replace(/\s/g,"");
      if(this.oldInputVal!=this.inputVal){
        this.oldInputVal = this.inputVal;
        console.log("aa",this.inputVal);
      };
      this.queryByUserIdAndUserNickName();
    },
    getBnUser(item){
      if(this.fromPage=='groupList'||this.fromPage=='groupUsers'){
        this.selectNewyerObj(item);
      }else if(this.fromPage=='secondGroupList'){//secondGroupList页面步骤已取消
        this.saveSearchData(item);
      }else if(this.fromPage =="groupUsers"){
        console.log("groupUsers")
      }else if(this.fromPage =="groupUsers2"){
        this.saveSearchData(item);
      }
      return;
    },
    queryByUserIdAndUserNickName(){
      let userInfo = getLoginInfo();
      let url = path.queryByUserIdAndUserNickName;
      let queryData = {
        "userId":userInfo.userid,
        "userNickName":this.inputVal
      };
      let promise = this.$fly.get(url, queryData);
      promise
        .then(data => {
          console.log("搜索到的人",data)
          if (data != null&&data.length>0) {
            if(this.fromPage=="secondGroupList"||this.fromPage=="groupUsers2"||this.fromPage=="groupUsers"){
              this.queryNameData = [];
              data.forEach((v,i)=>{
                if(v.groupMainId==this.groupMainId){
                  this.queryNameData.push(v);
                }
              })
            }else{
              this.queryNameData = data;
            }
            this.showMsg=false;
            this.showWarn = false;
          } else {
            this.queryNameData = [];
            this.showWarn=true;
          }
        })
        .catch(e => {
         
        });
      return promise;
    },
    //选择拜年对像逻辑
    selectNewyerObj(item){
      console.log("item",item)
      if(item.isFollow!='1'){
        wx.showToast({
          title: "此用户未关注公众号~",
          icon: "none"
        });
        return;
      };
      wx.removeStorageSync("passData");
      wx.removeStorageSync("allSelectedData");
      wx.navigateTo({
          url: "/pages/service/newYear/groupYear/main?userNickName="+item.userNickName+"&userId="+item.userId+"&groupMainId="+item.groupMainId+"&groupName="+item.groupName,
      });
    },
    //邀请逻辑——点击保存搜索到的数据到本地
    saveSearchData(item){
      if(item.isFollow!='1'){
        wx.showToast({
          title: "此用户未关注公众号~",
          icon: "none"
        });
        return;
      };
      if(wx.getStorageSync("allSelectedData")){
        this.allSelectedData = wx.getStorageSync("allSelectedData");
        var flag = false;
        this.allSelectedData.forEach(function(v,i) {
          if(v.userId==item.userId){
            flag = true;
          }
        });
        if(flag){
          wx.showToast({
            title: "您已经邀请过此好友~",
            icon: "none"
          });
          return;
        };
        if(this.allSelectedData.length>=20){
          wx.showToast({
            title: "最多只能邀请20个好友哦~",
            icon: "none"
          });
          return;
        };
        this.allSelectedData.push(item);
        console.log("item2",this.allSelectedData)
        wx.setStorageSync("allSelectedData",this.allSelectedData);
        wx.navigateTo({
            url: "/pages/service/newYear/groupYear/main",
              fail:(res)=>{
              wx.redirectTo({
                url: "/pages/service/newYear/groupYear/main",
              });
            }
        });
      }else{
        this.allSelectedData.push(item);
        wx.setStorageSync("allSelectedData",this.allSelectedData);
        wx.navigateTo({
          url: "/pages/service/newYear/groupYear/main",
          fail:(res)=>{
            wx.redirectTo({
              url: "/pages/service/newYear/groupYear/main",
            });
          }
        });
      };
    },
  
  },
  mounted() {
  },  
};
</script>

<style lang="scss" scoped>
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
        p:nth-of-type(1){
          width: 40%;
          text-overflow: ellipsis; 
          overflow:hidden;                     
          white-space: nowrap;
        }
	      .rightText{
	        text-align: right;
	        font-weight: 400;
	        width: 40%;
	        position: absolute;
	        right: 0.2rem;
	        top: 50%;
	        transform: translateY(-50%);
          text-overflow: ellipsis; 
          overflow:hidden;                     
          white-space: nowrap;
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
        // margin-left: 0.4rem;
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
        }
        .btn{
          font-size: 0.2rem;
          color: #D22A2A;
          width: 1.08rem;
          height: 0.38rem;
          line-height: 0.38rem;
          position: relative;
          margin-top: 0.2rem;
        }
        .btn:after{
          content: " ";
          width: 200%;
          height: 200%;
          position: absolute;
          top: 0;
          left: 0;
          border: 1px solid #F14B4B;
          -webkit-transform: scale(0.5);
          transform: scale(0.5);
          -webkit-transform-origin: 0 0;
          transform-origin: 0 0;
          box-sizing: border-box;
          border-radius: 19px;
        }
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

  .warn{
    margin-top: 0.6rem;
    p{
      text-align: center;
      font-size: 0.3rem;
    }
  }
</style>
