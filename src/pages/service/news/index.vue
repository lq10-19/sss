<template>
  <div class="main" :style="{'min-height':height +'px'}">
    <div class="content">
      <div class="searchBox">
        <!-- <span>搜索:</span> -->
        <img src="/static/icon/search (2).png" alt>
        <input
          @keyup.enter="submit"
          type="search"
          v-model="inputVal"
          @input="submit"
          placeholder="输入关键字/词进行搜素"
        >
      </div>
      <div>
        <div class="newsListTitle">
          <p
            v-for="(item,i) in titleList"
            :key="i"
            @click="changeMsg(item,i)"
            :class="{choose:index==i}"
          >
            <span v-if="item.latestNews>0">{{item.latestNews>99?99:item.latestNews}}</span>
            {{item.name}}
          </p>
        </div>
        <div class="newsListBox">
          <ul>
            <li
              @click="goNewsDetails(item)"
              v-for="(item,index) in renderAllData"
              :key="index"
              class="List"
            >
              <!-- <div class="left"><img :src="item.localHttpUrl"  alt=""></div> -->
              <div class="left">
                <p class="title">{{item.newsTitle}}</p>
                <p class="date">
                  <span class="span1">{{item.crawlLabelName}}</span>&nbsp;&nbsp;
                  <span class="span2">{{item.commentTotal}}评论</span>
                  &nbsp;&nbsp;{{item.crawlTime}}
                </p>
              </div>
              <div class="right">
                <img :src="item.localHttpUrl" alt>
              </div>
            </li>
            <div v-show="isShowBottom" class="warm">
              <p>----- 没有更多新闻了 -----</p>
            </div>
            <div v-show="noData" class="warm">
              <p>没有搜索到相关新闻哦~</p>
            </div>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  path,
  getLoginInfo,
  getSystemInfo,
  apiFail,
  getSceneCode,
  setSceneCode,
  showLoading,
  NumberAnimate
} from "@/utils/index";
import { debug } from "util";
// import { constants } from "fs";
export default {
  components: {},
  data() {
    return {
      backShow: true,
      inputVal: "",
      renderAllData: [],
      newsDataList: [],
      crawlTypeId: "", //类型id
      latestNews: null, //更新条数
      text: "", //搜索输入
      pageIndex: 1,
      index: 0,
      isShowBottom: false,
      noData: false,
      titleList: [], //资讯类型列表
      height: 500,
      width: 375,
    };
  },
  onLoad(options) {
    //授权登陆
    if (!getLoginInfo()) {
      const url = "/pages/login/main";
      wx.navigateTo({
        url
      });
      return;
    }
    //获取新闻类型
    if(options.share){
      this.queryType(getLoginInfo().userid);
    }
    wx.removeStorageSync("crawlTypeId");
    wx.removeStorageSync("newsId");
  },
  onShow() {
    this.height = getSystemInfo().windowHeight;
    this.width = getSystemInfo().windowWidth;
    this.crawlTypeId = wx.getStorageSync("crawlTypeId");
    console.log("类型id:"+this.crawlTypeId);
    //console.log(this.renderAllData);
    if(wx.getStorageSync("newsId")){
      this.renderAllData.forEach(element => {
        if(element.id == wx.getStorageSync("newsId")){
          element.commentTotal = element.commentTotal*1 + wx.getStorageSync("addNum")*1;
        }
      });
      
    }
  },
  onTabItemTap(item) {
    // 数据初始化
    this.titleList = [];
    this.renderAllData = [];
    this.newsDataList = [];
    this.isShowBottom = false;
    this.noData = false;
    this.pageIndex = 1;
    this.latestNews = null;
    wx.removeStorageSync("newsId");
    //获取新闻类型
    this.queryType(getLoginInfo().userid);
  },
  onHide() {},
  onShareAppMessage() {
    return {
      title: "佰仟资讯",
      path: "/pages/service/news/main?share=true",
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    };
  },
  methods: {
    backHome() {
      wx.switchTab({
        url: "/pages/home/main"
      });
    },
    //搜索
    submit() {
      this.pageIndex = 1;
      this.renderAllData = [];
      this.isShowBottom = false;
      this.getNewsListFun();
    },
    //选中标识
    changeMsg(resItem, resIndex) {
      //新闻列表初始化
      this.renderAllData = [];
      this.newsDataList = [];
      this.isShowBottom = false;
      this.noData = false;
      this.pageIndex = 1;
      this.index = resIndex;
      this.crawlTypeId = resItem.id;
      this.latestNews = resItem.latestNews;
      wx.removeStorageSync("newsId");
      this.getNewsListFun();
      wx.setStorageSync("crawlTypeId", this.crawlTypeId);
    },
    //获取新闻类型
    queryType(userId) {
      let url = path.queryType;
      let queryData = {
        userId
      };
      let promise = this.$fly.get(url,queryData);
      promise
        .then(data => {
          // console.log("类型：" + data);
          this.titleList = data;
          this.getNewsListFun();
        })
        .catch(e => {
          wx.showToast({
            title: '系统升级中',
            icon: none,
            duration: 2000
          })
          //apiFail(e);
        });
      return promise;
    },
    //获取资讯
    getNewsListFun() {
      wx.showLoading({
        title: "正在加载...",
        mask: true,
        icon: "loading"
      });
      if (!this.crawlTypeId) {
        this.crawlTypeId = this.titleList.length > 0 && this.titleList[0].crawlTypeId;
        this.latestNews = this.titleList[0].latestNews;
      }
      if (!this.crawlTypeId) {
        this.noData = true;
        return;
      }
      wx.removeStorageSync("newsId");
      let url = path.queryShowNews;
      let queryData = {
        text: this.inputVal,
        pageIndex: this.pageIndex, //页数
        pageSize: 10,
        crawlTypeId: this.crawlTypeId,
        userId: getLoginInfo().userid,
        latestNews: this.latestNews
      };
      let promise = this.$fly.post(url, queryData);
      promise
        .then(data => {
          wx.hideLoading();
          if (data.results.length > 0) {
            this.newsDataList = data.results;
            this.renderAllData = this.renderAllData.concat(this.newsDataList);
          } else {
            if (this.inputVal) {
              this.isShowBottom = false;
              this.noData = true;
            } else {
              this.isShowBottom = true;
              this.noData = false;
            }
          }
        })
        .catch(e => {
          apiFail(e);
        });
      return promise;
    },
    //跳详情
    goNewsDetails(item) {
      wx.removeStorageSync("newsId");
      let link = encodeURIComponent(item.link);
      let upperLevelId = item.id;
      wx.setStorageSync("crawlTypeId", this.crawlTypeId);
      wx.navigateTo({
        url: `/pages/service/news/carConsult/main?id=${upperLevelId}`,
        fail: res => {
          wx.redirectTo({
            url: "/pages/home/main"
          });
        }
      });
    }
  },
  //上拉触底
  onReachBottom() {
    wx.hideTabBarRedDot({
      index: 3
    });
    this.titleList[this.index].latestNews = null;
    if (!this.isShowBottom) {
      this.pageIndex = this.pageIndex + 1;
      if (this.inputVal) {
        this.text = this.inputVal;
      } else {
        this.text = "";
      }
      this.getNewsListFun();
    }
  }
};
</script>
<style lang="scss" scoped>
.main {
  width: 100%;
  //padding-bottom: 0.66rem;
  background-color: #f2f3f5;
  overflow: hidden;
  position: relative;
  .content {
    width: 100%;
    position: relative;
    min-height: 8rem;
    overflow: hidden;
    margin-top: 1.7rem;
    .searchBox {
      position: fixed;
      height: 0.98rem;
      width: 100%;
      display: flex;
      padding: 0.19rem 0.28rem;
      box-sizing: border-box;
      background: #fff;
      border-top: 1prx solid #f2f3f5;
      top: 0;
      left: 0;
      z-index: 999;
      span {
        font-size: 0.3rem;
        color: #000;
        width: 1.2rem;
        line-height: 0.6rem;
        text-align: center;
      }
      img {
        width: 0.3rem;
        height: 0.3rem;
        position: absolute;
        top: 0.4rem;
        left: 0.6rem;
      }
      input {
        width: 6.9rem;
        height: 0.7rem;
        background: #f2f3f5;
        border-radius: 0.35rem;
        font-size: 0.28rem;
        padding-left: 0.75rem;
        box-sizing: border-box;
      }
    }
  }
}
.newsListTitle {
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-top: 0.01rem solid #f2f3f5;
  background: #fff;
  height: 0.7rem;
  position: fixed;
  width: 100%;
  top: 0.98rem;
  z-index: 99;
  p {
    position: relative;
    font-size: 0.3rem;
    padding-bottom: 0.12rem;
    padding-top: 0.12rem;
    span {
      position: absolute;
      top: 0.05rem;
      right: -0.09rem;
      // border: 0.01rem solid red;
      border-radius: 0.18rem;
      font-size: 0.18rem;
      width: 0.25rem;
      text-align: center;
      background: red;
      color: #fff;
    }
  }
  .choose {
    color: rgba(255, 205, 3, 1);
    font-weight: 700;
    border-bottom: 0.08rem solid rgba(255, 205, 3, 1);
    border-bottom-left-radius: 0.04rem;
    border-bottom-right-radius: 0.04rem;
  }
}
.newsListBox {
  padding: 0.2rem 0.24rem;
  box-sizing: border-box;
  li {
    height: 2.18rem;
    display: flex;
    padding: 0.3rem 0.2rem 0 0;
    box-sizing: border-box;
    background: #fff;
    margin-bottom: 0.2rem;
    border-radius: 0.12rem;
    .left {
      margin-left: 0.2rem;
      .title {
        margin-top: -0.12rem;
        margin-right: 0.25rem;
        font-size: 0.3rem;
        color: #000;
        font-weight: 700;
        line-height: 0.48rem;
        min-height: 0.96rem;
        min-width: 4.4rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .date {
        font-size: 0.26rem;
        color: #8994a7;
        line-height: 0.23rem;
        padding-top: 0.58rem;
        position: relative;
        .span1 {
          position: relative;
          top: -0.03rem;
          display: inline-block;
          line-height: 0.3rem;
          height: 0.3rem;
          min-width: 0.56rem;
          max-width: 1.12rem;
          text-align: center;
          border: 0.01rem solid red;
          font-size: 0.2rem;
          color: red;
          // overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .span2 {
          display: inline-block;
          width: 1.5rem;
          // overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: center;
        }
      }
    }
    .right {
      width: 2rem;
      height: 1.3rem;
      img {
        width: 2rem;
        height: 1.3rem;
        border-radius: 0.06rem;
      }
    }
  }
}
.warm {
  p {
    font-size: 0.22rem;
    text-align: center;
    color: #999;
    margin-top: 0.75rem;
  }
}
</style>
