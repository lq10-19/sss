<template>
  <div class="bigbox">
    <div class="suggest-box">
      <textarea v-model="message" placeholder="请填写意见或反馈"></textarea>
    </div>

    <div class="sub-btn">
      <button @click="submit"><p>提交</p></button>
    </div>
  </div>
</template>

<script>
import { path, dataConfig ,getLoginInfo ,isBindPhone, apiFail} from "@/utils/index";
export default {
  components: {},

  data() {
    return {
      message: "",
      isSubmit: false
    };
  },

  created() {},
  methods: {
    submit() {
      if (this.isSubmit) {
        return;
      }
      this.message = this.message.trim();
      if (this.message.length === 0) {
        wx.showToast({
          title: "请填写建议内容",
          icon: "none"
        });
        return;
      }
      let url = path.feedback;
      let loginInfo = getLoginInfo();
      let postData = {
        feedbackContent: this.message,
        userId: loginInfo.account,
        userName: loginInfo.account,
        account: loginInfo.account,
      };
      this.isSubmit = true;
      this.$fly
        .post(url, postData)
        .then(data => {
          this.isSubmit = false;
          wx.showToast({
            title: "提交成功",
            icon: "none",
            complete: () => {
              setTimeout(function() {
                wx.navigateBack({
                  delta: 1,
                });
              }, 1500);
            }
          });
          //反馈V币任务
          console.log(this.$root.$mp.query.taskId);
          if(this.$root.$mp.query.taskId){
            //领取奖励
            let url = path.getTaskReward;
            let queryData = {
              userId: getLoginInfo().userid,
              taskId: this.$root.$mp.query.taskId
            }
            let promises = this.$fly.post(url, queryData);
            promises.then(data => {
              console.log("suggest")
            })
            .catch(e => {
              apiFail(e);
            });
          }
        })
        .catch(err => {
          this.isSubmit = false;
          wx.showToast({
            title: "网络异常",
            icon: "none"
          });
        });
      return false;
    }
  }
};
</script>

<style lang="scss" scoped>
$jbColorTop: rgba(255,224,86,1);
$jbColorBottom: #FFCC00;
.margTop {
  margin-top: 0.84rem !important;
}
.bigbox {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f6f6f6;
}
.header {
  width: 100%;
  height: 0.8rem;
  background: #fff;
  .header_left {
    width: 0.21rem;
    height: 100%;
    float: left;
    margin-left: 0.3rem;
    p {
      width: 0.21rem;
      height: 0.39rem;
      margin-top: 0.2rem;
    }
  }
  .header_center {
    height: 100%;
    width: 3rem;
    float: left;
    margin-left: 25%;
    p {
      height: 0.8rem;
      font-size: 0.36rem;
      font-weight: 700;
      text-align: center;
      line-height: 0.8rem;
      font-family: PingFangSC-Medium;
      color: rgba(0, 0, 0, 1);
    }
  }
  .header_right {
    width: 1rem;
    height: 100%;
    float: right;
    margin-right: 0.3rem;
    p {
      height: 0.8rem;
      font-size: 0.36rem;
      text-align: center;
      line-height: 0.8rem;
    }
  }
}

.suggest-box {
  background: #fff;
  height: 4.6rem;
  margin-top: 0.4rem;
  border-radius: 0.3rem;
  margin-left: 0.3rem;
  margin-right: 0.3rem;
  textarea {
    height: 95%;
    font-size: 0.28rem;
    color: #999;
    padding: 0.38rem 0.3rem;
  }
}

.sub-btn {
  width: 100%;
  height: 0.9rem;
  margin-top: 0.5rem;
  button {
    display: block;
    margin: 0 auto;
    width: 5.8rem;
    height: 0.9rem;
    border: none;
    background: linear-gradient(
      180deg,
      $jbColorTop,
      $jbColorBottom
    );
    border-radius: 0.45rem;
    p {
      display: inline-block;
      width: 0.99rem;
      height: 0.9rem;
      font-size: 0.36rem;
      font-family: PingFangSC-Regular;
      font-weight: 500;
      color: rgba(0,0,0,1);
      line-height: 0.9rem;
    }
  }
  button:after{
    border: none;
  }
}
</style>
