
//环境切换
let isTest = process.env.isTest;
//api接口
let baseUrl = '';
let apiUrl = "";
let apiTwoUrl = "";
let apiUrlSit = "";
let shop = "";
let weChatPublic = "";
let apiNewYear = "";
let goods = "";
let news = "";
let group = "";
let wxPhone = "";
let djcx = "";
let vb = "";
let qiNiuPhoto = "";
let cdd = "";
switch (isTest) {
  //测试环境
  case true:
    console.log("当前环境:测试");
    baseUrl = 'https://bqyx.bqzulin.com';
    apiUrl = `${baseUrl}/bqyx/homepage/`;
    apiTwoUrl = `${baseUrl}/bqyx/thirdparty/`;
    apiUrlSit = `${baseUrl}/bqyx/activity/`;
    shop = `${baseUrl}/mall`;
    cdd = `${baseUrl}/cdd/`;
    //cdd = `http://10.81.2.14:8080/`;
    //会佳本地
    //shop = "http://10.81.2.201/dist";
    weChatPublic = "https://uatwx.bqzulin.com";
    // apiNewYear = "http://szxhrzzlit035.bf.cn:8015/"
    apiNewYear = "https://bqyx.bqzulin.com/bqyx/activity/";
    // apiUrl = "http://10.81.2.218:8012/";
    // apiTwoUrl = "http://10.81.2.218:8012/bqyx/"; 
    //apiUrlSit = "http://10.81.2.152:8015/";
    goods = `${baseUrl}/bqyx/goods/`;
    // weChatPublic = "http://10.81.2.218:8003/bqyx/thirdparty/";
    wxPhone = `${baseUrl}/bqyx/thirdparty/crawlType/`;
    break;
  //生产环境
  case false:
    console.log("当前环境:生产");
    baseUrl = 'https://bqyxapi.bqrzzl.com';
    apiUrl = `${baseUrl}/bqyx/homepage/`;
    apiTwoUrl = `${baseUrl}/bqyx/thirdparty/`;
    apiUrlSit = `${baseUrl}/bqyx/activity/`;
    shop = `https://bqyxh5.bqrzzl.com/mall`;
    cdd = `https://bqyxh5.bqrzzl.com/cdd/`;
    weChatPublic = "https://car.bqrzzl.com";
    goods = `${baseUrl}/bqyx/goods/`;
    wxPhone = `${baseUrl}/bqyx/thirdparty/crawlType/`;
    //七牛云图片配置
    qiNiuPhoto = "http://bqyx-qiniu.bqrzzl.com";
    break;
}


export const path = {
  //热门品牌
  hotBrand: apiUrl + "queryRankingsbrandList",
  //爆款推荐
  carHot: apiUrl + "queryProductInfoByProductStateIdList",
  //产品详情
  carModelInfo: apiUrl + "queryCarModelInfo",
  // 车辆中心列表
  artcList: apiUrl + "queryCarServiceList",
  // 获取城市信息
  carCityList: apiUrl + "queryCarCityList",
  // 新增保存车辆信息
  addCarServiceInfo: apiUrl + "addCarServiceInfo",
  // 编辑保存车辆信息
  updateCarServiceInfo: apiUrl + "updateCarServiceInfo",
  // 删除个人车辆信息
  delCarServiceInfo: apiUrl + "delCarServiceInfo",
  // 违章查询
  carViolation: apiTwoUrl + "get/carViolation",
  // 牌照前缀
  cayCityChek: apiTwoUrl + "get/cayCityChek ",
  // 个人车辆信息  //车辆中心列表
  myCarINfo: apiUrl + "queryCarServiceList",
  // 张松,获取城市信息
  myCity: apiTwoUrl + "get/city",
  queryBrandList: apiUrl + "queryBrandList",
  myCarINfo: apiUrl + "queryCarServiceList",
  feedback: apiUrl + "feedbackContent",
  saveCarApplication: apiUrl + "saveCarApplication",
  register: apiUrl + "bqzl/user/register",
  login: apiUrl + "bqzl/user/login",
  cayChek: apiTwoUrl + "get/cayChek",
  //获取所有充值卡的接口
  getAllSetting: apiUrlSit + "oilCardSetting/getAllSetting",
  //绑定油卡
  bindOilCard: apiUrlSit + "oilCard/binding",
  //切换油卡（主卡）
  getOilCardChange: apiUrlSit + "oilCard/changeCard",
  //获取用户绑定的油卡
  getOilCard: apiUrlSit + "oilCard/getAllCard",
  //解绑
  getDeleteCard: apiUrlSit + "oilCard/unbinding",
  //查看充值记录
  getRechargeRecord: apiUrlSit + "oilCard/rechargeDetail",
  //账户明细 
  getQueryDetail: apiUrlSit + "account/queryDetail",
  //账户金额 
  getQueryBalance: apiUrlSit + "account/queryBalance",
  //油卡充值
  getRecharge: apiUrlSit + "oilCard/recharge",
  //充值结果
  rechargeResult: apiUrlSit + "oilCard/rechargeResult",
  //活动
  getActivity: apiUrlSit + "redpacket/getActivity",
  //开红包
  getRedopen: apiUrlSit + "redpacket/open",
  getRedopen2: apiUrlSit + "redpacket/open2",
  //微信支付
  goWxPay: apiUrlSit + "oilCard/rechargePaid",
  //获取车类分区
  getProductStatuslist: apiUrl + "getProductStatuslist",
  //模糊搜索
  getSearch: apiUrl + "queryBrandProductLike",
  //提现
  getMoney: apiUrlSit + "account/withdrawCash",
  //提现验证码
  getCodeRecord: apiUrlSit + "account/getVerifyCode",
  //获取短信验证码 
  getCode: apiUrl + "bqzl/user/getVerifyCode",
  //手机验证登录
  goVerifyCode: apiUrl + "bqzl/user/login",
  //获取验证码(三方服务)
  getVerifyCode: apiTwoUrl + "shortMsg/getVerifyCode",
  //校验短信验证码
  checkVerifyCode: apiTwoUrl + "shortMsg/checkVerifyCode",
  shareBg: apiUrlSit + "getPoster",//海报背景
  shareSignBg: apiUrlSit + "getDailySignPoster",//签到海报背景
  shareScanBg: apiUrlSit + "getDailyScanPoster",//AI扫车海报背景
  shareImg: baseUrl + '/bqyx/thirdparty/miniprogram/getWXACodeUnlimit',//海报二维码
  imgCode: apiUrlSit + "dynamicCode/get",
  //H5分享
  shareTime: apiUrlSit + "luckyDraw/addTimes",
  //签到接口
  //doSign: apiUrlSit + "dailySign/doSign",
  //打开签到红包
  openPacket: apiUrlSit + "dailySign/openPacket",
  //获取用户是否已签到
  getSignFlag: apiUrlSit + "dailySign/getSignFlag",
  //获取签到红包规则
  getRules: apiUrlSit + "dailySign/getRules",
  saveInvitation: apiUrlSit + "dailySign/saveInvitation",
  clickSign: apiUrlSit + "dailySign/clickSign",
  //拜年-创建组织
  groupMainSave: apiUrlSit + "groupMain/saveGroupMain",
  //拜年-新增组织记录
  saveGroupUserInfo: apiUrlSit + "groupUserInfo/saveGroupUserInfo",
  //拜年-查询用户组织列表 
  queryMyOrganization: apiUrlSit + "groupUserInfo/queryMyOrganization",
  queryOrganizationSquare: apiUrlSit + "/groupUserInfo/queryOrganizationSquare",
  //查询拜年记录明细
  getRecordDetail: apiUrlSit + "yearRecordInfo/recordDetail",
  saveGroupUserInfo: apiUrlSit + "groupUserInfo/saveGroupUserInfo",
  //拜年-拜年记录
  newYearRecord: apiUrlSit + "yearRecordInfo/myRecords",
  //拜年-拜年记录明细
  recordDetail: apiUrlSit + "yearRecordInfo/recordDetail",
  //选择拜年对像
  getGroupList: apiUrlSit + "groupUserInfo/queryMyOrganization",
  //组织详情
  getGroupUser: apiUrlSit + "groupUserInfo/queryOrganizationDetails",
  //获取拜年红包总金额
  getSumRedPacket: apiUrlSit + "yearRecordInfo/getSumRedPacket",
  //获取拜年红包明细
  getRedPacketDetail: apiUrlSit + "yearRecordInfo/getRedPacketDetail",
  //拜年活动规则
  getNewYearRules: apiUrlSit + "getRules/bqyx_E_001",
  //获得最近一条打赏记录
  getNearestReward: apiUrlSit + "yearRecordInfo/getNearestReward",
  //红包打赏
  redPacketPay: apiUrlSit + "yearRecordInfo/redPacketPay",
  //搜索好友
  queryByUserIdAndUserNickName: apiUrlSit + "groupUserInfo/queryByUserIdAndUserNickName",
  //创建拜年团
  saveGroupMain: apiUrlSit + "groupMain/saveGroupMain",
  //添加团员数据
  saveGroupUserInfo: apiUrlSit + "groupUserInfo/saveGroupUserInfo",
  //发送拜年信息
  sendNewYearInfo: apiUrlSit + "yearRecordInfo/save",
  //拜年发起成功 通用接口
  sendNewYearSuccess: apiUrlSit + "yearRecordInfo/recordDetail",
  //拜年发起成功专用接口
  // queryRecordByGroupMainId:apiUrlSit+"yearRecordInfo/queryRecordByGroupMainId",
  //获取最近一条红包
  getNearestReward: apiUrlSit + "yearRecordInfo/getNearestReward",
  //获取所有红包
  getAllNewYearRedBag: apiUrlSit + "yearRecordInfo/getRedPacketDetail",
  //获取祝福语
  findAll: apiUrlSit + "greetings/findAll",
  //所有拜年记录
  getAllListInfo: apiUrlSit + "yearRecordInfo/getAllListInfo",
  //是否关注公众号
  subscribe: "https://car.bqrzzl.com/api/newyear/subscribe",
  //拜年祝福语保存
  bnRecodeSave: apiUrlSit + "yearRecordInfo/save",
  //红包领取明细
  getRewardDetail: apiUrlSit + "yearRecordInfo/getRewardDetail",
  //获取活动信息
  getNewYearActivity: apiUrlSit + "getActivity",
  getSweepActivity: apiUrlSit + "getActivity",
  //向佰仟拜年
  greetBQ: apiUrlSit + "yearRecordInfo/greetBQ",
  //验证是否有向佰仟拜年过
  hasGreetedToBQ: apiUrlSit + "yearRecordInfo/hasGreetedToBQ",
  //英雄榜 - 刷新当天中奖名次前10
  getWinninglist: apiUrlSit + "getWinninglist",
  //英雄榜 - 获取所有英雄版前三名
  getHeroRanking: apiUrlSit + "getHeroRanking",
  //是否已在组织中发送消息
  hasSendToGroup: apiUrlSit + "yearRecordInfo/hasSendToGroup",
  //获取当天可扫描次数
  getEnableTimes: apiUrlSit + "arScanning/getEnableTimes",
  //识别照片
  doScanning: apiUrlSit + "arScanning/doScanning",
  //AI扫车打开红包
  openRedpacket: apiUrlSit + "arScanning/openRedpacket",
  //AI扫车保存邀请关系
  scanSaveInvitation: apiUrlSit + "arScanning/saveInvitation",
  //AI扫车规则
  getscanRules: apiUrlSit + "getRules/bqyx_F_001",
  getRunData: apiUrlSit + "step/getRunData",
  //积步领红包规则
  getaccuRules: apiUrlSit + "getRules/bqyx_G_001",
  //积步授权
  stepAuth: apiUrlSit + "step/auth",
  //积步步数要求
  getExchangeRule: apiUrlSit + "step/getExchangeRule",
  //积步排行榜
  getRankingList: apiUrlSit + "step/getRankingList",
  //积步兑换
  runExchange: apiUrlSit + "step/exchange",
  stepSaveInvitation: apiUrlSit + "step/saveInvitation",
  getStepPoster: apiUrlSit + "getStepPoster",
  getExchangeTimePeriod: apiUrlSit + "step/getExchangeTimePeriod",
  getwalletRules: apiUrlSit + "getRules/bqyx_Rule_001",
  //商品信息
  getGoodsInfo: goods + "getGoodsInfo",
  //2.获取砍价信息
  getBargainInfo: apiUrlSit + "bargain/getBargainInfo",
  //下载商品图片
  queryGoodsInfo: goods + "queryGoodsInfo",
  //下载新闻图片
  queryShareLink: apiTwoUrl + "crawl/queryShareLink",
  //获取授权电话号
  deciphering: apiTwoUrl + "wxLoginTranscoding/deciphering",
  //微信绑定手机号传后台
  updateUserMobile: wxPhone + "updateUserMobile",
  //新闻类型
  queryType: apiTwoUrl + "crawlType/queryType",
  //新闻列表
  queryShowNews: apiTwoUrl + "crawl/queryShowNews",
  //获取评论
  queryCrawlCommentMp: apiTwoUrl + "crawlCommentMp/queryCrawlCommentMp",
  //新增评论
  insertCrawlCommentMp: apiTwoUrl + "crawlCommentMp/insertCrawlCommentMp",
  //新闻详细列表
  queryLinkContent: apiTwoUrl + "crawl/queryLinkContent",
  //组团抽奖活动登陆新老用户
  queryIsNewUser: apiUrlSit + "teamLuckDraw/queryIsNewUser",
  // 获取组团规则
  getGroupRules: apiUrlSit + "getRules/bqyx_I_001",
  //新用户去参团
  queryTeam: apiUrlSit + "teamLuckDraw/queryTeam",
  //新用户参团抽奖
  insertTeam: apiUrlSit + "teamLuckDraw/insertTeam",
  //查询我的奖品
  queryMyPrize: apiUrlSit + "teamLuckDraw/queryMyPrize",
  //填写中奖收货地址
  updateDetailedAddress: apiUrlSit + "teamLuckDraw/updateDetailedAddress",
  //查询活动所有可抽奖的奖品
  queryPzizeList: apiUrlSit + "teamLuckDraw/queryPzizeList",
  //老用户我的组团
  queryMyTeam: apiUrlSit + "teamLuckDraw/queryMyTeam",
  //创建团(奖品详细)
  isertCreateTeam: apiUrlSit + "teamLuckDraw/isertCreateTeam",
  //查询该团详情
  queryOneTeamDetails: apiUrlSit + "teamLuckDraw/queryOneTeamDetails",
  //组团活动首页开关
  allActivity: apiUrlSit + "teamLuckDraw/allActivity",
  //后台接收收货地址
  updateDetailedAddress: apiUrlSit + "teamLuckDraw/updateDetailedAddress",
  //拉新用户保存记录
  insertNewUser: apiUrlSit + "teamLuckDraw/insertNewUser",
  //底价车险
  insertCarInsurance: apiUrl + "carInsurance/insertCarInsurance",
  //获取城市列表(车辆申请)
  queryLeaseCity: apiUrl + "leaseCity/queryLeaseCity",
  //生成新人礼包
  generatePackage: apiUrlSit + "giftPackage/generatePackage",
  //领取新人礼包
  openPackage: apiUrlSit + "giftPackage/openPackage",
  //V币余额
  queryBalance: apiUrlSit + "account/queryBalance",
  //V币签到信息
  doSign: apiUrlSit + "dailySign/doSign",
  //V币活动日常任务
  getTaskList: apiUrlSit + "dailyTask/getTaskList",
  //查询V币明细
  queryVcoinDetail: apiUrlSit + "account/queryVcoinDetail",
  //完成任务通知消息(组)
  getNotifyMessage: apiUrlSit + "dailyTask/getNotifyMessage",
  //确认消息通知
  confirmNotifyMessage: apiUrlSit + "dailyTask/confirmNotifyMessage",
  //领取日常任务奖励
  getTaskReward: apiUrlSit + "dailyTask/getTaskReward",
  //保存邀请信息
  saveInvitation: apiUrlSit + "dailyTask/saveInvitation",
  //统一用户信息（修改）
  updateBaseInfo: apiUrl + "unifiedUser/updateBaseInfo",
  //统一用户信息（获取）
  getInfo: apiUrl + "unifiedUser/getInfo",
  //首页活动列表
  queryActivity: apiUrlSit + "bqyxActivitySet/queryActivity",
  //七牛云token
  getAccessToken: apiTwoUrl + "qiniu/getAccessToken",
  //选车（会佳本地）
  carSelection: shop + "/#/usedCarList",
  //选车详情
  carItem: shop + "/#/usedCarDetails",
  //车辆预约查询
  getReservationList: apiUrl + "getReservationList",
  //车险预约查询
  queryCarInsurance: apiUrl + "carInsurance/queryCarInsurance",
  //二手车信息（标签查询）
  getByLabel: goods + "secondhandCar/getByLabel",
  //获取二手车标签
  getLabels: goods + "secondhandCar/getLabels",
  //获取首页二手车列表（3条）
  queryList: goods + "secondhandCar/queryList"
};
export const dataConfig = {
  version: '1.1.5',
  //热门品牌ID
  hotCarId: "234222486757376",
  appid: "wx2d9477ca5518018b",
  //小程序密钥（禁止改动）
  secret: "38321612381d0c00a00c757553e4e321",
  //secret: "04b02bb57efd78aeeea196612f2bbd25",
  sourceType: "MP",//红包、活动来源类型
  putForwardCooldownTime: 3 * 1000, //提现冷却时间
  cooldownTimeCycle: 24 * 60 * 60 * 1000,//提现冷却周期一天,毫秒
};
export const link = {
  weChatPublic: weChatPublic,
  shop: shop + "/#/mallIndex",
  bargainActive: shop + "/#/groupBargain",
  helpBargain: shop + "/#/groupBargain_2_help",
  zacx: "https://api.icp.51tsbx.com/static/agent/page/auto/html/productDetail.html?agentCode=AGENT0000000000000000&productCode=PROD06782124&isShare=BQJR&",
  paySuccess: shop + "/#/paySuccess",
  shippingAddress: shop + "/#/shippingAddress",
  mallOrders: shop + "/#/mallOrders",
  repayment: weChatPublic + "/initiative-repayment",
  fixe: shop + '/#/activePageIndex',
  cddApply: cdd + 'carInfo',
  cddQuery: cdd + 'orderList',
  cddLiveBodyBack: cdd + 'personalInfo',
  bxfq: cdd + 'carInsuranceApply',
  //bxfq: 'http://10.81.2.156:8080/carInsuranceApply',
  bxdd: cdd + 'insuranceOrderList'
}
export const event = {
  "home.czyr.apply": "车主易融-立即申请",
  "home.invitation.redbag": "邀请好友领红包",
  "product.apply": "产品-立即申请",
  "oil": "加油充值",
  "violation.enquiry": "违章查询",
  "road.condition.query": "路况查询",
  "car.evaluation": "汽车估价",
  "my.balance": "我的余额",
  "my.shop.order": "商城订单",
  "my.finance.order": "金融订单",
  "my.repayment": "我要还款",
  "my.sign": "电子签约",
  "my.address": "我的收货地址",
  "my.withdraw.cash.1": "提现步骤1",
  "my.withdraw.cash.2": "提现步骤2",
  "from": "来源",
  "group.active":"抽奖活动入口",
  "group.active.join":"抽奖活动参与人数",
};
export function apiFail(error) {
  console.log(error,789);
  wx.hideToast();
  let msg = "";
  if (error) {
    if (error.status && error.status == 500) {
      msg = "系统异常";
    } else if (error.data && error.data.message) {
      msg = error.data.message;
    }
  } else {
    msg = "系统异常";
  }
  if (msg === '') {
    msg = "系统异常";
  }
  wx.showToast({
    title: msg,
    icon: "none"
  });
};
export function getOilCard() {
  let cardId = wx.getStorageSync("cardId");
  return cardId;
};
export function allSetting() {
  let setId = wx.getStorageSync("setId");
  return setId;
};
export function getUserInfo() {
  let userInfo = wx.getStorageSync("userInfo");
  return userInfo;
};
/**
 * 授权登录的数据
 * @param {*} info 
 */
export function setUserInfo(info) {
  wx.setStorageSync("userInfo", info);
  return info;
};
export function getLoginInfo() {

  let userInfo = wx.getStorageSync("loginInfo");
  //console.log(userInfo)
  return userInfo;
};
/**
 * 登录和绑定手机号后的用户数据
 * @param {*} info 
 */
export function setLoginInfo(info) {
  wx.setStorageSync("loginInfo", info);
  return info;
};

/**
 * 是否绑定手机号,判断有无account
 */
export function isBindPhone() {
  let loginInfo = wx.getStorageSync("loginInfo");
  if (!loginInfo) {
    return false;
  }
  return !!loginInfo.account;
}

export function showLoading(...promiseList) {
  if (promiseList.length === 0) {
    wx.showToast({
      title: "加载中...",
      mask: true,
      icon: 'loading'
    });
  } else {
    let finished = false;
    let isLoading = false;
    let time = 0;
    let p = Promise.all(promiseList);
    p.then(() => {
      finished = true;
      if (isLoading) {
        let cost = Date.now() - time;
        if (cost < 200) {
          setTimeout(() => {
            wx.hideToast();
          }, 300);
        } else {
          wx.hideToast();
        }
      }
    }).catch(e => {
      finished = true;
      apiFail(e);
    });
    setTimeout(() => {
      if (false === finished) {
        isLoading = true;
        time = Date.now();
        wx.showToast({
          mask: true,
          title: "加载中...",
          icon: 'loading',
          duration: 1000 * 1000 //最多显示1000秒load效果
        });
      }
    }, 500);
  }
}

export function hideLoading() {
  wx.hideToast();
}
export function isHuaWei() {
  let systemInfo = wx.getStorageSync("systemInfo");
  let brand = systemInfo.brand;
  if (brand.search('HUAWEI') != -1) {
    return true;
  }
  //return true;
  return false;
}
export function isOppo() {
  let systemInfo = wx.getStorageSync("systemInfo");
  let brand = systemInfo.brand;
  if (brand.search('OPPO') != -1) {
    return true;
  }
  //return true;
  return false;
}
export function getSystemInfo() {
  return wx.getStorageSync("systemInfo");
}
export function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}
/**
 * 最后一次提现时间
 */
export const lastPutForwardTime = {
  set: function (time) {
    wx.setStorageSync("lastPutForwardTime", time);
  },
  get: function () {
    return wx.getStorageSync("lastPutForwardTime");
  }
};

function formatNumber(n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export function setSceneCode(scene) {
  wx.setStorageSync("scenecode", scene);
}
export function getSceneCode() {
  return wx.getStorageSync("scenecode");
}
export function formatDate(inputTime) {
  var date = new Date(inputTime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}

export class NumberAnimate {
  constructor(opt) {
    let def = {
      from: 50,//开始时的数字
      speed: 2000,// 总时间
      refreshTime: 100,// 刷新一次的时间
      decimals: 2,// 小数点后的位数
      onUpdate: function () { }, // 更新时回调函数
      onComplete: function () { } // 完成时回调函数
    }
    this.tempValue = 0;//累加变量值
    this.opt = Object.assign(def, opt);//assign传入配置参数
    this.loopCount = 0;//循环次数计数
    this.loops = Math.ceil(this.opt.speed / this.opt.refreshTime);//数字累加次数
    this.increment = (this.opt.from / this.loops);//每次累加的值
    this.interval = null;//计时器对象
    this.init();
  }
  init() {
    this.interval = setInterval(() => { this.updateTimer() }, this.opt.refreshTime);
  }
  updateTimer() {
    this.loopCount++;
    this.tempValue = this.formatFloat(this.tempValue, this.increment).toFixed(this.opt.decimals);
    if (this.loopCount >= this.loops) {
      clearInterval(this.interval);
      this.tempValue = this.opt.from;
      this.opt.onComplete();
    }
    this.opt.onUpdate();
  }
  //解决0.1+0.2不等于0.3的小数累加精度问题
  formatFloat(num1, num2) {
    let baseNum, baseNum1, baseNum2;
    try {
      baseNum1 = num1.toString().split(".")[1].length;
    } catch (e) {
      baseNum1 = 0;
    }
    try {
      baseNum2 = num2.toString().split(".")[1].length;
    } catch (e) {
      baseNum2 = 0;
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    return (num1 * baseNum + num2 * baseNum) / baseNum;
  };
}
export default {
  event,
  formatNumber,
  formatTime,
  path,
  dataConfig,
  apiFail,
  getUserInfo,
  setUserInfo,
  getLoginInfo,
  setLoginInfo,
  isBindPhone,
  showLoading,
  hideLoading,
  isHuaWei,
  isOppo,
  getSystemInfo,
  compareVersion,
  lastPutForwardTime,
  setSceneCode,
  getSceneCode,
  formatDate,
  NumberAnimate
}