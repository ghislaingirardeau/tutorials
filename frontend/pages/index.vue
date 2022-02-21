<template>
  <v-row justify="center" align="center">
    <h1>
        page in {{browserLanguage}}
    </h1>
    <v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>  </v-row>
</template>

<script>
export default {
  layout: "langLayout",
  data() {
    return {
      overlay: true
    }
  },
  props: {
    browserLanguage: {
      type: String,
    }
  },
  created () {
    if(this.browserLanguage != 'en') {
      location.replace('http://localhost:3000/lang/' + this.browserLanguage)
    } else {
      this.overlay = false
    }
  },
}
</script>
