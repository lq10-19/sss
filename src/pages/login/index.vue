<template>
  <div class="login-page">
    <div class="login-icon">
      <img src="http://bqyx-qiniu.bqrzzl.com//mp/logo.png?123456">
    </div>
    <div class="welcome">
      <p>佰仟易行</p>
      <p>欢迎您</p>
    </div>
    <div class="explain">
      <p>请微信授权登录后放心使用佰仟易行</p>
      <p>你的信息和数据将受到保护</p>
    </div>
    <button open-type="getUserInfo" @getuserinfo="onGotUserInfo" lang='zh_CN'>微信授权登录</button>
  </div>
</template>

<script>
import utils from "@/utils/index";
export default {
  components: {},

  data() {
    return {};
  },

  created() {},

  methods: {
    toLogin(userInfo, encryptedData, iv) {
      wx.showToast({
        title: "登录中...",
        image: "/static/icon/loading.gif",
        duration: 1000 * 1000
      });
      let url = utils.path.login;
      let postData = Object.assign({}, userInfo);
      postData.appid = utils.dataConfig.appid;
      postData.secret = utils.dataConfig.secret;
      postData.type = 7; //小程序登录类型
      postData.encryptedData = encryptedData;
      postData.iv = iv;
      postData.nickname = postData.nickName;
      postData.avatarurl = postData.avatarUrl;
      postData.sex = postData.gender;
      delete postData.nickName;
      delete postData.avatarUrl;
      delete postData.gender;
      wx.login({
        success: res => {
          if (res.code) {
            postData.code = res.code;
            this.trayLogin(postData)
              .then(data => {
                wx.hideToast();
                if (null !== data.userid) {
                  //登录成功
                  utils.setLoginInfo(data);
                  wx.navigateBack({
                    delta: 1
                  });
                } else {
                  wx.showToast({
                    title: "登录异常,无用户数据",
                    icon: "none"
                  });
                }
              })
              .catch(e => {
                console.log(e);
                wx.hideToast();
                if (e.data.code === -1) {
                  wx.showToast({
                    title: "登录失败，请重试",
                    icon: "none"
                  });
                } else {
                  wx.showToast({
                    title: "登录异常",
                    icon: "none"
                  });
                }
              });
          } else {
            wx.hideToast();
            wx.showToast({
              title: res.errMsg,
              icon: "none"
            });
          }
        },
        fail: e => {
          console.log(e);
          wx.hideToast();
          wx.showToast({
            title: "登录异常(wx.login)",
            icon: "none"
          });
        },
        timeout: 5000
      });
    },
    onGotUserInfo(e) {
      let info = e.target;
      if (info.userInfo) {
        utils.setUserInfo(info.userInfo);
        this.toLogin(info.userInfo, info.encryptedData, info.iv);
      } else {
        wx.showToast({
          title: "授权登录失败",
          icon: "none"
        });
      }
    },
    trayLogin(postData) {
      return new Promise((resolve, reject) => {
        try {
          let url = utils.path.login;
          let first = this.$fly.post(url, postData);
          console.log(postData);
          first.then(data => resolve(data));
          first.catch(e => {
            console.log(e);
            let again = this.$fly.post(url, postData);
            again.then(data => resolve(data));
            again.catch(e => reject(e));
          });
        } catch (error) {
          reject(error);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
$jbColorTop: rgba(255,224,86,1);
$jbColorBottom: #FFCC00;
.login-page {
  .login-icon {
    width: 100%;
    height: 1.4rem;
    margin-top: 35px;
    img {
      display: block;
      width: 1.4rem;
      height: 1.4rem;
      margin: 0 auto;
    }
  }
  .welcome {
    font-size: 18px;
    color: #333333;
    font-weight: 600;
    margin: 35px auto 0 auto;
    text-align: center;
  }
  .explain {
    margin: 43px auto 0 auto;
    font-size: 15px;
    color: #333333;
    text-align: center;
  }
  button {
    margin-top: 40px;
    width: 290px;
    height: 45px;
    background: linear-gradient(
      180deg,
      $jbColorTop,
      $jbColorBottom
    );
    border-radius: 45px;
    color: #000;
  }
  button:after{
    border:none;
  }
}
</style>
