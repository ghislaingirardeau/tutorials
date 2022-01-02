<template>
  <div>
    <p>{{article.user.username}}</p>
  </div>
</template>

<script>

  export default {
    components: {
    },
    props: {
      article: {
        type: Object,
        default: null
      }
    }
  }
</script>