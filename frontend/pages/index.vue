<template>
  <div>
    <h1>Welcome tutorial</h1>
    <h2>{{ testfullname }}  {{revealMixinData}} </h2>
    <v-btn @click="revealMixinFct">change mixin value</v-btn>
    <v-btn v-focus>test directive</v-btn>
  </div>
</template>

<script>
export default {
  directives: {
    focus: {
      // directive definition
      inserted: function (el) {
        el.addEventListener('mouseover', function (){
          console.log('je suis clicke');
        })
      }
    }
  },
  mounted() {
    console.log(process.env.TEST);
  },
};
</script>

<style lang="scss" scoped>
</style>
