<template>
 <div class="bigbox">
	<div class="question-label">
    <p>常见问题</p>
  </div>
	<div class="question-box">
		<ul>
			<li v-for="item in questions" :key="item.text">
				<div class="question-title">
					<p class="title-detail" @click="toggle(item,'down')">
            {{item.text}}
            <img class="icon" v-if="item.up" src="/static/img/la_up.png">
            <img class="icon" v-if="item.down" src="/static/img/la_down.png">
          </p>
				</div>
				<div v-show="item.up" class="question-answer"><p>{{item.answer}}</p></div>
			</li>
		</ul>
	</div>
</div>
</template>

<script>
export default {
  components: {},

  data() {
    return {
      questions: [
        {
          up: false,
          down: true,
          text: "1.是否能看车",
          answer: "我们店里有部分现车，您可以到店看车。"
        },
        {
          up: false,
          down: true,
          text: "2.车的颜色是否可以选择",
          answer: "我们购买的车辆以大众色为主，您可以选择心仪的颜色。"
        },
        {
          up: false,
          down: true,
          text: "3.购买的保险险种有哪些",
          answer: "第三者险100万，车损、盗抢、不计免赔，乘意险1万/座，涉水险等。"
        },
        {
          up: false,
          down: true,
          text: "4.下单后多久能提车",
          answer: "7个工作日左右，具体时间您签约前可和工作人员确定。"
        },
        {
          up: false,
          down: true,
          text: "5.目前哪些城市可以申请",
          answer: "目前上牌城市为济南、连云港、西昌、成都、湛江、佛山、揭阳、韶关、肇庆、珠海、东莞、福州、锦州、吉林、银川、长沙，申请城市不限，周边城市可以申请。"
        }
      ]
    };
  },

  created() {},

  methods:{
    toggle(question){
      if(question.up === true ){
        question.up = false;
        question.down = true;
      }else{
        question.up = true;
        question.down = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.bigbox {
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: 100%;
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
      //background: url("../../../static/img/backBtn2.png") no-repeatcenter/100%;
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
.question-label {
  height: 0.5rem;
  margin-top: 0.4rem;
  padding-left: 0.3rem;
  p {
    height: 0.27rem;
    line-height: 0.27rem;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    font-size: 0.28rem;
    color: rgba(136, 136, 136, 1);
  }
}
.question-box {
  width: 100%;
  background: #fff;
  li {
    position: relative;
  }
  li:after{
    content: ' ';
    position:absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #e5e5e5;
    color: #e5e5e5;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .question-title {
    height: 1rem;
    .title-detail {
      display: inline-block;
      padding-left: 0.3rem;
      height: 1rem;
      line-height: 1rem;
      font-size: 0.32rem;
      font-weight: 400;
      color: rgba(0, 0, 0, 1);
      font-family: PingFangSC-Regular;
      position: relative;
      width: 100%;
      box-sizing: border-box;
      .icon {
        width: 0.22rem;
        height: 0.12rem;
        position: absolute;
        right: 0.29rem;
        top: 50%;
        -webkit-transform: translateY(-50%);
      }
    }
    .answer-icon-up {
      display: inline-block;
      margin-right: 0.3rem;
      margin-top: 0.45rem;
      width: 0.22rem;
      height: 0.12rem;
      //background: url("../../../../static/img/la_up.png") no-repeat center/100%;
    }
    .answer-icon-down {
      display: inline-block;
      margin-right: 0.3rem;
      margin-top: 0.45rem;
      width: 0.22rem;
      height: 0.12rem;
      //background: url("../../../../static/img/la_down.png") no-repeat center/100%;
    }
  }
  .question-answer {
    padding: 0 0.55rem;
    padding-bottom: 0.2rem;
    p {
      font-size: 0.28rem;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
    }
  }
}
</style>
