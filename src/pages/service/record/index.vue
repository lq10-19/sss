<template>
  <div class="main">
    <div v-if="recordData.length === 0" class="no-record">暂无记录</div>
    <div class="record" v-for="(item,index) in recordData" :key="index" @click="getRecard">
      <div class="record_li">
        <p class="p_money">
          <span>
            充值{{item.rechargeAmount}}元
            <span :class="[item.className]">{{item.statusText}}</span>
          </span>
          <span>{{item.payAmount}}元</span>
        </p>
        <p class="p_card">
          <span>卡号：{{item.oilCardId}}</span>
          <span>{{item.createDate}}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { path, dataConfig, getLoginInfo, isBindPhone } from "@/utils/index";

export default {
  data() {
    return {
      recordData: [],
      statusType: { "3": "充值成功", "2": "充值失败", "1": "充值中" }
    };
  },
  onShow() {
    this.getRecard();
  },
  methods: {
    getRecard() {
      let url = path.getRechargeRecord;
      let loginInfo = getLoginInfo();
      let queryData = {
        userId: loginInfo.userid
      };
      this.$fly.post(url, queryData).then(data => {
        data.forEach(item => {
          switch (item.status) {
            case 1:
              item.statusText = "充值中";
              item.className = "success";
              break;
            case 2:
              item.statusText = "充值失败";
              item.className = "fail";
              break;
            case 3:
              item.statusText = "充值成功";
              item.className = "success";
              break;
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
  width: 100%;
  height: 100vh;
  background-color: #f3f3f3;
  padding: 10px 0 0 0;
  .record {
    .record_li {
      width: 95%;
      height: 68px;
      background-color: #ffffff;
      padding-left: 14px;
      padding-right: 14px;
      border-top: 2rpx solid #f3f3f3;
      p {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        line-height: 34px;
        margin: 0 10px 0 10px;
      }
      .p_money {
        color: #000;
        font-size: 16px;
        .success {
          font-size: 22rpx;
          margin-left: 12rpx;
          background-color: #4dcf5f;
          color: white;
        }
        .fail {
          font-size: 22rpx;
          margin-left: 12rpx;
          background-color: #ffca57;
          color: white;
        }
      }
      .p_card {
        color: #999999;
        font-size: 13px;
      }
    }
  }
  .no-record {
    text-align: center;
  }
}
</style>
