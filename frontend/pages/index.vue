<template>
  <div>
    <h1>Welcome tutorial</h1>
    <h2>{{ testfullname }}</h2>
  </div>
</template>

<script>
export default {
  mounted() {
    console.log(this.$route);
  },
};
</script>

<style lang="scss" scoped>
</style>
