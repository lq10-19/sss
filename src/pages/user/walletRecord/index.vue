<template>
    <div class="main">
        <div class="no-record" v-if="recordData.length === 0">暂无记录</div>
        <ul class="record" v-for="(item,index) in recordData" :key="index" @click="getWallet">
            <li class="record_li">
                <p>
                    <span>{{item.operationName}}</span> <span :class="item.className">{{item.amount}}</span>
                </p>
                <p>
                    <span class="balance">余额:{{item.balance}}</span> <span class="time">{{item.createDate}}</span>
                </p>
            </li>
        </ul>
    </div>
</template>

<script>
import { path, dataConfig, getLoginInfo, isBindPhone } from "@/utils/index";

export default {
  data() {
    return {
      recordData: []
    };
  },
  onLoad() {
    this.getWallet();
  },
  onShow() {
    this.getWallet();
  },
  methods: {
    getWallet() {
      let url = path.getQueryDetail;
      let loginInfo = getLoginInfo();
      let queryData = {
        userId: loginInfo.userid
      };
      this.$fly.post(url, queryData).then(data => {
        data.forEach(item => {
          item.amount = item.amount.toFixed(2);
          if (item.operationCode === "03") {
            item.className = "start";
          } else {
            item.className = "end";
            if(item.amount.indexOf("-") != -1 ){
              item.amount = item.amount;
            }else{
              item.amount = "+" + item.amount;
            }
          }
        });
        this.recordData = data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
  height: 100vh;
  background-color: #f3f3f3;
  padding: 10px 0 0 0;
  .record {
    list-style: none;
    // padding: 10px 0 0 0;
    .record_li {
      width: 100%;
      height: 68px;
      background-color: #ffffff;
      border-top: 2rpx solid #f3f3f3;
      p {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        line-height: 34px;
        margin: 0 10px 0 10px;
        font-size: 32rpx;
        .start {
          color: #5c8bed;
        }
        .end {
          color: #FFA800;
        }
      }
      .balance {
        color: #999999;
        font-size: 28rpx;
      }
      .time {
        color: #999999;
        font-size: 28rpx;
      }
    }
  }
  .no-record {
    text-align: center;
  }
}
</style>
