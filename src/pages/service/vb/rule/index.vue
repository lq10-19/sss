<template>
  <div class="main">
    <h1>一、什么是V币</h1>
    <p>V币，是佰仟为感谢广大用户的支持与厚爱，根据用户 佰仟易行APP或小程序进行操作推出的一项长期回馈计划。</p>
    <p>您的V币越多，您能够兑换的奖品将越多，同时享受到的优惠越多。</p>
    <h1>二、如何获得V币</h1>
    <p>用户可通过在佰仟易行APP或小程序进行实际操作获得V币：</p>
    <table>
      <tr>
        <th>V币来源</th>
        <th>V币数量</th>
        <th>备注</th>
      </tr>
      <tr>
        <td>首次登录刮奖</td>
        <td>10/20/30/50/100</td>
        <td>首次登陆V币奖励随机</td>
      </tr>
      <tr>
        <td>签到</td>
        <td>10/10/10/20/20/20/30</td>
        <td>按7天周期获得签到V币</td>
      </tr>
      <tr>
        <td>商城订单返V币</td>
        <td>订单金额x50%</td>
        <td></td>
      </tr>
      <tr>
        <td>金融订单返V币</td>
        <td>订单金额x2%</td>
        <td></td>
      </tr>
      <tr>
        <td>电子签约返V币</td>
        <td>100</td>
        <td></td>
      </tr>
      <tr>
        <td>预留信息</td>
        <td>100</td>
        <td>买车或抵押贷款预留信息</td>
      </tr>
      <tr>
        <td>查看常见问题返V币</td>
        <td>20</td>
        <td></td>
      </tr>
      <tr>
        <td>意见反馈</td>
        <td>20</td>
        <td></td>
      </tr>
      <tr>
        <td>活动获得V币</td>
        <td>活动获得V币</td>
        <td></td>
      </tr>
    </table>
    <h1>三、如何查询V币</h1>
    <p>在佰仟易行APP和佰仟易行微信小程序——我的——我的V币栏目可以查询到V币余额情况。</p>
    <h1>四、如何使用V币及V币定价</h1>
    <p>1、在积分商城页面使用V币兑换商品，100V币=1元，按照商品价值进行兑换，成功则扣除相应的V币。（兑换商品的价值是按照市场价折算成V币的）</p>
    <p>2、消耗相应的V币进行抽奖，大转盘活动奖品可设置各种优惠券。</p>
    <h1>五、V币的有效期</h1>
    <p>所获得的V币长期有效。</p>
    <h1>六、违规处理</h1>
    <p>如果用户利用系统漏洞或者作弊等违规方式获取V币，经查实将冻结账号并追缴相关V币，并保留追究相应法律责任的权利。</p>
    <h1>七、修订及终止</h1>
    <p>佰仟租赁有权根据运营需求随时对本规则进行调整，实行结果以实际公布内容为准。（包括但不限于活动起止、V币计算等）</p>
  </div>
</template>
<script>
  export default {
    components: {},
    data() {
      
    },
    onLoad(options) {
      
    },
    onShow() {
      
    },
    onReady() {
      
    },
    methods: {

    }  
  };

</script>

<style lang="scss" scoped>
.main{
  margin: 30rpx;
}
h1{
  font-size: 30rpx;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  line-height: 60rpx;
  margin: 10rpx auto;
}
p{
  font-size: 28rpx;
  font-weight: 400;
  color: rgba(102,102,102,1);
  line-height: 40rpx;
  text-indent: 56rpx;
  margin: 15rpx auto;
}
tr{
  display: flex;
}
td,th{
  border: 1rpx solid rgba(51,51,51,1);
  flex-basis: 33.33%;
  font-size: 20rpx;
  height: 50rpx;
  text-align: center;
  line-height: 50rpx;
}
th{
  font-weight: 500;
  height: 70rpx;
  line-height: 70rpx;
}
td{
  border-top: none;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
}
</style>
