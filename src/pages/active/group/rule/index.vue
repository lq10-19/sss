<template>
  <div class="main">
    <div class="box" v-if="isHaveData">
      <img class="nullImg" src="/static/img/group/wu@2x.png">
      <p class="nullTxt">暂时没有信息~</p>
    </div>
    <div :style="{'min-height': windowHeight+'rpx'}">
      <p class="rule-text" v-for="(item,index) in rules" :key="index">{{item.rule}}</p>
    </div>
  </div>
</template>
<script>
  import {
    path,
    dataConfig,
    getUserInfo,
    isBindPhone,
    getLoginInfo,
    apiFail,
    showLoading,
    hideLoading,
    isHuaWei,
    isOppo,
    getSystemInfo,
    event,
    compareVersion,
    link,
    getSceneCode,
    setSceneCode
  } from "@/utils/index";
  import {
    setTimeout
  } from 'timers';
  export default {
    components: {},
    data() {
      return {
        windowHeight: '',
        rules: '',
        isHaveData: false
      };
    },
    onLoad(options) {
      
    },
    onShow() {
      this.getRules();
    },
    onReady() {
      let that = this;
      wx.getSystemInfo({
        success({
          windowHeight
        }) {
          console.log(windowHeight, 11)
          that.windowHeight = windowHeight * 2 - 60;
        }
      });
    },
    methods: {
      getRules() {
        let url = path.getGroupRules;
        let promise = this.$fly.get(url, {});
        showLoading(promise);
        promise
          .then(data => {
            console.log(data, 111)
            if (data && data.length > 0) {
              this.rules = data
            } else if (data && data.length == 0) {
              this.isHaveData = true;
            } else {
              apiFail(e);
            }
            // console.log(this.rules);
          })
          .catch(e => {
            apiFail(e);
          });
      }
    }
  };

</script>

<style lang="scss" scoped>
  .main {
    min-height: 100%;
    padding: 2% 4%;
    background-color: #F2F3F5;

    .rule-text {
      color: #000000;
      margin: 0.4rem 0;
      font-size: 0.32rem;
      font-family: 'PingFangSC-Regular';
    }
  }
.box {
  width: 92%;
  margin: 0.2rem auto;
  .nullImg {
    width: 3rem;
    height: 2rem;
    display: block;
    margin: 0 auto;
    margin-top: 3rem;
  }
  .nullTxt {
    width: 50%;
    margin: 0 auto;
    margin-top: 0.5rem;
    text-align: center;
    color:rgba(208, 208, 208, 1);
    font-size: 0.3rem;
  }
}    
</style>
