<template>
  <div class="main">
    <img class="flower" src="http://bqyx-qiniu.bqrzzl.com/newyear/flower.png" />
    <div class="zs-left zs"></div>
    <div class="zs-right zs"></div>
    <div class="content" :style="{'min-height': windowHeight+'rpx'}">
      <div class="title-box">
        <p>每日获得红包总额最高</p>
        <p>的前三名奖励现金</p>    
      </div>
      <div class="topMsg">
        <ul>
          <li>
            <p class="label">TOP1</p>
            <p class="val">500元</p>
          </li>
          <li>
            <p class="label">TOP2</p>
            <p class="val">200元</p>
          </li>
          <li>
            <p class="label">TOP3</p>
            <p class="val">100元</p>
          </li>
        </ul>
      </div>
      <div class="tableBox">
        <ul>
          <li>
            <p>排名</p>
            <p>微信名称</p>
            <p>今日拜年次数</p>
            <p>获得红包总额</p>
          </li>
          <li v-for="(item,index) in winList" :key="index">
            <p>{{index+1}}</p>
            <p>{{item.nickName}}</p>
            <p>{{item.frequency}}</p>
            <p>{{item.money}}</p>
          </li>
        </ul>
      </div>
      <div class="PrizeWinningBox">
        <div class="labelTitle"><p>获奖名单</p></div>
        <div class="messwrap" v-for="(item,index) in RankingList" :key="index">
          <p class="date">{{item.dateStr}}获奖人员</p>
          <ul>
            <li v-for="(items,indexs) in item.data" :key="indexs">
              <div class="row">TOP{{indexs + 1}}</div>
              <div class="row">{{items.nickName}}</div>
              <div class="row">{{items.money}}元</div>
            </li>
          </ul>
        </div>
      </div>
      <div class="PrizeWinningBox rule">
        <div class="labelTitle"><p>奖励规则</p></div>
        <ul>
          <li>1、活动时间：2019年2月4日—2月19日；</li>
          <li>2、活动期间每日领取拜年红包金额前三名最高的用户可以获得现金奖励；</li>
          <li>3、排行榜仅统计当日累计获得的红包金额，次日凌晨公布前一日的获奖名单；</li>
          <li>4、活动期间每人仅可领取一次top奖励，如前三名出现与此前领奖用户重复的，则top排名往后顺延；</li>
          <li>5、获得的现金奖励将在活动结束后15个工作日内发放，届时会有客服联系获奖人员；</li>
          <li>6、如活动中发现有任何违规操作，平台有权取消违规用户的奖励；</li>
        </ul>
      </div>
    </div>
    <div class="footer">
      <image class="img" mode="widthFix" src="http://bqyx-qiniu.bqrzzl.com/newyear/footer-bg.png"></image>
    </div>
  </div>
</template>
<script>
import { path, getLoginInfo, getSystemInfo ,apiFail } from "@/utils/index";
import { setTimeout } from 'timers';
export default {
  components: {},
  data() {
    return {
      windowHeight: '',
      winList: '',
      RankingList: ''
    };
  },
  onLoad(options) {

  },
  onShow() {
    this.getWinninglist();
    this.getHeroRanking();
  },
  onReady() {
    let that = this;
    wx.getSystemInfo({
      success({windowHeight}) {
        that.windowHeight = windowHeight * 2 -60;
      }
    });
  },
  methods: {
    getWinninglist(){
      let userInfo = getLoginInfo();
      let url = path.getWinninglist;
      let queryData = {
      };
      let promise = this.$fly.get(url, queryData);
      promise
        .then(data => {
          if(data){
            console.log(data);
            this.winList = data;
          }
        })
        .catch(e => {
          apiFail(e);
        });
      return promise;
    },
    getHeroRanking(){
      let userInfo = getLoginInfo();
      let url = path.getHeroRanking;
      let queryData = {
      };
      let promise = this.$fly.get(url, queryData);
      promise
        .then(data => {
          if(data){
            console.log(data);
            let temp = [];
            for(let key in data){
              temp.push({
                date:new Date(key),
                
                dateStr:key,
                data:data[key]
              });
            }
            temp.sort((a,b)=>{return b.date.getTime()-a.date.getTime()});
            console.log('temp',temp);
            this.RankingList = temp;
          }
        })
        .catch(e => {
          apiFail(e);
        });
      return promise;
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
      padding-bottom: 2rem;
      .title-box{
        width: 100%;
        text-align: center;
        overflow: hidden;
        padding-top: 0.88rem;
        p{
          font-size: 0.38rem;
          color: #000;
          margin-bottom: 0.3rem;
          font-weight: bold;
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
  //内容区
  .topMsg{
    margin-top: 0.8rem;
    width: 100%;
    text-align: center;
    ul{
      margin: 0 auto;
      display: inline-table;
      li{
        width: 2.26rem;
        height: 2.28rem;
        background: url('http://bqyx-qiniu.bqrzzl.com/newyear/rankTop.png') repeat-y top;
        background-size: 2.26rem 2.28rem;
        float: left;
        position: relative;
        .label{
          font-size: 0.26rem;
          color: #fff;
          position: absolute;
          width: 100%;
          text-align: center;
          top: 0.18rem;
        }
        .val{
          font-size: 0.36rem;
          width: 100%;
          text-align: center;
          color: #FDC254;
          top: 0.98rem;
          position: absolute;
          font-weight: bold;
        }
      }
    }
  }
  .tableBox{
    width: 6.3rem;
    margin: 0 auto;
    margin-top: 0.3rem;
    border: 1px solid #000;
    ul{
      li{
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #000;
        p{
          width: 100%;
          font-size:0.26rem;
          font-weight:700;
          color:rgba(0,0,0,1);
          text-align: center;
          border-left: 1px solid #000;
          padding: 0.15rem 0;
          line-height: 0.6rem;
        }
        p:nth-of-type(1){
          line-height: 0.6rem;
          border-left: none;
          flex: 0 0 0.9rem;
          width:0.9rem;
        }
      }
      li:last-child{
        border-bottom: none;
      }
      li:nth-of-type(n+2){
        p{
          line-height: 0.6rem;
        }
      }
    }
  }
  .PrizeWinningBox{
    margin: 0 0.45rem;
    margin-top: 1.89rem;
    background: #D22A2A;
    border-radius: 0.2rem;
    padding: 0.53rem;
    box-sizing: border-box;
    position: relative;
    .labelTitle{
      width: 5.64rem;
      height: 1.32rem;
      background: url('http://bqyx-qiniu.bqrzzl.com/newyear/rankTitle.png') repeat-y top;
      background-size: 5.64rem 1.32rem;
      position: absolute;
      left: 50%;
      -webkit-transform: translateX(-50%);
      top: -0.9rem;
      text-align: center;
      p{
        font-size: 0.4rem;
        color: #fff;
        width: 100%;
        text-align: center;
        margin-top: 0.28rem;
        font-weight: bold;
      }
    }
    .messwrap{
      width: 100%;
      overflow: hidden;
      margin-top: 0.46rem;
      .date{
        width: 100%;
        overflow: hidden;
        text-align: center;
        font-size: 0.3rem;
        color: #fff;
        margin-bottom: 0.4rem;
      }
      ul{
        width: 100%;
        overflow: hidden;
        li{
          width: 100%;
          overflow: hidden;
          font-size: 0.3rem;
          color: #FDC254;
          font-weight: bold;
          margin-bottom: 0.2rem;
          div{
            float: left;
          }
          
        }
        li .row:nth-child(1){
          width: 22%;
        }
        li .row:nth-child(2){
          width: 50%;
          text-align: center;
          padding: 0 0.2rem;
          box-sizing: border-box;
        }
        li .row:nth-child(3){
          width: 28%;
        } 
      }
    }
  }
  .rule{
    padding: 0.35rem;
    ul{
      width: 100%;
      overflow: hidden;
      margin-top: 0.5rem;
    }
    ul li{
      font-size: 0.26rem;
      color: #FDC254;
      margin-bottom: 0.1rem;
      line-height: 0.45rem;
    }
  }
</style>
