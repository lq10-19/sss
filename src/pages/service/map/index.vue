<template>
  <div>
    <map id="map" :longitude="longitude" :latitude="latitude" scale="14" :polyline="polyline" show-location style="width:100%;height:100vh"></map>
  </div>

</template>
    
<script>
//js 引用方式

export default {
  data() {
    return {
      longitude: "114.08594513",
      latitude: "22.54700089",
      polyline: [
        {
          points: [
            {
              longitude: 113.3245211,
              latitude: 23.10229
            },
            {
              longitude: 113.32452,
              latitude: 23.21229
            }
          ],
          color: "#FF0000DD",
          width: 2,
          dottedLine: true
        }
      ]
    };
  },
  onLoad() {
    wx.getLocation({
      type: "wgs84",
      success: res => {
        this.longitude = res.longitude;
        this.latitude = res.latitude;
      }
    });
  },
  onShareAppMessage(){
    return {
      title: '佰仟易行',
      path: '/pages/service/map/main',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  mounted() {},
  methods: {}
};
</script>