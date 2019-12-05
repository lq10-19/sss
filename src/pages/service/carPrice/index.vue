<template>
	<web-view :src="url"></web-view>
</template>

<script>
export default {
  components: {},

  data() {
    return {
      //url:"https://m.che300.com/baiqian"
      url: "https://bqyx.bqzulin.com/test"
    };
  },
  onLoad(query) {}
};
</script>

<style lang="scss" scoped>
</style>

