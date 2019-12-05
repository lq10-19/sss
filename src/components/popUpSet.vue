<template>
    <cover-view class="pop-up" v-if="popUp">
      <cover-view class="pop-up-item">
        <cover-view class="pop-up-item_p border-bottom-1px">立即前往小程序设置</cover-view>
        <cover-view class="pop-up-item_bar"></cover-view>
        <cover-view class="pop-up-item_d">
          <button class="pop-up-item_d--btn  pop-up-item_d--down" @click="$emit('update:popUp',false)">取消</button>
          <cover-view class="pop-up-item_d--slider"></cover-view>
          <button  open-type="openSetting" @click="bindopensetting" class="pop-up-item_d--btn border-right-1px pop-up-item_d--sure">确定</button>
        </cover-view>
      </cover-view>
    </cover-view>
</template>

<script>
    export default {
        name: "popUpSet",
        props:{
          popUp:{
            type:Boolean,
            default:false
          }
        },
        methods:{
          bindopensetting(){
            this.$emit('update:popUp',false)
          }
        },
    }
</script>

<style scoped lang="less">
  @import url('../../common/styles/mixins.less');
  .pop-up {
    width: 100%;
    width: 100vw;
    min-height: 100%;
    min-height: 100vh;
    position: fixed;
    background:rgba(0,0,0,.2);
    left: 0;
    top:0;
    z-index: 20;
    &-item {
      width: 260px;
      height: 280 rpx;
      background: #fff;
      margin: 215px auto 0;
      border-radius: 10px;
      &_bar{
        width: 100%;
        height: 1rpx;
        background: #BBBBBB;
      }
      &_p{
        width: 520 rpx;
        height:198rpx;
        line-height: 198rpx;
        text-align: center;
        font-size: 32rpx;
        color:#6D6D6D;
      }
      &_d{
        overflow: hidden;
        width:100%;
        &--btn{
          width:259rpx;
          height:80rpx;
          padding: 0;
          background: #fff;
          font-size: 36rpx;
          line-height: 80rpx;
          text-align: center;
          color:#737373;
          float: left;
          border-radius: 0;
        }
        &--sure{
          color:#0088BB;
        }
        &--slider{
          width: 1rpx;
          height: 80rpx;
          float: left;
          background:#BBBBBB;
        }
        &--down{
          &::after,&::before{
            display: none;
          }
        }
      }
    }
  }

</style>
