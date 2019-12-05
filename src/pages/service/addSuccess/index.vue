<template>
  <div class="bigbox">
    <div class="success_icon">
      <img class="img" src="/static/img/server/add_success.png" alt="">
    </div>
    <div class="success_tip">
      <p>{{title}}</p>
    </div>
    <div class="finish_btn"><button @click="goService">完成</button></div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      title: "添加成功"
    };
  },
  methods: {
    goService() {
      wx.switchTab({
        url: "/pages/service/service/main"
      });
    }
  },
  onLoad(query) {
    this.title = query.title;
  }
};
</script>


<style lang='scss' scoped>
.bigbox {
  position: fixed;
  width: 100%;
}
.success_icon {
  width: 100%;
  height: 1.8rem;
  margin-top: 2.8rem;
  .img {
    display: block;
    width: 1.8rem;
    height: 1.8rem;
    margin: 0 auto;
  }
}
.success_tip {
  width: 100%;
  height: 0.5rem;
  margin-top: 0.61rem;
  p {
    width: 100%;
    height: 0.5rem;
    line-height: 0.5rem;
    font-size: 0.32rem;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    text-align: center;
  }
}

.finish_btn {
  width: 100%;
  height: 0.9rem;
  margin-top: 0.61rem;
  button {
    display: block;
    width: 5.8rem;
    height: 0.9rem;
    margin: 0 auto;
    background: linear-gradient(
      -90deg,
      rgba(255, 92, 93, 1),
      rgba(255, 130, 92, 1)
    );
    border-radius: 0.45rem;
    text-align: center;
    font-size: 0.36rem;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
  }
}
</style>