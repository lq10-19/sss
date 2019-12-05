<template>
  <div style="background:#fff;height:100%;">
    <div class="bigBox clearfix">
      <div class="brandBox">
        <div class="typeBox">
            <p class="commonTitel">热门品牌</p>
            <ul class="clearfix">
                <li v-for="(item,index) in hotBrandData" :key="index" @click="toCarList(item.brandId)">
                  <img :src="item.imgAddress" alt=""><p>{{item.brandName}}</p>
                </li>
            </ul>
        </div>
        <div class="typeBox">
            <p class="commonTitel">全部品牌</p>
            <ul class="clearfix">
                <li v-for="(item,index) in allBrandData" :key="index" @click="toCarList(item.brandId)">    
                  <img :src="item.imgAddress" alt=""><p>{{item.brandName}}</p>
                </li>
            </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { path, dataConfig, apiFail } from "@/utils/index";
export default {
  components: {},

  data() {
    return {
      //热门品牌
      hotBrandData: [],
      //全部品牌
      allBrandData: []
    };
  },
  onShow() {
    this.getBrandData();
    this.getAllBrandData();
  },
  methods: {
    getBrandData() {
      //获取热门品牌
      let url = path.hotBrand;
      var queryData = { brandStateId: dataConfig.hotCarId };
      this.$fly
        .post(url, queryData)
        .then(data => {
          this.hotBrandData = data;
        })
        .catch(err => apiFail(err));
    },
    getAllBrandData() {
      //全部品牌
      var url = path.queryBrandList;
      this.$fly
        .post(url)
        .then(data => {
          this.allBrandData = data;
        })
        .catch(err => apiFail(err));
    },
    toCarList(brandId) {
      const url = `../car/main?brandId=${brandId}`;
      wx.navigateTo({ url });
      wx.showToast({
        title: "加载中...",
        image: "/static/icon/loading.gif",
        duration: 500
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.marginTop {
  margin-top: 1.28rem;
}
.brandTab {
  width: 2rem;
  position: fixed;
  left: 0;
  height: 100%;
  border-right: 1px solid #eee;
  background: #fff;
  ul {
    margin-top: 0.48rem;
    margin-left: 0.2rem;
    li {
      width: 1.6rem;
      height: 0.56rem;
      background: linear-gradient(
        -90deg,
        rgba(255, 92, 93, 1),
        rgba(255, 130, 92, 1)
      ) !important;
      border-radius: 0.28rem;
      padding-top: 0;
      p {
        font-size: 0.28rem;
        color: rgba(255, 255, 255, 1);
        line-height: 0.56rem;
        text-align: center;
      }
    }
  }
}
.brandTop {
  top: 1.28rem;
}
.brandBox {
  overflow-x: hidden;
  .typeBox {
    padding-top: 0.44rem;
    padding-bottom: 0.3rem;
  }
  .commonTitel {
    font-size: 0.34rem;
    font-weight: 700;
    color: rgba(0, 0, 0, 1);
    padding-left: 0.3rem;
  }
  ul {
    li {
      display: inline-block;
      width: 1.82rem;
      margin-top: 0.5rem;
      img {
        width: 0.8rem;
        height: 0.8rem;
        display: block;
        margin: 0 auto;
      }
      p {
        font-size: 0.26rem;
        font-weight: 400;
        color: rgba(1, 1, 1, 1);
        text-align: center;
        margin-top: 0.2rem;
        line-height: 0.4rem;
      }
    }
  }
}
</style>
