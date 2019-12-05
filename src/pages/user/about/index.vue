<template>
  <div class="bigbox">
    <div class="title">
      <img src="http://bqyx-qiniu.bqrzzl.com//mp/logo.png" alt>
    </div>
    <div class="version">
      <p>版本号：V{{version}}</p>
    </div>
    <div
      class="wenzi"
    >&nbsp;&nbsp;“佰仟易行”App是一款通过整合车商、车源、金融及车后市场服务资源，建设围绕车主和汽车的一站式服务平台。与传统的汽车分期不同，佰仟易行的客户在选择购车时金融方案更灵活，以租赁的方式使用车辆，一年期满后，可选择尾期分期将车辆过户至自己名下，或直接放弃车辆。且裸车款、购置税、牌照费用、保险等费用都可作为分期付款对象，采用打包租赁的方式，降低购车初期支付的负担。结合当下热销车型，打包车+金融的产品方案，带给消费者更加轻松便捷的用车体验，不需再初期投入过高的用车成本，金融方案灵活、审批手续简单便捷，让时尚用车与轻松想用都可兼得。</div>
  </div>
</template>

<script>
import { path, dataConfig } from "@/utils/index";
export default {
  components: {},

  data() {
    return {
      version: dataConfig.version,
      personalInfo: {}
    };
  },
  onLoad() {}
};
</script>

<style lang="scss" scoped>
.bigbox {
  .title {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 60px;
    img {
      width: 100px;
      height: 100px;
    }
  }
  .version {
    text-align: center;
    margin: 20px 0;
    color: #333333;
    font-size: 20px;
    font-weight: 600;
  }
  .wenzi {
    padding: 10px;
    color: #333;
    font-size: 28rpx;
  }
}
</style>
